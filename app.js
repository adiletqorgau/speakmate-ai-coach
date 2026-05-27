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

const smartLessons = [
  {
    topic: "Daily conversation",
    title: "Short natural answers",
    explain: "When someone asks you a simple question, answer with one clear sentence first. Then add one small detail.",
    example: "I am good today. I am learning English after work.",
    practice: "Answer this: How are you today?",
    starter: "I am good today because..."
  },
  {
    topic: "Grammar",
    title: "I am / I want / I can",
    explain: "Use I am for your state, I want for your goal, and I can for your ability.",
    example: "I am busy. I want to speak better. I can practice every day.",
    practice: "Write 3 short sentences: I am..., I want..., I can...",
    starter: "I am... I want... I can..."
  },
  {
    topic: "Word order",
    title: "Subject + verb + detail",
    explain: "English sentences usually start with a person or thing, then an action, then details.",
    example: "I study English every morning.",
    practice: "Make one sentence about what you do every day.",
    starter: "I practice English..."
  },
  {
    topic: "Questions",
    title: "Ask one easy question",
    explain: "To keep a conversation alive, ask one short question back.",
    example: "What do you do after work?",
    practice: "Write one question you can ask Alex.",
    starter: "What do you..."
  },
  {
    topic: "Natural phrase",
    title: "Sound more natural",
    explain: "Instead of translating word by word, use short natural phrases.",
    example: "I need a little more practice.",
    practice: "Write one phrase about your English goal.",
    starter: "I need..."
  }
];

const examQuestions = [
  {
    title: "Conversation",
    question: "Answer in English: How was your day today?",
    starter: "My day was..."
  },
  {
    title: "Grammar",
    question: "Write one sentence with: I want to...",
    starter: "I want to..."
  },
  {
    title: "Vocabulary",
    question: "Use one word from today in a sentence.",
    starter: "Today I learned..."
  }
];

const coachBubble = document.querySelector("#coachBubble");
const appShell = document.querySelector(".app-shell");
const transcript = document.querySelector("#transcript");
const feedback = document.querySelector("#feedback");
const micButton = document.querySelector("#micButton");
const hintButton = document.querySelector("#hintButton");
const sendTextButton = document.querySelector("#sendTextButton");
const typedPhrase = document.querySelector("#typedPhrase");
const statusDot = document.querySelector("#statusDot");
const statusText = document.querySelector("#statusText");
const settingsButton = document.querySelector("#settingsButton");
const soundToggle = document.querySelector("#soundToggle");
const avatarWrap = document.querySelector("#avatarWrap");
const wordsList = document.querySelector("#wordsList");
const dialogTask = document.querySelector("#dialogTask");
const currentTask = document.querySelector("#currentTask");
const tabs = document.querySelectorAll(".mode-tab");
const appNavButtons = document.querySelectorAll(".app-nav-button");
const appPanels = document.querySelectorAll("[data-panel]");
const jumpViewButtons = document.querySelectorAll("[data-jump-view]");
const chatList = document.querySelector("#chatList");
const clearChatButton = document.querySelector("#clearChatButton");
const installButton = document.querySelector("#installButton");
const levelSelect = document.querySelector("#levelSelect");
const goalSelect = document.querySelector("#goalSelect");
const todayScore = document.querySelector("#todayScore");
const progressBar = document.querySelector("#progressBar");
const focusText = document.querySelector("#focusText");
const resetProgressButton = document.querySelector("#resetProgressButton");
const mistakeSummary = document.querySelector("#mistakeSummary");
const mistakeList = document.querySelector("#mistakeList");
const clearMistakesButton = document.querySelector("#clearMistakesButton");
const pronunciationTarget = document.querySelector("#pronunciationTarget");
const pronunciationFeedback = document.querySelector("#pronunciationFeedback");
const pronunciationButton = document.querySelector("#pronunciationButton");
const hearTargetButton = document.querySelector("#hearTargetButton");
const newPronunciationButton = document.querySelector("#newPronunciationButton");
const scoreCircle = document.querySelector("#scoreCircle");
const dailyPlanList = document.querySelector("#dailyPlanList");
const resetDailyPlanButton = document.querySelector("#resetDailyPlanButton");
const memorySummary = document.querySelector("#memorySummary");
const weaknessList = document.querySelector("#weaknessList");
const resetMemoryButton = document.querySelector("#resetMemoryButton");
const lessonStepBadge = document.querySelector("#lessonStepBadge");
const smartLessonTopic = document.querySelector("#smartLessonTopic");
const smartLessonTitle = document.querySelector("#smartLessonTitle");
const smartLessonExplain = document.querySelector("#smartLessonExplain");
const smartLessonExample = document.querySelector("#smartLessonExample");
const smartLessonPractice = document.querySelector("#smartLessonPractice");
const smartLessonAnswer = document.querySelector("#smartLessonAnswer");
const smartLessonResult = document.querySelector("#smartLessonResult");
const startSmartLessonButton = document.querySelector("#startSmartLessonButton");
const checkSmartLessonButton = document.querySelector("#checkSmartLessonButton");
const nextSmartLessonButton = document.querySelector("#nextSmartLessonButton");
const examScoreBadge = document.querySelector("#examScoreBadge");
const examIntro = document.querySelector("#examIntro");
const examStepLabel = document.querySelector("#examStepLabel");
const examQuestionText = document.querySelector("#examQuestionText");
const examAnswer = document.querySelector("#examAnswer");
const examResult = document.querySelector("#examResult");
const startExamButton = document.querySelector("#startExamButton");
const checkExamButton = document.querySelector("#checkExamButton");
const nextExamButton = document.querySelector("#nextExamButton");
const newWordInput = document.querySelector("#newWordInput");
const newTranslationInput = document.querySelector("#newTranslationInput");
const addWordButton = document.querySelector("#addWordButton");
const clearVocabularyButton = document.querySelector("#clearVocabularyButton");
const quizWordButton = document.querySelector("#quizWordButton");
const vocabularySummary = document.querySelector("#vocabularySummary");
const vocabularyList = document.querySelector("#vocabularyList");
const reminderStatus = document.querySelector("#reminderStatus");
const morningTime = document.querySelector("#morningTime");
const dayTime = document.querySelector("#dayTime");
const eveningTime = document.querySelector("#eveningTime");
const enableRemindersButton = document.querySelector("#enableRemindersButton");
const testReminderButton = document.querySelector("#testReminderButton");
const resetRemindersButton = document.querySelector("#resetRemindersButton");
const reminderList = document.querySelector("#reminderList");
const coachStyleSelect = document.querySelector("#coachStyleSelect");
const russianLevelSelect = document.querySelector("#russianLevelSelect");
const speechSpeedSelect = document.querySelector("#speechSpeedSelect");
const coachFocusSelect = document.querySelector("#coachFocusSelect");
const resetPersonalityButton = document.querySelector("#resetPersonalityButton");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const personalitySummary = document.querySelector("#personalitySummary");

