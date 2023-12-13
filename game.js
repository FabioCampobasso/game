const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const jumpHeight = 10;
const frictionFactor = 0.8;
const platformGravity = 2.2; // Gravità applicata alle piattaforme
let playerVelocity = { x: 0, y: 10 };
let gravity = 0.5;
let moveSpeed = 10; // Velocità di movimento orizzontale
let isJumping = false;
let gameInProgress = true;


// Inizializzazione delle piattaforme
function createPlatforms() {
    const platformHeight = gameArea.offsetHeight / 5; // Divide l'area di gioco in 5 sezioni verticali
    const platformWidth = 70; // Larghezza della piattaforma

    for (let i = 0; i < 5; i++) {
        let platform = document.createElement('div');
        platform.classList.add('platform');
        platform.style.left = Math.random() * (gameArea.offsetWidth - platformWidth) + 'px'; // Assicurati che la piattaforma sia interamente all'interno dell'area di gioco
        platform.style.top = (gameArea.offsetHeight - (i + 1) * platformHeight) + 'px'; // Posiziona le piattaforme dal basso
        gameArea.appendChild(platform);
    }
}

function createNewPlatform() {
    const platformWidth = 70; // Larghezza della piattaforma

    let platform = document.createElement('div');
    platform.classList.add('platform');
    platform.style.left = Math.random() * (gameArea.offsetWidth - platformWidth) + 'px'; // Assicurati che la piattaforma sia interamente all'interno dell'area di gioco
    platform.style.top = '-20px'; // Inizia appena fuori dall'area di gioco in alto
    gameArea.appendChild(platform);
}

// Funzione per aggiornare le piattaforme
function updatePlatforms() {
    let platforms = document.querySelectorAll('.platform');
    const downwardMovement = 2; // Spostamento verso il basso per frame in pixel

    platforms.forEach(platform => {
        let topPosition = parseFloat(platform.style.top);
        topPosition += downwardMovement; // Sposta la piattaforma verso il basso di 2px per frame
        platform.style.top = topPosition + 'px'; // Aggiorna la posizione della piattaforma

        // Rimuovi le piattaforme che hanno raggiunto il fondo dell'area di gioco
        if (topPosition > gameArea.offsetHeight) {
            platform.remove();
        }
    });

    // Genera nuove piattaforme se il numero attuale è inferiore a 5
    if (platforms.length < 5) {
        createNewPlatform();
    }
}

// ... [Codice precedente] ...

function updatePlayer() {
	if (!gameInProgress) return;
    playerVelocity.y += gravity;

    let playerBottom = parseInt(player.style.top) + player.offsetHeight;
    let playerTop = parseInt(player.style.top);
    let playerLeft = parseInt(player.style.left);
    let playerRight = playerLeft + player.offsetWidth;
 if (playerBottom >= gameArea.offsetHeight) {
        gameOver();
        return;
    }

    // Controlla la collisione con il terreno
    if (playerBottom >= gameArea.offsetHeight - 20) {
        playerVelocity.y = -25; // Aumenta il rimbalzo
        player.style.top = (gameArea.offsetHeight - player.offsetHeight - 20) + 'px';
    }

    // Controlla la collisione con le piattaforme
    let platforms = document.querySelectorAll('.platform');
    for (let platform of platforms) {
        let platformTop = parseInt(platform.style.top);
        let platformBottom = platformTop + platform.offsetHeight;
        let platformLeft = parseInt(platform.style.left);
        let platformRight = platformLeft + platform.offsetWidth;

        if (playerBottom >= platformTop && playerTop <= platformBottom && playerRight >= platformLeft && playerLeft <= platformRight) {
            playerVelocity.y = -17; // Aumenta il rimbalzo
            break;
        }
    }

    // Aggiorna la posizione orizzontale e verticale
    player.style.left = Math.max(0, Math.min(gameArea.offsetWidth - player.offsetWidth, playerLeft + playerVelocity.x)) + 'px';
    player.style.top = playerTop + playerVelocity.y + 'px';

    updatePlatforms(); // Aggiorna le piattaforme ad ogni frame
    requestAnimationFrame(updatePlayer);
}

let initialTouchX = null; // Memorizza la posizione iniziale del tocco/mouse

function startInput(event) {
    if (event.type === 'touchstart') {
        initialTouchX = event.touches[0].clientX;
    } else { // mousedown
        initialTouchX = event.clientX;
    }
}

function handleInput(event) {
	event.preventDefault();
    if (initialTouchX === null) return; // Non fare nulla se non c'è una posizione iniziale

    let currentX;
    if (event.type === 'touchmove') {
        currentX = event.touches[0].clientX;
    } else { // mousemove
        currentX = event.clientX;
    }


    let deltaX = (currentX - initialTouchX) * frictionFactor; // Applica il fattore di attrito
    let newLeft = parseInt(player.style.left) + deltaX;

    // Aggiorna la posizione orizzontale della pallina
    player.style.left = Math.max(0, Math.min(gameArea.offsetWidth - player.offsetWidth, newLeft)) + 'px';
    initialTouchX = currentX; // Aggiorna la posizione iniziale per il prossimo movimento
}

gameArea.addEventListener('mousedown', startInput);
gameArea.addEventListener('touchstart', startInput);
gameArea.addEventListener('mousemove', handleInput);
gameArea.addEventListener('touchmove', handleInput);


function jump() {
    isJumping = true;
    playerVelocity.y = 0; // Imposta la velocità di salto
}

player.style.top = '500px'; // Posizione iniziale del giocatore
player.style.left = '185px'; // Posizione iniziale del giocatore
gameArea.addEventListener('click', jump); // Evento di salto al clic

createPlatforms();
updatePlayer();

// Aggiungi questa logica all'interno del tuo script esistente

setTimeout(function() {
    var ground = document.getElementById('ground');
    if (ground) {
        ground.style.display = 'none'; // Nascondi la base di terra dopo 4 secondi
    }
}, 8000); // 4000 millisecondi equivalgono a 4 secondi


document.getElementById('playButton').addEventListener('click', function() {
    document.getElementById('backgroundMusic').play();
    startGame();
});

function startGame() {
    // Nascondi il pulsante Play
    var playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.style.display = 'none';
    }
    // Resetta la posizione del giocatore o inizia il gioco
}

