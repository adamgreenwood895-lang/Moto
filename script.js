let listening = false;
let recognition;

// Conversation state
let mode = "idle";
let jobData = {
  name: "",
  bike: "",
  description: ""
};

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
      const text = event.results[0][0].transcript.toLowerCase();
      console.log("User said:", text);

      processCommand(text, output);
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

    setTimeout(() => {
      document.getElementById("output").classList.remove("active");
    }, 300);
  }
}

function processCommand(text, output) {

  // ===== JOB CREATION TRIGGER =====
  if (
    mode === "idle" &&
    text.includes("job") &&
    (text.includes("create") || text.includes("add") || text.includes("new") || text.includes("book"))
  ) {
    mode = "awaiting_name";
    output.textContent = "Customer name?";
    return;
  }

  // ===== STEP 1: NAME =====
  if (mode === "awaiting_name") {
    jobData.name = text;
    mode = "awaiting_bike";
    output.textContent = "Bike make and model?";
    return;
  }

  // ===== STEP 2: BIKE =====
  if (mode === "awaiting_bike") {
    jobData.bike = text;
    mode = "awaiting_description";
    output.textContent = "Job description?";
    return;
  }

  // ===== STEP 3: DESCRIPTION =====
  if (mode === "awaiting_description") {
    jobData.description = text;

    const reference = `${capitalize(jobData.name)} ${jobData.bike}`;

    output.textContent = `Job created: ${reference}`;

    console.log("JOB CREATED:", jobData);

    // Reset system
    mode = "idle";
    jobData = { name: "", bike: "", description: "" };

    setTimeout(() => {
      output.classList.remove("active");
    }, 2500);

    return;
  }

  // ===== DASHBOARD / UPDATE =====
  if (
    text.includes("update") ||
    text.includes("check") ||
    text.includes("customer")
  ) {
    output.textContent = "Opening dashboard...";
    console.log("Dashboard intent detected");

    // future: window.location = "dashboard.html";

    return;
  }

  // ===== FALLBACK =====
  output.textContent = "Command not recognised";
}

// Helper
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