const pronunciationPhrases = [
  "I want to speak English clearly.",
  "Could you please repeat that slowly?",
  "I am learning English every day.",
  "My pronunciation is getting better.",
  "I would like to practice a short conversation.",
  "Today I want to improve my speaking skills."
];

const defaultDailyPlan = [
  {
    id: "morning",
    title: "Morning words",
    task: "Learn and say 4 words from Слова дня.",
    prompt: "Give me 4 beginner words for today and ask me to make sentences."
  },
  {
    id: "afternoon",
    title: "Speaking practice",
    task: "Say 5 short sentences about your day.",
    prompt: "Start a short daily conversation with me. Ask one easy question at a time."
  },
  {
    id: "evening",
    title: "Evening review",
    task: "Review mistakes and repeat corrected phrases.",
    prompt: "Review my mistakes from today and quiz me gently."
  }
];

let currentMode = "talk";
let voiceEnabled = true;
let recognition = null;
let deferredInstallPrompt = null;
let history = JSON.parse(localStorage.getItem("speakmate-history") || "[]");
let mistakes = JSON.parse(localStorage.getItem("speakmate-mistakes") || "[]");
let dailyPlan = JSON.parse(localStorage.getItem("speakmate-daily-plan") || "null") || createDailyPlan();
let learnerMemory = JSON.parse(localStorage.getItem("speakmate-memory") || "null") || {
  weaknessCounts: {},
  lastUpdated: todayKey()
};
let smartLessonState = JSON.parse(localStorage.getItem("speakmate-smart-lesson") || "null") || {
  day: todayKey(),
  index: 0,
  completed: []
};
let examState = JSON.parse(localStorage.getItem("speakmate-daily-exam") || "null") || {
  day: todayKey(),
  index: 0,
  score: 0,
  checked: [],
  finished: false
};
let vocabulary = JSON.parse(localStorage.getItem("speakmate-vocabulary") || "[]");
let reminders = JSON.parse(localStorage.getItem("speakmate-reminders") || "null") || {
  enabled: false,
  morning: "09:00",
  day: "14:00",
  evening: "20:00",
  lastShown: {}
};
let personality = JSON.parse(localStorage.getItem("speakmate-personality") || "null") || {
  style: "kind",
  russianLevel: "balanced",
  speechSpeed: "slow",
  focus: "speaking"
};
let profile = JSON.parse(localStorage.getItem("speakmate-profile") || "null") || {
  level: "beginner",
  goal: "daily conversation",
  day: todayKey(),
  phrasesToday: 0,
  correctionsToday: 0,
  focus: "Say 5 short English sentences today."
};
let pronunciationIndex = Number(localStorage.getItem("speakmate-pronunciation-index") || "0");

