let listening = false;

const glow = document.getElementById("glow");
const output = document.getElementById("output");

let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    listening = true;
    glow.classList.add("active");

    output.textContent = "Listening...";
    output.classList.add("active");
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;

    output.textContent = text;

    setTimeout(() => {
      output.classList.remove("active");
    }, 2500);
  };

  recognition.onend = () => {
    listening = false;
    glow.classList.remove("active");
  };
}

function toggleMic() {
  if (!recognition) return;

  if (!listening) {
    recognition.start();
  } else {
    recognition.stop();
    glow.classList.remove("active");
  }
}
