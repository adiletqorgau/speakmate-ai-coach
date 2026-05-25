const lessons = {
  talk: {
    bubble: "Let's talk like real people. Ask me anything in English.",
    task: "Start with: Hi Alex, can we practice English today?",
    words: ["confidently", "practice", "mistake", "improve"],
    dialog: "Alex: How was your day? You: My day was..."
  },
  lesson: {
    bubble: "Today's lesson mode: I explain, correct, and give short tasks.",
    task: "Make 3 sentences about your daily routine.",
    words: ["usually", "always", "sometimes", "never"],
    dialog: "Alex: What do you usually do in the morning?"
  },
  daily: {
    bubble: "Daily coach mode: I will guide your English during the day.",
    task: "Morning words, afternoon speaking, evening review.",
    words: ["goal", "schedule", "repeat", "remember"],
    dialog: "Alex: What is your English goal for today?"
  }
};

const coachBubble = document.querySelector("#coachBubble");
const transcript = document.querySelector("#transcript");
const feedback = document.querySelector("#feedback");
const micButton = document.querySelector("#micButton");
const hintButton = document.querySelector("#hintButton");
const sendTextButton = document.querySelector("#sendTextButton");
const typedPhrase = document.querySelector("#typedPhrase");
const statusDot = document.querySelector("#statusDot");
const statusText = document.querySelector("#statusText");
const soundToggle = document.querySelector("#soundToggle");
const avatarWrap = document.querySelector("#avatarWrap");
const wordsList = document.querySelector("#wordsList");
const dialogTask = document.querySelector("#dialogTask");
const currentTask = document.querySelector("#currentTask");
const tabs = document.querySelectorAll(".mode-tab");
const chatList = document.querySelector("#chatList");
const clearChatButton = document.querySelector("#clearChatButton");
const installButton = document.querySelector("#installButton");
const levelSelect = document.querySelector("#levelSelect");
const goalSelect = document.querySelector("#goalSelect");
const todayScore = document.querySelector("#todayScore");
const progressBar = document.querySelector("#progressBar");
const focusText = document.querySelector("#focusText");
const resetProgressButton = document.querySelector("#resetProgressButton");

let currentMode = "talk";
let voiceEnabled = true;
let recognition = null;
let deferredInstallPrompt = null;
let history = JSON.parse(localStorage.getItem("speakmate-history") || "[]");
let profile = JSON.parse(localStorage.getItem("speakmate-profile") || "null") || {
  level: "beginner",
  goal: "daily conversation",
  day: todayKey(),
  phrasesToday: 0,
  correctionsToday: 0,
  focus: "Say 5 short English sentences today."
};