function speak(text) {
  if (!voiceEnabled || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = personality.speechSpeed === "slow" ? 0.82 : personality.speechSpeed === "fast" ? 1.12 : 1;
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

function setAppView(view) {
  appShell.dataset.activeView = view;
  appNavButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  appPanels.forEach((panel) => {
    const views = (panel.dataset.panel || "").split(" ");
    panel.classList.toggle("panel-hidden", !views.includes(view));
  });
  localStorage.setItem("speakmate-active-view", view);
  window.scrollTo({ top: 0, behavior: "smooth" });
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

function createDailyPlan() {
  return {
    day: todayKey(),
    tasks: defaultDailyPlan.map((task) => ({ ...task, done: false }))
  };
}

function refreshDailyPlan() {
  if (dailyPlan.day !== todayKey()) {
    dailyPlan = createDailyPlan();
    saveDailyPlan();
  }
}

function saveDailyPlan() {
  localStorage.setItem("speakmate-daily-plan", JSON.stringify(dailyPlan));
}

function renderDailyPlan() {
  refreshDailyPlan();
  dailyPlanList.innerHTML = dailyPlan.tasks
    .map((task) => `
      <article class="daily-task ${task.done ? "done" : ""}">
        <input type="checkbox" data-task-check="${task.id}" ${task.done ? "checked" : ""} aria-label="${escapeHtml(task.title)}">
        <div>
          <strong>${escapeHtml(task.title)}</strong>
          <p>${escapeHtml(task.task)}</p>
        </div>
        <button type="button" data-task-start="${task.id}">Start</button>
      </article>
    `)
    .join("");
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
  updateDailyPlanFromProgress();
}

function updateDailyPlanFromProgress() {
  refreshDailyPlan();
  const speakingTask = dailyPlan.tasks.find((task) => task.id === "afternoon");
  if (speakingTask && profile.phrasesToday >= 5) {
    speakingTask.done = true;
  }
  const reviewTask = dailyPlan.tasks.find((task) => task.id === "evening");
  if (reviewTask && mistakes.length >= 2) {
    reviewTask.done = true;
  }
  saveDailyPlan();
  renderDailyPlan();
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

function saveMistakes() {
  localStorage.setItem("speakmate-mistakes", JSON.stringify(mistakes));
}

function addMistake(userText, data) {
  if (!data.correction || data.correction.trim().length < 3) {
    return;
  }

  const item = {
    id: Date.now(),
    original: userText,
    correction: data.correction,
    explanation: data.explanation_ru || "",
    category: data.mistake_category || "General",
    date: todayKey()
  };

  mistakes.unshift(item);
  mistakes = mistakes.slice(0, 20);
  saveMistakes();
  updateMemory(item.category);
  renderMistakes();
}

function saveMemory() {
  localStorage.setItem("speakmate-memory", JSON.stringify(learnerMemory));
}

function updateMemory(category) {
  if (!category || category === "No mistake") {
    return;
  }
  learnerMemory.weaknessCounts[category] = (learnerMemory.weaknessCounts[category] || 0) + 1;
  learnerMemory.lastUpdated = todayKey();
  saveMemory();
  renderMemory();
}

function topWeaknesses(limit = 5) {
  return Object.entries(learnerMemory.weaknessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, count]) => ({ category, count }));
}

function renderMemory() {
  const top = topWeaknesses();
  if (!top.length) {
    memorySummary.textContent = "Alex будет запоминать частые ошибки и подбирать упражнения.";
    weaknessList.innerHTML = "";
    return;
  }
  memorySummary.textContent = `Главный фокус: ${top[0].category}. Alex будет чаще тренировать эту тему.`;
  weaknessList.innerHTML = top
    .map((item) => `
      <div class="weakness-item">
        <strong>${escapeHtml(item.category)}</strong>
        <span>${item.count}</span>
      </div>
    `)
    .join("");
}

function saveSmartLesson() {
  localStorage.setItem("speakmate-smart-lesson", JSON.stringify(smartLessonState));
}

function refreshSmartLesson() {
  if (smartLessonState.day !== todayKey()) {
    smartLessonState = {
      day: todayKey(),
      index: 0,
      completed: []
    };
    saveSmartLesson();
  }
}

function currentSmartLesson() {
  refreshSmartLesson();
  const weakness = topWeaknesses(1)[0]?.category || "";
  const weaknessMatch = smartLessons.find((lesson) => lesson.topic.toLowerCase() === weakness.toLowerCase());
  if (weaknessMatch && smartLessonState.index === 0) {
    return weaknessMatch;
  }
  return smartLessons[smartLessonState.index % smartLessons.length];
}

function renderSmartLesson() {
  const lesson = currentSmartLesson();
  const step = (smartLessonState.index % smartLessons.length) + 1;
  lessonStepBadge.textContent = `${step} / ${smartLessons.length}`;
  smartLessonTopic.textContent = lesson.topic;
  smartLessonTitle.textContent = lesson.title;
  smartLessonExplain.textContent = lesson.explain;
  smartLessonExample.textContent = lesson.example;
  smartLessonPractice.textContent = lesson.practice;
  smartLessonAnswer.placeholder = lesson.starter;
  const isDone = smartLessonState.completed.includes(lesson.title);
  smartLessonResult.textContent = isDone
    ? "This lesson is done. Press Next for a new one."
    : "Press Start lesson when you are ready.";
}

function selectMode(mode) {
  currentMode = mode;
  tabs.forEach((item) => item.classList.toggle("active", item.dataset.mode === mode));
  updateLesson(mode, false);
}

function startSmartLesson() {
  const lesson = currentSmartLesson();
  selectMode("lesson");
  coachBubble.textContent = `${lesson.title}. ${lesson.explain}`;
  feedback.textContent = lesson.practice;
  typedPhrase.value = lesson.starter;
  smartLessonAnswer.value = "";
  smartLessonResult.textContent = "Listen to Alex, then write your answer and press Check.";
  speak(`${lesson.title}. ${lesson.explain} Example: ${lesson.example}`);
}

function nextSmartLesson() {
  smartLessonState.index = (smartLessonState.index + 1) % smartLessons.length;
  saveSmartLesson();
  renderSmartLesson();
  startSmartLesson();
}

function saveExam() {
  localStorage.setItem("speakmate-daily-exam", JSON.stringify(examState));
}

function refreshExam() {
  if (examState.day !== todayKey()) {
    examState = {
      day: todayKey(),
      index: 0,
      score: 0,
      checked: [],
      finished: false
    };
    saveExam();
  }
}

function currentExamQuestion() {
  refreshExam();
  return examQuestions[examState.index % examQuestions.length];
}

function renderExam() {
  refreshExam();
  const question = currentExamQuestion();
  examScoreBadge.textContent = `${examState.score} / ${examQuestions.length}`;
  examStepLabel.textContent = `Question ${examState.index + 1}: ${question.title}`;
  examQuestionText.textContent = examState.finished
    ? "Daily exam is finished. Great work today."
    : question.question;
  examAnswer.placeholder = question.starter;
  if (examState.finished) {
    const percent = Math.round((examState.score / examQuestions.length) * 100);
    examIntro.textContent = `Your result today: ${percent}%.`;
    examResult.textContent = percent >= 70
      ? "Strong day. Tomorrow Alex can make the questions a little harder."
      : "Good start. Tomorrow Alex will repeat the weak parts gently.";
    return;
  }
  examIntro.textContent = "В конце дня Alex проверит разговор, грамматику и слова.";
  examResult.textContent = examState.checked.includes(examState.index)
    ? "This answer is checked. Press Next."
    : "Write your answer, then press Check.";
}

function startExam() {
  refreshExam();
  examState.index = 0;
  examState.score = 0;
  examState.checked = [];
  examState.finished = false;
  saveExam();
  renderExam();
  examAnswer.value = "";
  selectMode("daily");
  const question = currentExamQuestion();
  coachBubble.textContent = `Daily exam. ${question.question}`;
  speak(`Daily exam. ${question.question}`);
}

function nextExamQuestion() {
  if (!examState.checked.includes(examState.index)) {
    examResult.textContent = "First press Check for this answer.";
    return;
  }
  if (examState.index >= examQuestions.length - 1) {
    examState.finished = true;
    saveExam();
    renderExam();
    speak(examResult.textContent);
    return;
  }
  examState.index += 1;
  saveExam();
  renderExam();
  examAnswer.value = "";
  const question = currentExamQuestion();
  coachBubble.textContent = question.question;
  speak(question.question);
}

function saveVocabulary() {
  localStorage.setItem("speakmate-vocabulary", JSON.stringify(vocabulary));
}

function renderVocabulary() {
  vocabularySummary.textContent = vocabulary.length
    ? `В словаре слов: ${vocabulary.length}. Alex может спрашивать их в разговоре.`
    : "Сохраняй слова, которые хочешь повторять.";
  vocabularyList.innerHTML = vocabulary
    .slice(0, 24)
    .map((item) => `
      <article class="vocabulary-item">
        <div>
          <strong>${escapeHtml(item.word)}</strong>
          <span>${escapeHtml(item.translation || "без перевода")}</span>
        </div>
        <button type="button" data-delete-word="${item.id}">×</button>
      </article>
    `)
    .join("");
}

function addVocabularyWord(word, translation = "") {
  const cleanWord = word.trim();
  const cleanTranslation = translation.trim();
  if (!cleanWord) {
    vocabularySummary.textContent = "Напиши слово на английском.";
    return;
  }
  const exists = vocabulary.some((item) => item.word.toLowerCase() === cleanWord.toLowerCase());
  if (exists) {
    vocabularySummary.textContent = "Это слово уже есть в словаре.";
    return;
  }
  vocabulary.unshift({
    id: Date.now(),
    word: cleanWord,
    translation: cleanTranslation,
    addedAt: todayKey(),
    practiced: 0
  });
  vocabulary = vocabulary.slice(0, 80);
  saveVocabulary();
  renderVocabulary();
  newWordInput.value = "";
  newTranslationInput.value = "";
}

function quizVocabularyWord() {
  if (!vocabulary.length) {
    vocabularySummary.textContent = "Сначала добавь хотя бы одно слово.";
    return;
  }
  const word = vocabulary[Math.floor(Math.random() * vocabulary.length)];
  word.practiced = (word.practiced || 0) + 1;
  saveVocabulary();
  typedPhrase.value = `Ask me to use the word "${word.word}" in an English sentence. Its Russian meaning is "${word.translation || "unknown"}".`;
  feedback.textContent = `Word practice: ${word.word}`;
  selectMode("lesson");
  askCoach(typedPhrase.value);
}

function saveReminders() {
  localStorage.setItem("speakmate-reminders", JSON.stringify(reminders));
}

function reminderTasks() {
  return [
    {
      id: "morning",
      title: "Morning",
      time: reminders.morning,
      text: "Say 3 easy English sentences to Alex."
    },
    {
      id: "day",
      title: "Day",
      time: reminders.day,
      text: "Practice one saved word from your vocabulary."
    },
    {
      id: "evening",
      title: "Evening",
      time: reminders.evening,
      text: "Take the daily exam and repeat mistakes."
    }
  ];
}

function renderReminders() {
  morningTime.value = reminders.morning;
  dayTime.value = reminders.day;
  eveningTime.value = reminders.evening;
  const permission = "Notification" in window ? Notification.permission : "not supported";
  reminderStatus.textContent = reminders.enabled
    ? `Напоминания включены. Разрешение телефона: ${permission}.`
    : "Включи напоминания, и SpeakMate будет подсказывать, когда заниматься.";
  reminderList.innerHTML = reminderTasks()
    .map((item) => `
      <div class="reminder-item">
        <strong>${escapeHtml(item.time)}</strong>
        <span>${escapeHtml(item.title)}: ${escapeHtml(item.text)}</span>
      </div>
    `)
    .join("");
}

function showReminder(title, body) {
  coachBubble.textContent = body;
  feedback.textContent = body;
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "assets/ai-tutor.png"
    });
  }
  speak(body);
}

