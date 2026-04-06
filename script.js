let listening = false;

const output = document.getElementById("output");
const glow = document.getElementById("glow");

function toggleMic() {
  if (!listening) {
    startListening();
  } else {
    stopListening();
  }
}

function startListening() {
  listening = true;

  glow.classList.add("active");

  output.textContent = "Listening...";
  output.classList.add("active");

  setTimeout(() => {
    stopListening();
  }, 3000);
}

function stopListening() {
  listening = false;

  glow.classList.remove("active");

  output.classList.remove("active");
}
