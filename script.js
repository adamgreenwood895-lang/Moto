let listening = false;
let recognition;

// ===== STATE =====
let state = "idle";

let job = {
  customer: "",
  bike: "",
  description: ""
};

// ===== MAIN TAP =====
function handleTap() {
  const glow = document.getElementById("glow");
  const output = document.getElementById("output");
  const hero = document.getElementById("hero");

  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported");
    return;
  }

  if (!listening) {

    // Hide hero (clean UI)
    if (hero) hero.classList.add("hidden");

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

      console.log("User said:", text);

      handleVoice(text, output);
    };

    recognition.onend = () => {
      listening = false;
      glow.classList.remove("active");
    };

    recognition.onerror = () => {
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

// ===== VOICE ENGINE =====
function handleVoice(text, output) {

  output.classList.remove("listening");

  // ===== DASHBOARD COMMAND =====
  if (
    text.includes("dashboard") ||
    text.includes("view jobs") ||
    text.includes("check jobs")
  ) {
    output.textContent = "Opening dashboard...";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

    return;
  }

  // ===== START JOB CREATION =====
  if (state === "idle") {

    if (
      text.includes("job") &&
      (text.includes("create") ||
       text.includes("add") ||
       text.includes("book") ||
       text.includes("new"))
    ) {
      state = "awaiting_customer";
      output.textContent = "Customer name?";
      return;
    }

    output.textContent = "Command not recognised";
    fadeOut(output);
    return;
  }

  // ===== CUSTOMER =====
  if (state === "awaiting_customer") {
    job.customer = text;
    state = "awaiting_bike";

    output.textContent = "Bike make and model?";
    return;
  }

  // ===== BIKE =====
  if (state === "awaiting_bike") {
    job.bike = text;
    state = "awaiting_description";

    output.textContent = "Job description?";
    return;
  }

  // ===== DESCRIPTION + SAVE =====
  if (state === "awaiting_description") {
    job.description = text;

    state = "idle";

    const ref =
      capitalize(job.customer.split(" ")[0]) +
      " " +
      capitalizeWords(job.bike);

    const newJob = {
      id: Date.now(),
      customer: job.customer,
      bike: job.bike,
      description: job.description,
      reference: ref,
      status: "In Progress"
    };

    // SAVE
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs.push(newJob);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    console.log("SAVED JOB:", newJob);

    output.textContent = `Job created: ${ref}`;

    fadeOut(output);

    // Reset job
    job = {
      customer: "",
      bike: "",
      description: ""
    };

    return;
  }
}

// ===== HELPERS =====
function fadeOut(output) {
  setTimeout(() => {
    output.classList.remove("active");
  }, 3000);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function capitalizeWords(text) {
  return text
    .split(" ")
    .map(word => capitalize(word))
    .join(" ");
}