function checkReminders() {
  if (!reminders.enabled) {
    return;
  }
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const today = todayKey();
  for (const item of reminderTasks()) {
    const key = `${today}-${item.id}`;
    if (currentTime >= item.time && reminders.lastShown[key] !== true) {
      reminders.lastShown[key] = true;
      saveReminders();
      showReminder(`SpeakMate ${item.title}`, item.text);
      renderReminders();
      break;
    }
  }
}

async function enableReminders() {
  reminders.morning = morningTime.value || "09:00";
  reminders.day = dayTime.value || "14:00";
  reminders.evening = eveningTime.value || "20:00";
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
  reminders.enabled = true;
  saveReminders();
  renderReminders();
  showReminder("SpeakMate", "Reminders are ready. I will help you practice during the day.");
}

function savePersonality() {
  localStorage.setItem("speakmate-personality", JSON.stringify(personality));
}

function personalityText() {
  const styleText = {
    kind: "добрый и поддерживающий",
    strict: "строгий и требовательный",
    funny: "веселый и живой",
    business: "деловой и спокойный"
  }[personality.style];
  const russianText = {
    balanced: "русский и английский поровну",
    less: "меньше русского, больше английского",
    more: "больше русского объяснения"
  }[personality.russianLevel];
  const speedText = {
    slow: "медленная речь",
    normal: "обычная скорость",
    fast: "быстрая речь"
  }[personality.speechSpeed];
  const focusTextMap = {
    speaking: "разговор",
    grammar: "грамматика",
    pronunciation: "произношение",
    vocabulary: "слова"
  };
  return `Alex: ${styleText}; ${russianText}; ${speedText}; фокус: ${focusTextMap[personality.focus]}.`;
}

