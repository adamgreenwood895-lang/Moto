let listening = false;
let recognition;

function handleTap() {
  const glow = document.getElementById("glow");
  const output = document.getElementById("output");

  // Check browser support
  if (!('webkitSpeechRecognition' in window)) {
    output.innerText = "Speech not supported on this device";
    return;
  }

  // Initialise once
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function(event) {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      // Show live speech on screen
      output.innerText = transcript;
    };

    recognition.onerror = function(event) {
      output.innerText = "Error: " + event.error;
    };

    recognition.onend = function() {
      // Safety: if it stops unexpectedly
      if (listening) {
        recognition.start();
      }
    };
  }

  listening = !listening;

  if (listening) {
    glow.classList.add("active");
    output.innerText = "Listening...";
    recognition.start();
  } else {
    glow.classList.remove("active");
    recognition.stop();
    output.innerText = "";
  }
}
