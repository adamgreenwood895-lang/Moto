document.querySelector(".mic-ring").addEventListener("click", () => {
  const command = prompt("Say a command (Add job / Dashboard)");

  if (!command) return;

  const text = command.toLowerCase();

  if (text.includes("add job")) {
    window.location.href = "job.html";
  } 
  else if (text.includes("dashboard")) {
    window.location.href = "dashboard.html";
  } 
  else {
    alert("Command not recognised");
  }
});