function renderPersonality() {
  coachStyleSelect.value = personality.style;
  russianLevelSelect.value = personality.russianLevel;
  speechSpeedSelect.value = personality.speechSpeed;
  coachFocusSelect.value = personality.focus;
  personalitySummary.textContent = personalityText();
}

function updatePersonality() {
  personality = {
    style: coachStyleSelect.value,
    russianLevel: russianLevelSelect.value,
    speechSpeed: speechSpeedSelect.value,
    focus: coachFocusSelect.value
  };
  savePersonality();
  renderPersonality();
  coachBubble.textContent = personalityText();
}

function openSettings() {
  document.body.classList.add("settings-open");
  document.querySelector(".settings-modal")?.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  document.body.classList.remove("settings-open");
  document.querySelector(".settings-modal")?.setAttribute("aria-hidden", "true");
}

function renderMistakes() {
  if (!mistakes.length) {
    mistakeSummary.textContent = "Пока ошибок нет. Скажи или напиши фразу, и Alex сохранит полезные исправления.";
    mistakeList.innerHTML = "";
    return;
  }

  mistakeSummary.textContent = `Сохранено ошибок: ${mistakes.length}. Повторяй их, чтобы Alex видел прогресс.`;
  mistakeList.innerHTML = mistakes
    .slice(0, 6)
    .map((item) => `
      <article class="mistake-item">
        <strong>${escapeHtml(item.category)}</strong>
        <p><b>Ты:</b> ${escapeHtml(item.original)}</p>
        <p><b>Лучше:</b> ${escapeHtml(item.correction)}</p>
        ${item.explanation ? `<p>${escapeHtml(item.explanation)}</p>` : ""}
        <button type="button" data-repeat="${escapeHtml(item.correction)}">Повторить</button>
      </article>
    `)
    .join("");
}

