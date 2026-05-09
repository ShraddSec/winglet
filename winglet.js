const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.textAlign = "center";
ctx.textBaseline = "middle";

let gameStarted = false;
let gameOver = false;
let score = 0;
let scored = false;

const bird = {
  x: 80,
  y: 200,
  width: 30,
  height: 30,
  velocity: 0,
  gravity: 0.1,
  jumpStrength: -4
};

const pipe = {
  x: canvas.width,
  width: 60,
  topHeight: 200,
  gap: 150,
  speed: 2
};

function resetGame() {
  score = 0;
  scored = false;
  gameOver = false;
  bird.y = 200;
  bird.velocity = 0;
  pipe.x = canvas.width;
}

function update() {

  if (!gameStarted) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#222";
    ctx.font = "bold 36px Arial";
    ctx.fillText("Winglet", canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = "18px Arial";
    ctx.fillStyle = "#444";
    ctx.fillText("Press SPACE to Start", canvas.width / 2, canvas.height / 2 + 10);

    requestAnimationFrame(update);
    return;
  }

  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#b00020";
    ctx.font = "bold 32px Arial";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "18px Arial";
    ctx.fillStyle = "#222";
    ctx.fillText("Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 50);

    requestAnimationFrame(update);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }

  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    gameOver = true;
  }

  pipe.x -= pipe.speed;

  if (pipe.x + pipe.width < 0) {
    pipe.x = canvas.width;
    scored = false;
  }

  const bottomY = pipe.topHeight + pipe.gap;
  const bottomHeight = canvas.height - bottomY;

  if (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    bird.y < pipe.topHeight
  ) {
    gameOver = true;
  }

  if (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    bird.y + bird.height > bottomY
  ) {
    gameOver = true;
  }

  if (
    !scored &&
    bird.x > pipe.x + pipe.width &&
    bird.y > pipe.topHeight &&
    bird.y + bird.height < bottomY
  ) {
    score++;
    scored = true;
  }

  ctx.fillStyle = "#222";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 70, 30);

  ctx.fillStyle = "grey";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
  ctx.fillRect(pipe.x, bottomY, pipe.width, bottomHeight);

  // DRAW BIRD
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space") return;

  if (gameOver) {
    resetGame();
    return;
  }

  if (!gameStarted) {
    gameStarted = true;
    return;
  }

  bird.velocity = bird.jumpStrength;
});

update();
