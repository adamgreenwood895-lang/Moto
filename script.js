function handleTap() {
  console.log("Mic tapped");

  const zone = document.querySelector(".tap-zone");

  zone.style.boxShadow = "0 0 60px rgba(255,165,0,0.9)";

  setTimeout(() => {
    zone.style.boxShadow = "none";
  }, 300);

  alert("Listening...");
}
