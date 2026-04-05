let listening = false;
let recognition;

function handleTap() {
  const glow = document.getElementById("glow");

  // Check support
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported on this device");
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

      console.log("You said:", transcript);
    };

    recognition.onerror = function(e) {
      console.log("Error:", e);
    };
  }

  listening = !
