let listening = false;
let recognition;

function handleTap() {
  const glow = document.getElementById("glow");
  const output = document.getElementById("output");

  if (!('webkitSpeechRecognition' in window)) {
    output.innerText = "Speech not supported";
    output.classList.add("active");
    return;
  }

  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function(event) {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      output.innerText = transcript;
      output.classList.add("active");
      output.classList.remove("listening");
    };

    recognition.onerror = function() {
      output.innerText = "Error...";
    };

    recognition.onend = function() {
      if (listening) {
        recognition.start();
      }
    };
  }

  listening = !listening;

  if (listening) {
    glow.classList.add("active");

    output.innerText = "Listening...";
    output.classList.add("active", "listening");

    recognition.start();

  } else {
    glow.classList.remove("active");
    recognition.stop();

    // Fade out text after stop
    setTimeout(() => {
      output.classList.remove("active");
    }, 1200);
  }
}
