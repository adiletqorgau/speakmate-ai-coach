const callScreen = document.querySelector(".call-screen");
const startCallButton = document.querySelector("#startCallButton");
const endCallButton = document.querySelector("#endCallButton");
const callStatus = document.querySelector("#callStatus");
const callSubtitle = document.querySelector("#callSubtitle");
const callTimer = document.querySelector("#callTimer");
const callNote = document.querySelector("#callNote");
const installButton = document.querySelector("#installButton");
const closePaywallButton = document.querySelector("#closePaywallButton");
const paywallTelegramButton = document.querySelector("#paywallTelegramButton");

const PAYMENT_TELEGRAM_URL = "https://t.me/adiletqorgau";
const FREE_CALL_MS = 3 * 60 * 1000;
const FREE_TURN_LIMIT = 5;
const TRIAL_END_MESSAGE = "На сегодня наш пробный созвон окончен, ты отлично поработал! Чтобы созваниваться со мной каждый день и учить язык без барьеров, активируй PRO-версию.";

let peerConnection = null;
let dataChannel = null;
let localStream = null;
let remoteAudio = null;
let callStartedAt = 0;
let timerId = null;
let callLimitTimerId = null;
let endAfterMessageTimerId = null;
let userTurns = 0;
let isEnding = false;
let deferredInstallPrompt = null;

paywallTelegramButton.href = PAYMENT_TELEGRAM_URL;

function isProUser() {
  return localStorage.getItem("isPro") === "true" || localStorage.getItem("speakmate-is-pro") === "true";
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

function openPaywall() {
  document.body.classList.add("paywall-open");
  document.querySelector(".paywall-modal")?.setAttribute("aria-hidden", "false");
}

function closePaywall() {
  document.body.classList.remove("paywall-open");
  document.querySelector(".paywall-modal")?.setAttribute("aria-hidden", "true");
}

function cleanupCall() {
  window.clearTimeout(callLimitTimerId);
  window.clearTimeout(endAfterMessageTimerId);
  stopTimer();
  setSpeakingState(false);
  setCallingState(false);
  isEnding = false;

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

function sayTrialEndedThenDisconnect() {
  if (isEnding) {
    return;
  }
  isEnding = true;
  setStatus("Пробный созвон завершен", "Alex сейчас попрощается, затем откроется PRO-доступ.");
  sendRealtimeEvent({
    type: "response.create",
    response: {
      modalities: ["audio", "text"],
      instructions: `Say exactly this in Russian, warmly and naturally: "${TRIAL_END_MESSAGE}"`
    }
  });
  endAfterMessageTimerId = window.setTimeout(() => {
    cleanupCall();
    openPaywall();
  }, 8500);
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
    callSubtitle.textContent = `${userTurns}/${FREE_TURN_LIMIT} реплик`;
    if (!isProUser() && userTurns >= FREE_TURN_LIMIT) {
      sayTrialEndedThenDisconnect();
    }
  }
  if (event.type === "error") {
    setStatus("Ошибка звонка", event.error?.message || "Попробуй завершить и позвонить еще раз.");
  }
}

async function startCall() {
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
    peerConnection = new RTCPeerConnection();
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
      if (!isProUser()) {
        callLimitTimerId = window.setTimeout(sayTrialEndedThenDisconnect, FREE_CALL_MS);
      }
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

    const answerSdp = await response.text();
    if (!response.ok) {
      throw new Error(answerSdp || "Realtime server error");
    }

    await peerConnection.setRemoteDescription({
      type: "answer",
      sdp: answerSdp
    });
  } catch (error) {
    cleanupCall();
    setStatus("Не получилось начать звонок", error.message || "Проверь Render, API key и интернет.");
  } finally {
    startCallButton.disabled = false;
  }
}

function endCall(showPayment = false) {
  cleanupCall();
  setStatus("Звонок завершен", "Нажми «Позвонить», чтобы начать снова.");
  if (showPayment) {
    openPaywall();
  }
}

startCallButton.addEventListener("click", startCall);
endCallButton.addEventListener("click", () => endCall(false));
closePaywallButton.addEventListener("click", closePaywall);

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