function speak(text) {
  if (!voiceEnabled || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1.02;
  utterance.addEventListener("start", () => avatarWrap.classList.add("speaking"));
  utterance.addEventListener("end", () => avatarWrap.classList.remove("speaking"));
  utterance.addEventListener("error", () => avatarWrap.classList.remove("speaking"));
  window.speechSynthesis.speak(utterance);
}

function updateLesson(mode, shouldSpeak = true) {
  const lesson = lessons[mode];
  coachBubble.textContent = lesson.bubble;
  currentTask.textContent = lesson.task;
  dialogTask.textContent = lesson.dialog;
  wordsList.innerHTML = lesson.words.map((word) => `<li>${word}</li>`).join("");
  if (shouldSpeak) {
    speak(lesson.bubble);
  }
}

function addMessage(role, text, note = "") {
  history.push({ role, text, note });
  history = history.slice(-20);
  localStorage.setItem("speakmate-history", JSON.stringify(history));
  renderChat();
}

function saveProfile() {
  localStorage.setItem("speakmate-profile", JSON.stringify(profile));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function refreshDailyProfile() {
  if (profile.day !== todayKey()) {
    profile.day = todayKey();
    profile.phrasesToday = 0;
    profile.correctionsToday = 0;
    profile.focus = "Start your day with 5 easy English sentences.";
    saveProfile();
  }
}

function renderProfile() {
  refreshDailyProfile();
  levelSelect.value = profile.level;
  goalSelect.value = profile.goal;
  todayScore.textContent = `${profile.phrasesToday} phrases today`;
  progressBar.style.width = `${Math.min(profile.phrasesToday * 10, 100)}%`;
  focusText.textContent = `Focus: ${profile.focus}`;
}

function updateProgress(data) {
  profile.phrasesToday += 1;
  if (data.correction) {
    profile.correctionsToday += 1;
  }
  if (data.next_task) {
    profile.focus = data.next_task;
  }
  saveProfile();
  renderProfile();
}

function renderChat() {
  chatList.innerHTML = history
    .map((item) => {
      const safeText = escapeHtml(item.text);
      const safeNote = item.note ? `<small>${escapeHtml(item.note)}</small>` : "";
      return `<div class="message ${item.role}">${safeText}${safeNote}</div>`;
    })
    .join("");
  chatList.scrollTop = chatList.scrollHeight;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

async function askCoach(text) {
  const message = text.trim();
  if (!message) {
    feedback.textContent = "Напиши или скажи фразу на английском.";
    return;
  }

  transcript.textContent = message;
  typedPhrase.value = "";
  addMessage("user", message);
  setThinking(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message,
        mode: currentMode,
        history: history.slice(-12),
        profile
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "AI server error");
    }

    const coachText = data.reply_en || data.reply || "Let's continue.";
    const note = [data.correction, data.explanation_ru].filter(Boolean).join(" ");
    feedback.textContent = note || data.next_task || "Good. Let's continue.";
    coachBubble.textContent = coachText;
    addMessage("coach", coachText, note);
    if (data.next_task) {
      currentTask.textContent = data.next_task;
    }
    updateProgress(data);
    speak(data.speak_text || coachText);
  } catch (error) {
    const messageText = error.message.includes("OPENAI_API_KEY")
      ? "Нужно добавить OpenAI API key на сервер. Я ниже объясню, как."
      : "AI сейчас не ответил. Проверь сервер и интернет, потом попробуй еще раз.";
    feedback.textContent = messageText;
    coachBubble.textContent = messageText;
  } finally {
    setThinking(false);
  }
}

function setThinking(isThinking) {
  statusDot.classList.toggle("listening", isThinking);
  avatarWrap.classList.toggle("speaking", isThinking);
  statusText.textContent = isThinking ? "Alex думает..." : "Готова слушать";
  sendTextButton.disabled = isThinking;
  micButton.disabled = isThinking;
}

function setListening(isListening) {
  statusDot.classList.toggle("listening", isListening);
  avatarWrap.classList.toggle("listening", isListening);
  statusText.textContent = isListening ? "Слушаю тебя..." : "Готова слушать";
  micButton.textContent = isListening ? "Слушаю..." : "🎙️ Говорить";
}

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const instance = new SpeechRecognition();
  instance.lang = "en-US";
  instance.interimResults = false;
  instance.maxAlternatives = 1;

  instance.addEventListener("start", () => setListening(true));
  instance.addEventListener("end", () => setListening(false));
  instance.addEventListener("result", (event) => {
    const text = event.results[0][0].transcript;
    askCoach(text);
  });
  instance.addEventListener("error", () => {
    setListening(false);
    feedback.textContent = "Микрофон не сработал. Можно написать фразу вручную и нажать Отправить.";
  });

  return instance;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    currentMode = tab.dataset.mode;
    updateLesson(currentMode);
  });
});

micButton.addEventListener("click", () => {
  if (!recognition) {
    feedback.textContent = "В этом браузере голосовое распознавание может не работать. Напиши фразу вручную или открой приложение в Chrome.";
    return;
  }

  recognition.start();
});

sendTextButton.addEventListener("click", () => askCoach(typedPhrase.value));

typedPhrase.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    askCoach(typedPhrase.value);
  }
});

hintButton.addEventListener("click", () => {
  const hint = lessons[currentMode].task;
  typedPhrase.value = hint;
  feedback.textContent = hint;
  coachBubble.textContent = hint;
  speak(hint);
});

soundToggle.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  soundToggle.textContent = voiceEnabled ? "🔊" : "🔇";
  if (!voiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

clearChatButton.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("speakmate-history");
  renderChat();
});

levelSelect.addEventListener("change", () => {
  profile.level = levelSelect.value;
  profile.focus = `Practice ${profile.goal} at ${profile.level} level.`;
  saveProfile();
  renderProfile();
});

goalSelect.addEventListener("change", () => {
  profile.goal = goalSelect.value;
  profile.focus = `Practice ${profile.goal} at ${profile.level} level.`;
  saveProfile();
  renderProfile();
});

resetProgressButton.addEventListener("click", () => {
  profile.phrasesToday = 0;
  profile.correctionsToday = 0;
  profile.focus = "Say 5 short English sentences today.";
  saveProfile();
  renderProfile();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

recognition = setupRecognition();
updateLesson(currentMode, false);
renderChat();
renderProfile();
