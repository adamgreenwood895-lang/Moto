const jobList = document.getElementById("jobList");
const completedJobList = document.getElementById("completedJobList");
const jobPanel = document.getElementById("jobPanel");
const jobDesc = document.getElementById("jobDesc");

let currentJobId = null;

// Get job from landing page
const landingJobId = localStorage.getItem("currentJobId");
if (landingJobId) {
  currentJobId = landingJobId;
  localStorage.removeItem("currentJobId");
}

// Get jobs
function getJobs() {
  return JSON.parse(localStorage.getItem("jobs") || "[]");
}

// Render jobs
function renderJobs() {
  const jobs = getJobs();

  jobList.innerHTML = "";
  completedJobList.innerHTML = "";

  jobs.forEach(job => {
    const div = document.createElement("div");
    div.className = "job-card";

    div.innerHTML = `
      <strong>${job.reference}</strong>
      <p>${job.description}</p>
      <button onclick="markReady('${job.id}')">Mark Ready</button>
      <button onclick="deleteJob('${job.id}')">Delete</button>
    `;

    div.onclick = () => openJob(job.id);

    if (job.status === "Ready") {
      completedJobList.appendChild(div);
    } else {
      jobList.appendChild(div);
    }
  });
}

// Open job
function openJob(id) {
  const jobs = getJobs();
  const job = jobs.find(j => j.id === id);

  if (!job) return;

  currentJobId = id;
  jobDesc.value = job.description;
  jobPanel.classList.remove("hidden");
}

// Save job
function saveJob() {
  const jobs = getJobs();

  const updated = jobs.map(j =>
    j.id === currentJobId ? { ...j, description: jobDesc.value } : j
  );

  localStorage.setItem("jobs", JSON.stringify(updated));

  jobPanel.classList.add("hidden");
  renderJobs();
}

// Close panel
function closePanel() {
  jobPanel.classList.add("hidden");
}

// Mark ready
function markReady(id) {
  const jobs = getJobs().map(j =>
    j.id === id ? { ...j, status: "Ready" } : j
  );

  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();
}

// Delete
function deleteJob(id) {
  const jobs = getJobs().filter(j => j.id !== id);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();
}

// Init
renderJobs();

if (currentJobId) {
  openJob(currentJobId);
}
