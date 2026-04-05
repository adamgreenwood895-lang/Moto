let listening = false;

function handleTap() {
  const glow = document.getElementById("glow");

  listening = !listening;

  if (listening) {
    glow.classList.add("active");

    // Simulate listening
    console.log("Listening...");
    
  } else {
    glow.classList.remove("active");

    console.log("Stopped");
  }
}
