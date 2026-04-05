let listening = false;
let recognition;

// MAIN TAP FUNCTION
function handleTap() {
  const glow = document.getElementById("glow");
  const output = document.getElementById("output");
  const hero = document.getElementById("hero");

  // Check support
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported on this device");
    return;
  }

  // START LISTENING
  if (!listening) {

    // Hide hero (🔥 premium feel)
    hero.classList.add("hidden");

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      listening = true;

      glow.classList.add("active");

      output.textContent = "Listening...";
      output.classList.add("active", "listening");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();

      output.classList.remove("listening");
      output.textContent = text;

      console.log("User said:", text);

      // ===== COMMAND DETECTION =====

      if (
        text.includes("job") &&
        (text.includes("create") ||
         text.includes("add") ||
         text.includes("book") ||
         text.includes("new"))
      ) {
        output.textContent = "Customer name?";
      }

      else if (text.includes("dashboard") || text.includes("check job")) {
        output.textContent = "Opening dashboard...";
      }

      else {
        output.textContent = "Command not recognised";
      }

      // Fade out after delay
      setTimeout(() => {
        output.classList.remove("active");
      }, 3000);
    };

    recognition.onend = () => {
      listening = false;
      glow.classList.remove("active");
    };

    recognition.start();

  } else {
    // STOP LISTENING
    recognition.stop();
    listening = false;

    glow.classList.remove("active");

    const output = document.getElementById("output");
    setTimeout(() => {
      output.classList.remove("active");
    }, 300);
  }
}
