const callScreen = document.querySelector(".call-screen");
const startCallButton = document.querySelector("#startCallButton");
const endCallButton = document.querySelector("#endCallButton");
const callStatus = document.querySelector("#callStatus");
const callSubtitle = document.querySelector("#callSubtitle");
const callTimer = document.querySelector("#callTimer");
const callNote = document.querySelector("#callNote");
const installButton = document.querySelector("#installButton");

const SIGNALING_TIMEOUT_MS = 25000;

let peerConnection = null;
let dataChannel = null;
let localStream = null;
let remoteAudio = null;
let callStartedAt = 0;
let timerId = null;
let signalingTimeoutId = null;
let userTurns = 0;
let isEnding = false;
let deferredInstallPrompt = null;

function nextReminderDelayMs() {
  const now = new Date();
  const atSeven = new Date(now);
  atSeven.setHours(19, 0, 0, 0);

  const eveningDelay = atSeven.getTime() > now.getTime()
    ? atSeven.getTime() - now.getTime()
    : atSeven.getTime() + 24 * 60 * 60 * 1000 - now.getTime();

  return Math.max(60_000, eveningDelay);
}

async function requestNotificationPermission() {
  if (!("Notification" in window) || Notification.permission === "granted") {
    return;
  }
  if (Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {}
  }
}

async function showPracticeReminder() {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }
  const title = "SpeakMate";
  const body = "Алекс уже соскучилась и ждет твоего звонка! Твои 15 минут практики на сегодня готовы.";
  const registration = await navigator.serviceWorker?.ready.catch(() => null);
  if (registration?.showNotification) {
    registration.showNotification(title, {
      body,
      icon: "assets/ai-tutor.png",
      badge: "assets/ai-tutor.png"
    });
    return;
  }
  new Notification(title, { body });
}

function schedulePracticeReminder() {
  window.clearTimeout(window.speakmateReminderTimer);
  window.speakmateReminderTimer = window.setTimeout(() => {
    showPracticeReminder();
    schedulePracticeReminder();
  }, nextReminderDelayMs());
}

function setStatus(text, note = "") {
  callStatus.textContent = text;
  if (note) {
    callNote.textContent = note;
  }
}

function setCallingState(isCalling) {
  callScreen.classList.toggle("calling", isCalling);
  startCallButton.hidden = isCalling;
  endCallButton.hidden = !isCalling;
}

function setSpeakingState(isSpeaking) {
  callScreen.classList.toggle("speaking", isSpeaking);
}

function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function normalizeSdpAnswer(sdp) {
  const lines = String(sdp || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const start = lines.findIndex((line) => line === "v=0");
  return start >= 0 ? `${lines.slice(start).join("\r\n")}\r\n` : "";
}

function startTimer() {
  callStartedAt = Date.now();
  callTimer.textContent = "00:00";
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    callTimer.textContent = formatTime(Date.now() - callStartedAt);
  }, 500);
}

function stopTimer() {
  window.clearInterval(timerId);
  timerId = null;
}

function cleanupCall() {
  window.clearTimeout(signalingTimeoutId);
  stopTimer();
  setSpeakingState(false);
  setCallingState(false);
  isEnding = false;
  callStartedAt = 0;

  if (dataChannel) {
    try {
      dataChannel.close();
    } catch {}
  }
  dataChannel = null;

  if (peerConnection) {
    try {
      peerConnection.close();
    } catch {}
  }
  peerConnection = null;

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  localStream = null;

  if (remoteAudio) {
    remoteAudio.pause();
    remoteAudio.srcObject = null;
  }
  remoteAudio = null;
}

function createRemoteAudioElement() {
  const audio = document.createElement("audio");
  audio.autoplay = true;
  audio.playsInline = true;
  document.body.appendChild(audio);
  return audio;
}

function sendRealtimeEvent(event) {
  if (!dataChannel || dataChannel.readyState !== "open") {
    return;
  }
  dataChannel.send(JSON.stringify(event));
}

function askAlexToStart() {
  sendRealtimeEvent({
    type: "response.create",
    response: {
      modalities: ["audio", "text"],
      instructions: "Start the call first. Greet the learner warmly in English, then ask one very easy question. Keep it under 2 short sentences."
    }
  });
}

