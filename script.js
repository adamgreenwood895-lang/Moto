let listening = false;

const output = document.getElementById("output");
const glow = document.getElementById("glow");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;

function toggleMic() {
  if (!listening) {
    recognition.start();
  } else {
    recognition.stop();
  }
}

recognition.onstart = () => {
  listening = true;
  glow.classList.add("active");

  output.textContent = "Listening...";
  output.classList.add("active");
};

recognition.onresult = (event) => {
  const text = event.results[0][0].transcript.toLowerCase();

  output.textContent = text;

  handleVoice(text);
};

recognition.onend = () => {
  listening = false;
  glow.classList.remove("active");
};

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-GB";
  window.speechSynthesis.speak(speech);

  output.textContent = text;
  output.classList.add("active");
}

function handleVoice(text) {

  // 🔥 START SIMPLE FLOW
  if (text.includes("book")) {
    speak("What bike is it?");
  }

  else if (text.includes("yamaha") || text.includes("honda")) {
    speak("What is the issue?");
  }

  else if (text.includes("engine") || text.includes("brake")) {
    speak("Job created");
  }

  else {
    speak("Command not recognised");
  }
}