function normalizeSpeech(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scorePronunciation(expected, heard, confidence = 0.7) {
  const expectedWords = normalizeSpeech(expected).split(" ").filter(Boolean);
  const heardWords = normalizeSpeech(heard).split(" ").filter(Boolean);
  const matched = expectedWords.filter((word) => heardWords.includes(word)).length;
  const coverage = expectedWords.length ? matched / expectedWords.length : 0;
  const lengthPenalty = Math.min(1, heardWords.length / Math.max(expectedWords.length, 1));
  return Math.round((coverage * 0.75 + confidence * 0.2 + lengthPenalty * 0.05) * 100);
}

function pronunciationTip(expected, heard, score) {
  const expectedWords = normalizeSpeech(expected).split(" ").filter(Boolean);
  const heardWords = normalizeSpeech(heard).split(" ").filter(Boolean);
  const missing = expectedWords.filter((word) => !heardWords.includes(word)).slice(0, 3);

  if (score >= 85) {
    return "Great pronunciation. Now say it a little faster, but keep it clear.";
  }

  if (missing.length) {
    return `Try again and focus on: ${missing.join(", ")}. Say each word slowly first.`;
  }

  return "Good try. Repeat slowly, then connect the words more smoothly.";
}

function renderPronunciationTarget() {
  pronunciationIndex %= pronunciationPhrases.length;
  pronunciationTarget.textContent = pronunciationPhrases[pronunciationIndex];
  localStorage.setItem("speakmate-pronunciation-index", String(pronunciationIndex));
}

function setPronunciationScore(score) {
  const safeScore = Math.max(0, Math.min(score, 100));
  scoreCircle.textContent = `${safeScore}%`;
  scoreCircle.style.background = `conic-gradient(var(--teal) ${safeScore}%, #dff7f1 0)`;
}

function runPronunciationPractice() {
  if (!recognition) {
    pronunciationFeedback.textContent = "Открой приложение в Chrome и разреши микрофон. Если не получится, тренируйся через обычную кнопку «Говорить».";
    return;
  }

  const target = pronunciationTarget.textContent;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const pronunciationRecognition = new SpeechRecognition();
  pronunciationRecognition.lang = "en-US";
  pronunciationRecognition.interimResults = false;
  pronunciationRecognition.maxAlternatives = 1;

  pronunciationRecognition.addEventListener("start", () => {
    setListening(true);
    pronunciationFeedback.textContent = "Слушаю фразу...";
  });
  pronunciationRecognition.addEventListener("end", () => setListening(false));
  pronunciationRecognition.addEventListener("result", (event) => {
    const result = event.results[0][0];
    const heard = result.transcript;
    const score = scorePronunciation(target, heard, result.confidence || 0.7);
    setPronunciationScore(score);
    pronunciationFeedback.textContent = `Я услышал: "${heard}". ${pronunciationTip(target, heard, score)}`;
  });
  pronunciationRecognition.addEventListener("error", () => {
    setListening(false);
    pronunciationFeedback.textContent = "Не получилось услышать. Попробуй ближе к микрофону и говори чуть медленнее.";
  });

  pronunciationRecognition.start();
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

async function askCoach(text, options = {}) {
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
        profile,
        memory: {
          topWeaknesses: topWeaknesses(3),
          correctionsToday: profile.correctionsToday
        },
        lesson: options.lesson || null,
        vocabulary: vocabulary.slice(0, 12),
        personality
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
    addMistake(message, data);
    if (data.next_task) {
      currentTask.textContent = data.next_task;
    }
    updateProgress(data);
    if (options.lessonCheck) {
      const lesson = options.lesson || currentSmartLesson();
      if (!smartLessonState.completed.includes(lesson.title)) {
        smartLessonState.completed.push(lesson.title);
      }
      saveSmartLesson();
      renderSmartLesson();
      smartLessonResult.textContent = note || coachText;
    }
    if (options.examCheck) {
      const isGood = !data.correction || data.mistake_category === "No mistake";
      if (!examState.checked.includes(examState.index)) {
        examState.checked.push(examState.index);
        if (isGood) {
          examState.score += 1;
        }
      }
      saveExam();
      renderExam();
      examResult.textContent = isGood
        ? "Correct. Press Next."
        : `${note || coachText} Press Next after reading.`;
    }
    speak(data.speak_text || coachText);
  } catch (error) {
    const messageText = error.message.includes("OPENAI_API_KEY")
      ? "Нужно добавить OpenAI API key на сервер. Я ниже объясню, как."
      : "AI сейчас не ответил. Проверь сервер и интернет, потом попробуй еще раз.";
    feedback.textContent = messageText;
    coachBubble.textContent = messageText;
    if (options.lessonCheck) {
      smartLessonResult.textContent = messageText;
    }
    if (options.examCheck) {
      examResult.textContent = messageText;
    }
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

function makeAvatarGesture() {
  if (avatarWrap.classList.contains("speaking") || avatarWrap.classList.contains("listening")) {
    return;
  }
  avatarWrap.classList.add("gesture");
  window.setTimeout(() => avatarWrap.classList.remove("gesture"), 950);
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
    selectMode(tab.dataset.mode);
    speak(lessons[currentMode].bubble);
  });
});

