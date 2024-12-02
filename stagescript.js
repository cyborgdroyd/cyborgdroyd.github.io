const matrixContainer = document.getElementById('matrix');
const columnCount = Math.floor(window.innerWidth / 20); // Nombre de colonnes (largeur totale)

// Tableau pour stocker les colonnes de caractères
const columns = [];

// Créer les colonnes pour l'effet Matrix
for (let i = 0; i < columnCount; i++) {
    const column = {
        x: Math.random() * (window.innerWidth - 20), // Position aléatoire sur x
        y: Math.random() * window.innerHeight, // Position aléatoire sur y
        speed: Math.random() * 1.5 + 1.5, // Vitesse aléatoire
        char: '',
        element: createColumnElement(Math.random() * (window.innerWidth - 20)),
        changeInterval: Math.random() * 5 + 5, // Intervalle pour changer de caractère
        counter: 0
    };
    columns.push(column);
}

function createColumnElement(xPosition) {
    const columnElement = document.createElement('div');
    columnElement.classList.add('matrix-column');
    columnElement.style.left = `${xPosition}px`;
    matrixContainer.appendChild(columnElement);
    return columnElement;
}

function randomChar() {
    const chars = '1488';
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function animateMatrix() {
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.counter >= column.changeInterval) {
            column.char = randomChar();
            column.element.innerText = column.char;
            column.counter = 0;
        } else {
            column.counter++;
        }
        column.x -= column.speed;
        column.y += column.speed;
        if (column.x < -20 || column.y > window.innerHeight) {
            column.x = Math.random() * (window.innerWidth - 20);
            column.y = -20;
        }
        column.element.style.left = `${column.x}px`;
        column.element.style.top = `${column.y}px`;
    }
    requestAnimationFrame(animateMatrix);
}

animateMatrix();

window.onload = function () {
    const video = document.getElementById('intro-video');
    const button = document.getElementById('code-button');

    video.controls = false;

    setTimeout(() => {
        video.play().then(() => {
            console.log("Video playing with sound.");
        }).catch(() => {
            console.log("Autoplay blocked. Waiting for user interaction.");
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
    }, 1000);

    video.onended = function () {
        video.pause();
        video.src = "";
        video.remove();
        button.style.display = 'block';
    };

    video.addEventListener("contextmenu", (event) => event.preventDefault());
    video.addEventListener("pause", () => video.play());
    video.setAttribute("disablePictureInPicture", true);
};
