// === SETUP & VARIABLES ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
let enemies = [];
let score = 0;
let roadY = 0;
let gameStarted = false;

const carImg = new Image();
carImg.src = "assets/player-car.png";

const roadImg = new Image();
roadImg.src = "assets/road.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

const sunImg = new Image();
sunImg.src = "assets/sun.png";

const explosionImg = new Image();
explosionImg.src = "assets/explosion.png";

const flashImg = new Image();
flashImg.src = "assets/flash.png";

const enemyImgs = ["enemy1.png", "enemy2.png", "enemy3.png"].map(name => {
  const img = new Image();
  img.src = `assets/${name}`;
  return img;
});

const engineSound = new Audio("assets/engine.mp3");
const explosionSound = new Audio("assets/explosion.mp3");
const passSound = new Audio("assets/pass.mp3");

// === CAR ===
const car = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 150,
  width: 100,
  height: 150,
  speed: 10
};

// === ENEMY ===
function createEnemy() {
  const width = 100;
  const height = 150;
  const x = Math.random() * (canvas.width - width);
  const y = -height;
  const img = enemyImgs[Math.floor(Math.random() * enemyImgs.length)];
  return { x, y, width, height, speed: 6 + Math.random() * 4, img, passed: false };
}

function updateEnemies() {
  enemies.forEach((enemy, i) => {
    enemy.y += enemy.speed;

    if (!enemy.passed && car.y < enemy.y) {
      passSound.play();
      enemy.passed = true;
    }

    if (
      car.x < enemy.x + enemy.width &&
      car.x + car.width > enemy.x &&
      car.y < enemy.y + enemy.height &&
      car.y + car.height > enemy.y
    ) {
      explosionSound.play();
      drawExplosion(enemy.x, enemy.y);
      drawBubble(enemy.x, enemy.y - 30, "DM Me");
      enemies.splice(i, 1);
    }

    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
      score++;
    }
  });

  if (Math.random() < 0.02) {
    enemies.push(createEnemy());
  }
}

// === DRAW FUNCTIONS ===
function drawCar() {
  ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
  drawBubble(car.x + 10, car.y - 40, "When code?");
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

function drawRoad() {
  roadY += 10;
  if (roadY >= canvas.height) roadY = 0;
  ctx.drawImage(roadImg, 0, roadY - canvas.height, canvas.width, canvas.height);
  ctx.drawImage(roadImg, 0, roadY, canvas.width, canvas.height);
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawSun() {
  const sunSize = 100;
  ctx.drawImage(sunImg, 30, 30, sunSize, sunSize);
}

function drawExplosion(x, y) {
  ctx.drawImage(explosionImg, x, y, 100, 100);
}

function drawBubble(x, y, text) {
  ctx.drawImage(flashImg, x - 10, y - 10, 100, 50);
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(text, x + 5, y + 20);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, canvas.height - 20);
}

function drawStartScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Press any key to continue", canvas.width / 2, canvas.height / 2);
}

// === UPDATE ===
function update() {
  if (keys["a"] || keys["ArrowLeft"]) car.x -= car.speed;
  if (keys["d"] || keys["ArrowRight"]) car.x += car.speed;
  if (car.x < 0) car.x = 0;
  if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;

  updateEnemies();
}

// === MAIN LOOP ===
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    drawStartScreen();
    requestAnimationFrame(gameLoop);
    return;
  }

  drawBackground();
  drawSun();
  drawRoad();
  drawEnemies();
  drawCar();
  drawScore();
  update();
  requestAnimationFrame(gameLoop);
}

// === INIT ===
document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
  if (!gameStarted) {
    gameStarted = true;
    engineSound.loop = true;
    engineSound.play().catch(() => {});
  }
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

window.onload = () => {
  gameLoop();
};
