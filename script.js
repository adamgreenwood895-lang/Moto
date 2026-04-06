let listening = false;
let recognition;

function handleTap() {
  const glow = document.getElementById("glow");
  const output = document.getElementById("output");

  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported");
    return;
  }

  if (!listening) {
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

    recognition.start();

  } else {
    recognition.stop();
    listening = false;
    glow.classList.remove("active");
  }
}
