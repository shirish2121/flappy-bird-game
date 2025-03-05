//board
let board;
let context;
let birdImg;

//bird
let birdWidth = 44;
let birdHeight = 34;
let birdX;
let birdY;

let bird = {
  x: 0,
  y: 0,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -1; //pipes moving speed
let velocityY = 0; // bird jump velocity
let gravity = 0.2;
let gameOver = false;
let score = 0;

function resizeGame() {
  board.width = window.innerWidth * 0.9;
  board.height = window.innerHeight * 0.8;
  birdX = board.width / 8;
  birdY = board.height / 2;
  bird.x = birdX;
  bird.y = birdY;
  pipeX = board.width;

  context.clearRect(0, 0, board.width, board.height);

  if (!gameOver) {
    requestAnimationFrame(update);
  }
}

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");

  // Load images
  birdImg = new Image();
  birdImg.src = "images/bird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "images/top.jpeg";
  bottomPipeImg = new Image();
  bottomPipeImg.src = "images/bottom.jpeg";

  window.addEventListener("resize", resizeGame);
  resizeGame();

  setInterval(placePipes, 3500);
  document.addEventListener("keydown", moveBird);
  document.addEventListener("touchstart", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  // Bird movement
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // Limit bird's upward movement
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  // Pipes movement
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  // Score display
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER!!", board.width / 4, board.height / 2);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 3;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(event) {
  if (
    event.code == "Space" ||
    event.code == "ArrowUp" ||
    event.type == "touchstart"
  ) {
    velocityY = -4;
  }

  // RESET GAME
  if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