appNavButtons.forEach((button) => {
  button.addEventListener("click", () => setAppView(button.dataset.view));
});

jumpViewButtons.forEach((button) => {
  button.addEventListener("click", () => setAppView(button.dataset.jumpView));
});

settingsButton.addEventListener("click", openSettings);
closeSettingsButton.addEventListener("click", closeSettings);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSettings();
  }
});

micButton.addEventListener("click", () => {
  if (!recognition) {
    feedback.textContent = "В этом браузере голосовое распознавание может не работать. Напиши фразу вручную или открой приложение в Chrome.";
    return;
  }

  recognition.start();
});

sendTextButton.addEventListener("click", () => askCoach(typedPhrase.value));

startSmartLessonButton.addEventListener("click", startSmartLesson);

checkSmartLessonButton.addEventListener("click", () => {
  const lesson = currentSmartLesson();
  const answer = smartLessonAnswer.value.trim() || typedPhrase.value.trim();
  if (!answer) {
    smartLessonResult.textContent = "Write your answer first, then press Check.";
    return;
  }
  smartLessonResult.textContent = "Alex is checking your lesson answer...";
  askCoach(`Lesson answer for "${lesson.title}": ${answer}`, {
    lesson,
    lessonCheck: true
  });
});

nextSmartLessonButton.addEventListener("click", nextSmartLesson);

startExamButton.addEventListener("click", startExam);

