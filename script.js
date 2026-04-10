let listening = false;

const tapZone = document.getElementById("tapZone");
const output = document.getElementById("output");

let recognition = null;

// ---------------- GARAGE TYPE ----------------
const garageType = localStorage.getItem("garageType") || "motoflow";

// ---------------- SPEECH RECOGNITION ----------------
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-GB";

  recognition.onstart = () => {
    listening = true;
    tapZone.classList.add("listening");
    output.textContent = "Listening... Speak now.";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.trim();
    output.textContent = text;

    handleCommand(text);
  };

  recognition.onerror = () => {
    listening = false;
    tapZone.classList.remove("listening");
    output.textContent = "Mic error. Try again.";
  };

  recognition.onend = () => {
    listening = false;
    tapZone.classList.remove("listening");

    if (output.textContent === "Listening... Speak now.") {
      output.textContent = "Tap the mic and say a command.";
    }
  };
}

// ---------------- TAP ZONE ----------------
tapZone.addEventListener("click", () => {
  if (!recognition) return;

  if (!listening) recognition.start();
  else recognition.stop();
});

// ---------------- MAIN COMMAND ROUTER ----------------
function handleCommand(command) {
  const cmd = command.toLowerCase();

  // Route to correct garage logic
  if (garageType === "motoflow") {
    handleMotoFlow(cmd, command);
    return;
  }

  if (garageType === "truckflow") {
    handleTruckFlow(cmd, command);
    return;
  }

  if (garageType === "washflow") {
    handleWashFlow(cmd, command);
    return;
  }

  if (garageType === "autoflow") {
    handleAutoFlow(cmd, command);
    return;
  }

  // Fallback
  handleMotoFlow(cmd, command);
}

// ---------------- MOTOFLOW LOGIC ----------------
function handleMotoFlow(cmd, originalText) {
  const newJobWords = ["create", "new", "book", "add"];
  const updateWords = ["update", "existing", "change", "complete", "ready"];

  // CREATE JOB
  if (newJobWords.some(word => cmd.includes(word))) {
    createJob(originalText);
    return;
  }

  // UPDATE JOB
  if (updateWords.some(word => cmd.includes(word))) {
    updateJob(cmd);
    return;
  }

  output.textContent = "MotoFlow: Command not recognised.";
}

// ---------------- TRUCKFLOW (PLACEHOLDER) ----------------
function handleTruckFlow(cmd, originalText) {
  output.textContent = "TruckFlow not configured yet.";
}

// ---------------- WASHFLOW (PLACEHOLDER) ----------------
function handleWashFlow(cmd, originalText) {
  output.textContent = "WashFlow not configured yet.";
}

// ---------------- AUTOFLOW (PLACEHOLDER) ----------------
function handleAutoFlow(cmd, originalText) {
  output.textContent = "AutoFlow not configured yet.";
}

// ---------------- CREATE JOB ----------------
function createJob(command) {
  const newJob = {
    id: Date.now().toString(),
    reference: `Job-${Date.now()}`,
    description: command,
    status: "Pending",
    actions: []
  };

  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");

  jobs.push(newJob);
  localStorage.setItem("jobs", JSON.stringify(jobs));

  // IMPORTANT: tells dashboard which job to open
  localStorage.setItem("currentJobId", newJob.id);

  output.textContent = `${newJob.reference} created...`;

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 500);
}

// ---------------- UPDATE JOB ----------------
function updateJob(cmd) {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");

  const match = jobs.find(job => {
    const desc = job.description.toLowerCase();
    const ref = job.reference.toLowerCase();

    // Match job number
    if (cmd.includes(ref)) return true;

    // Match meaningful words
    return desc.split(" ").some(word => word.length > 3 && cmd.includes(word));
  });

  if (match) {
    localStorage.setItem("currentJobId", match.id);

    output.textContent = `Opening ${match.reference}...`;

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);

    return;
  }

  output.textContent =
    "No matching job found. Say customer name or job number.";
      }
