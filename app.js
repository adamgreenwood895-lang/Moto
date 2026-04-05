// ===============================
// VOICE SETUP
// ===============================
const micBtn = document.getElementById("micBtn");
const statusText = document.getElementById("statusText");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-GB";
recognition.continuous = false;
recognition.interimResults = false;

// ===============================
// STORAGE SYSTEM
// ===============================
function getJobs() {
  return JSON.parse(localStorage.getItem("moto_jobs") || "[]");
}

function saveJobs(jobs) {
  localStorage.setItem("moto_jobs", JSON.stringify(jobs));
}

// ===============================
// COMMAND HANDLER
// ===============================
function handleCommand(text) {
  text = text.toLowerCase();

  // DASHBOARD
  if (text.includes("dashboard")) {
    window.location.href = "dashboard.html";
    return;
  }

  // ADD JOB
  if (text.includes("add job")) {
    createJobFromVoice(text);
    window.location.href = "dashboard.html";
    return;
  }

  alert("Command not recognised");
}

// ===============================
// JOB CREATION (SMART PARSER)
// ===============================
function createJobFromVoice(text) {
  let jobs = getJobs();

  // VERY SIMPLE PARSING (can upgrade later)
  let bike = "Motorbike";
  let task = "General Service";

  if (text.includes("yamaha")) bike = "Yamaha";
  if (text.includes("honda")) bike = "Honda";
  if (text.includes("kawasaki")) bike = "Kawasaki";

  if (text.includes("chain")) task = "Chain Replacement";
  if (text.includes("oil")) task = "Oil Change";
  if (text.includes("brake")) task = "Brake Service";

  const newJob = {
    id: Date.now(),
    title: bike + " - " + task,
    status: "In Progress"
  };

  jobs.push(newJob);
  saveJobs(jobs);
}

// ===============================
// MIC EVENTS
// ===============================
micBtn.addEventListener("click", () => {
  recognition.start();
  statusText.innerText = "Listening...";
});

recognition.onresult = (event) => {
  const text = event.results[0][0].transcript;
  statusText.innerText = "Heard: " + text;

  handleCommand(text);
};

recognition.onerror = () => {
  statusText.innerText = "Error listening";
};

recognition.onend = () => {
  statusText.innerText = "Tap to speak";
};
