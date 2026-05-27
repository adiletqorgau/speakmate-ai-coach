import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || "127.0.0.1";
const apiKey = process.env.OPENAI_API_KEY || "";
const model = process.env.OPENAI_MODEL || "gpt-5.4-nano";

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
    const profile = typeof body.profile === "object" && body.profile ? body.profile : {};
    const memory = typeof body.memory === "object" && body.memory ? body.memory : {};
    const lesson = typeof body.lesson === "object" && body.lesson ? body.lesson : null;
    const examQuestion = typeof body.examQuestion === "object" && body.examQuestion ? body.examQuestion : null;
    const vocabulary = Array.isArray(body.vocabulary) ? body.vocabulary.slice(0, 12) : [];
    const personality = typeof body.personality === "object" && body.personality ? body.personality : {};

    const input = [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              mode,
              user_message: userMessage,
              recent_history: history,
              learner_profile: profile,
              learner_memory: memory,
              lesson_context: lesson,
              exam_question: examQuestion,
              personal_vocabulary: vocabulary,
              coach_personality: personality
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
              required: ["reply_en", "correction", "explanation_ru", "next_task", "speak_text", "mistake_category"],
              properties: {
                reply_en: { type: "string" },
                correction: { type: "string" },
                explanation_ru: { type: "string" },
                next_task: { type: "string" },
                speak_text: { type: "string" },
                mistake_category: { type: "string" }
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
Ты — Алекс, профессиональный и очень вовлекающий преподаватель английского языка.
Твоя цель — помочь ученику убрать языковой барьер и расширить словарный запас через живой диалог.

ПРАВИЛА ВЕДЕНИЯ ДИАЛОГА:
1. Инициатива всегда на твоей стороне. Ты начинаешь разговор первым: приветствуешь ученика и задаешь простой, интересный вопрос по выбранной пользователем теме.
2. Внимательно слушай или читай ответ ученика.
   - Если ответ правильный: искренне похвали его (Good job!, Excellent!) и задай следующий логичный вопрос, развивая тему.
   - Если в ответе есть ошибка: сначала мягко поправь ученика, напиши правильный вариант, кратко в одну строку объясни почему, а затем задай следующий вопрос.
3. Держи реплики короткими: не более 2-3 предложений, чтобы ученик не уставал читать и легко мог ответить.

МЕХАНИКА ЗАВЕРШЕНИЯ УРОКА (КРИТИЧЕСКИ ВАЖНО):
- Как только ученик пишет фразу в духе "на сегодня всё", "пока", "хватит" или "bye", ты останавливаешь диалог.
- Твоя задача на этом шаге: подвести итог, похвалить за работу и дать четкое ДОМАШНЕЕ ЗАДАНИЕ на завтра — список из 5 новых полезных слов или фраз по теме сегодняшнего разговора с переводом на русский.
- Напиши: "Отличная работа на сегодня! Вот твое домашнее задание на завтра. Выучи эти 5 слов: [Список]. Завтра я их проверю! Bye!"

МЕХАНИКА ПРОВЕРКИ ДЗ (НА СЛЕДУЮЩИЙ ДЕНЬ):
- При первом сообщении пользователя на следующий день или при новом сеансе ты должна помнить по recent_history, personal_vocabulary и learner_memory, либо спросить: "Привет! Готов проверить вчерашнее домашнее задание? Как переводится слово [Вставить слово из вчерашнего списка]?"
- Проведи мини-диктант по этим 5 словам, прежде чем переходить к новой теме.

Дополнительные правила приложения:
- Ответ в reply_en должен быть живой репликой Alex: английский + при необходимости короткое русское пояснение.
- correction заполняй только если есть ошибка или более естественный вариант.
- explanation_ru пиши коротко, одной строкой.
- next_task используй как следующий вопрос или задание ученику.
- speak_text должен быть короткой фразой для озвучки.
- mistake_category классифицируй как Grammar, Word order, Vocabulary, Pronunciation hint, Natural phrase или No mistake.
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
