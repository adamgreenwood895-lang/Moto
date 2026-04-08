let listening = false;

const micButton = document.getElementById("micButton");
const output = document.getElementById("output");
const statusEl = document.getElementById("status");

let recognition = null;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-GB";

  recognition.onstart = () => {
    listening = true;
    micButton.classList.add("listening");
    output.textContent = "Listening...";
    statusEl.textContent = "Speak a command now.";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    output.textContent = text;
    statusEl.textContent = "Command captured.";
  };

  recognition.onerror = () => {
    statusEl.textContent = "Mic error. Try again.";
  };

  recognition.onend = () => {
    listening = false;
    micButton.classList.remove("listening");
    if (!output.textContent || output.textContent === "Listening...") {
      output.textContent = "Tap the mic and say a command.";
    }
  };
} else {
  statusEl.textContent = "Speech recognition is not supported in this browser.";
}

micButton.addEventListener("click", () => {
  if (!recognition) return;

  if (!listening) {
    recognition.start();
  } else {
    recognition.stop();
  }
});
