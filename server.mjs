import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || "127.0.0.1";
const apiKey = process.env.OPENAI_API_KEY || "";
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    return handleChat(req, res);
  }

  const url = new URL(req.url || "/", `http://localhost:${port}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, safePath);

  try {
    const file = await readFile(filePath);
    res.writeHead(200, {
      "content-type": types[extname(filePath)] || "application/octet-stream"
    });
    res.end(file);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, host, () => {
  console.log(`SpeakMate is running at http://${host}:${port}`);
  if (!apiKey) {
    console.log("OPENAI_API_KEY is not set yet. AI chat will show a setup message.");
  }
});

async function handleChat(req, res) {
  try {
    if (!apiKey) {
      return sendJson(res, 500, {
        error: "OPENAI_API_KEY is not set on the server."
      });
    }

    const body = await readJson(req);
    const userMessage = String(body.message || "").slice(0, 1200);
    const mode = String(body.mode || "talk");
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];

    const input = [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              mode,
              user_message: userMessage,
              recent_history: history
            })
          }
        ]
      }
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions: tutorInstructions(),
        input,
        max_output_tokens: 700,
        text: {
          format: {
            type: "json_schema",
            name: "english_tutor_reply",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["reply_en", "correction", "explanation_ru", "next_task", "speak_text"],
              properties: {
                reply_en: { type: "string" },
                correction: { type: "string" },
                explanation_ru: { type: "string" },
                next_task: { type: "string" },
                speak_text: { type: "string" }
              }
            }
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI error:", response.status, data.error?.message || data);
      return sendJson(res, response.status, {
        error: data.error?.message || "OpenAI request failed."
      });
    }

    const text = extractOutputText(data);
    const parsed = JSON.parse(text);
    return sendJson(res, 200, parsed);
  } catch (error) {
    console.error("Server error:", error);
    return sendJson(res, 500, {
      error: error.message || "Server error"
    });
  }
}

function tutorInstructions() {
  return `
You are Alex, a warm AI English teacher for a Russian-speaking beginner.
Act like a real conversation partner, not a worksheet.
Always answer in friendly natural English first, then give a short Russian explanation.
Correct mistakes gently. Do not repeat the same template.
If the user asks your name or greets you, answer naturally.
If the user's English is unclear, infer the intent and provide a better sentence.
Keep replies short enough for mobile voice practice.
Do not explain your internal reasoning.
Return only valid JSON matching the schema.
`;
}

function extractOutputText(data) {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  for (const item of data.output || []) {
    if (typeof item.text === "string") {
      return item.text;
    }

    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        return content.text;
      }
      if (content.type === "text" && content.text) {
        return content.text;
      }
      if (content.type === "json_schema" && content.text) {
        return content.text;
      }
      if (typeof content === "string") {
        return content;
      }
    }
  }

  console.error("Unexpected OpenAI response:", JSON.stringify(data, null, 2));
  if (data.status === "incomplete") {
    throw new Error("OpenAI response was incomplete. Try again or use a non-reasoning chat model.");
  }
  throw new Error("No text returned from OpenAI.");
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, value) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(value));
}