checkExamButton.addEventListener("click", () => {
  if (examState.finished) {
    examResult.textContent = "Today's exam is already finished.";
    return;
  }
  const question = currentExamQuestion();
  const answer = examAnswer.value.trim();
  if (!answer) {
    examResult.textContent = "Write your answer first.";
    return;
  }
  examResult.textContent = "Alex is checking your exam answer...";
  askCoach(`Daily exam question: ${question.question}\nMy answer: ${answer}`, {
    examQuestion: question,
    examCheck: true
  });
});

nextExamButton.addEventListener("click", nextExamQuestion);

addWordButton.addEventListener("click", () => {
  addVocabularyWord(newWordInput.value, newTranslationInput.value);
});

newTranslationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addVocabularyWord(newWordInput.value, newTranslationInput.value);
  }
});

quizWordButton.addEventListener("click", quizVocabularyWord);

clearVocabularyButton.addEventListener("click", () => {
  vocabulary = [];
  saveVocabulary();
  renderVocabulary();
});

vocabularyList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-delete-word]");
  if (!button) {
    return;
  }
  vocabulary = vocabulary.filter((item) => String(item.id) !== button.dataset.deleteWord);
  saveVocabulary();
  renderVocabulary();
});

enableRemindersButton.addEventListener("click", enableReminders);

testReminderButton.addEventListener("click", () => {
  showReminder("SpeakMate test", "This is how Alex will remind you to practice English.");
});

resetRemindersButton.addEventListener("click", () => {
  reminders = {
    enabled: false,
    morning: "09:00",
    day: "14:00",
    evening: "20:00",
    lastShown: {}
  };
  saveReminders();
  renderReminders();
});

[morningTime, dayTime, eveningTime].forEach((input) => {
  input.addEventListener("change", () => {
    reminders.morning = morningTime.value || "09:00";
    reminders.day = dayTime.value || "14:00";
    reminders.evening = eveningTime.value || "20:00";
    saveReminders();
    renderReminders();
  });
});

[coachStyleSelect, russianLevelSelect, speechSpeedSelect, coachFocusSelect].forEach((select) => {
  select.addEventListener("change", updatePersonality);
});

resetPersonalityButton.addEventListener("click", () => {
  personality = {
    style: "kind",
    russianLevel: "balanced",
    speechSpeed: "slow",
    focus: "speaking"
  };
  savePersonality();
  renderPersonality();
});

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

clearMistakesButton.addEventListener("click", () => {
  mistakes = [];
  localStorage.removeItem("speakmate-mistakes");
  renderMistakes();
});

pronunciationButton.addEventListener("click", runPronunciationPractice);

hearTargetButton.addEventListener("click", () => {
  speak(pronunciationTarget.textContent);
});

newPronunciationButton.addEventListener("click", () => {
  pronunciationIndex += 1;
  renderPronunciationTarget();
  setPronunciationScore(0);
  pronunciationFeedback.textContent = "Нажми «Слушать», потом «Тренировать» и повтори фразу.";
});

mistakeList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-repeat]");
  if (!button) {
    return;
  }
  typedPhrase.value = button.dataset.repeat;
  typedPhrase.focus();
  feedback.textContent = "Повтори эту фразу вслух или нажми Отправить, чтобы Alex проверил еще раз.";
});

dailyPlanList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[data-task-check]");
  if (!checkbox) {
    return;
  }
  const task = dailyPlan.tasks.find((item) => item.id === checkbox.dataset.taskCheck);
  if (task) {
    task.done = checkbox.checked;
    saveDailyPlan();
    renderDailyPlan();
  }
});

dailyPlanList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-task-start]");
  if (!button) {
    return;
  }
  const task = dailyPlan.tasks.find((item) => item.id === button.dataset.taskStart);
  if (!task) {
    return;
  }
  typedPhrase.value = task.prompt;
  feedback.textContent = `Task started: ${task.title}. Press Отправить and Alex will guide you.`;
  typedPhrase.focus();
});

resetDailyPlanButton.addEventListener("click", () => {
  dailyPlan = createDailyPlan();
  saveDailyPlan();
  renderDailyPlan();
});

resetMemoryButton.addEventListener("click", () => {
  learnerMemory = {
    weaknessCounts: {},
    lastUpdated: todayKey()
  };
  saveMemory();
  renderMemory();
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
setAppView("home");
renderChat();
renderProfile();
renderMistakes();
renderPronunciationTarget();
renderDailyPlan();
renderMemory();
renderSmartLesson();
renderExam();
renderVocabulary();
renderReminders();
renderPersonality();
setInterval(checkReminders, 60_000);
setInterval(makeAvatarGesture, 5200);
checkReminders();