function handleRealtimeEvent(event) {
  if (event.type === "response.audio.delta") {
    setSpeakingState(true);
  }
  if (event.type === "response.audio.done" || event.type === "response.done") {
    setSpeakingState(false);
  }
  if (event.type === "input_audio_buffer.speech_stopped") {
    userTurns += 1;
    callSubtitle.textContent = `${userTurns} реплик`;
  }
  if (event.type === "error") {
    setStatus("Ошибка звонка", event.error?.message || "Попробуй завершить и позвонить еще раз.");
  }
}

async function startCall() {
  await requestNotificationPermission();
  schedulePracticeReminder();

  if (!window.RTCPeerConnection || !navigator.mediaDevices?.getUserMedia) {
    setStatus("Этот браузер не поддерживает живой звонок", "Открой приложение в Chrome на телефоне и разреши микрофон.");
    return;
  }

  cleanupCall();
  userTurns = 0;
  isEnding = false;
  startCallButton.disabled = true;
  setStatus("Соединяю с Alex...", "Разреши микрофон, если телефон спросит.");

  try {
    signalingTimeoutId = window.setTimeout(() => {
      setStatus("Соединение заняло слишком долго", "Render или OpenAI не вернул audio answer. Проверь Render logs.");
    }, SIGNALING_TIMEOUT_MS);

    peerConnection = new RTCPeerConnection();
    peerConnection.addEventListener("connectionstatechange", () => {
      const state = peerConnection?.connectionState || "unknown";
      if (state === "connecting") {
        setStatus("Соединение с голосом...", "Телефон соединяется с Alex через защищенный аудиоканал.");
      }
      if (state === "connected") {
        setStatus("Созвон идет", "Говори как по телефону. Alex слышит и отвечает голосом.");
      }
      if (["failed", "disconnected", "closed"].includes(state) && !isEnding) {
        setStatus("Связь прервалась", `WebRTC status: ${state}. Попробуй позвонить еще раз.`);
      }
    });
    peerConnection.addEventListener("iceconnectionstatechange", () => {
      const state = peerConnection?.iceConnectionState || "unknown";
      if (state === "failed") {
        setStatus("Не удалось соединить аудио", "ICE failed. Проверь интернет и попробуй еще раз.");
      }
    });
    remoteAudio = createRemoteAudioElement();

    peerConnection.ontrack = (event) => {
      remoteAudio.srcObject = event.streams[0];
    };

    localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    localStream.getAudioTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    dataChannel = peerConnection.createDataChannel("oai-events");
    dataChannel.addEventListener("open", () => {
      setCallingState(true);
      startTimer();
      setStatus("Созвон идет", "Говори как по телефону. Alex слышит и отвечает голосом.");
      askAlexToStart();
    });
    dataChannel.addEventListener("message", (event) => {
      try {
        handleRealtimeEvent(JSON.parse(event.data));
      } catch {
        // Ignore non-JSON diagnostic events.
      }
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const response = await fetch("/api/realtime/call", {
      method: "POST",
      headers: { "content-type": "application/sdp" },
      body: offer.sdp
    });

    const answerSdp = normalizeSdpAnswer(await response.text());
    window.clearTimeout(signalingTimeoutId);
    if (!response.ok) {
      throw new Error(answerSdp || "Realtime server error");
    }
    if (!answerSdp.trim().startsWith("v=0")) {
      throw new Error(`Server returned non-SDP answer: ${answerSdp.slice(0, 220)}`);
    }

    await peerConnection.setRemoteDescription({
      type: "answer",
      sdp: answerSdp
    });
    setStatus("Подключаю аудиоканал...", "Если Alex не заговорит через несколько секунд, открой диагностику Render.");
  } catch (error) {
    cleanupCall();
    setStatus("Не получилось начать звонок", error.message || "Проверь Render, API key и интернет.");
  } finally {
    startCallButton.disabled = false;
  }
}

function endCall() {
  cleanupCall();
  schedulePracticeReminder();
  setStatus("Звонок завершен", "Нажми «Позвонить», чтобы начать снова.");
}

startCallButton.addEventListener("click", startCall);
endCallButton.addEventListener("click", () => endCall(false));

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

window.addEventListener("pagehide", () => cleanupCall());

schedulePracticeReminder();
