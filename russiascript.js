const video = document.getElementById('intro-video');
const codeDialog = document.getElementById('code-dialog');
const codeInput = document.getElementById('code-input');
const submitCodeButton = document.getElementById('submit-code');

// Empêche les contrôles vidéo par l'utilisateur
video.controls = false;

// Démarre automatiquement la vidéo avec gestion des exceptions
window.onload = function () {
  video.play().catch(() => {
    console.log("Autoplay blocked. User interaction required.");
    const playFallbackButton = document.createElement("button");
    playFallbackButton.textContent = "Connect";
    playFallbackButton.style.position = "absolute";
    playFallbackButton.style.top = "50%";
    playFallbackButton.style.left = "50%";
    playFallbackButton.style.transform = "translate(-50%, -50%)";
    playFallbackButton.style.padding = "10px 20px";
    playFallbackButton.style.fontSize = "16px";
    playFallbackButton.style.color = "#f00";
    playFallbackButton.style.backgroundColor = "#000";
    playFallbackButton.style.border = "none";
    playFallbackButton.style.cursor = "pointer";
    document.body.appendChild(playFallbackButton);

    playFallbackButton.addEventListener("click", () => {
      video.muted = false;
      video.play().catch(console.error);
      playFallbackButton.remove();
    });
  });
};

// Gérer la fin de la vidéo
video.onended = function () {
  video.style.display = "none"; // Cache la vidéo
  codeDialog.style.display = "block"; // Affiche la boîte de dialogue
};

// Valider le code
submitCodeButton.addEventListener("click", function () {
  const code = codeInput.value.trim();
  if (code === "FF1C1C") {
    window.location.href = "russia2.html"; // Redirige vers la deuxième page
  } else {
    alert("Incorrect code. Try again.");
  }
});

// Empêche clic-droit sur la vidéo
video.addEventListener("contextmenu", (event) => event.preventDefault());
