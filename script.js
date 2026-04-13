//declare HTML references
const start = document.querySelector('#start');
const menu = document.querySelector('#menu');
const musicIcon = document.querySelector('#musicIcon');
const musicFile = new Audio('./19 Aviary Action.mp3');
const musicButton = document.querySelector('#musicButton');
const returnButton = document.querySelector('#return');
const gamePage = document.querySelector('#game');
const restartButton = document.querySelector('#restart');
const score = document.querySelector('#score');
const lastKey = document.querySelector('#lastKey');
const difficultyButton = document.querySelector('#difficultyButton');
const difficultyDisplay = document.querySelector('#difficulty');

//make 30x30 grid
function makeGrid() {
  gridContainer = document.createElement('div');
  gridContainer.style.display = 'flex';
  gridContainer.style.flexDirection = 'column';
  for (let row = 1; row <= 30; row++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row');
    newRow.classList.add(`r${row}`);

    for (let column = 1; column <= 40; column++) {
      const newDiv = document.createElement('div');
      newDiv.classList.add(`r${row}`, `c${column}`, 'pixel');
      newRow.appendChild(newDiv);
    }
    gamePage.prepend(gridContainer);
    gridContainer.appendChild(newRow);
  }
}

//configure event listeners
start.addEventListener('click', startGame);
returnButton.addEventListener('click', returnToMenu);
musicButton.addEventListener('click', toggleMusic);
restartButton.addEventListener('click', restart);
difficultyButton.addEventListener('click', changeDifficulty);

//music
musicFile.loop = true;
function toggleMusic() {
  if (musicFile.paused) {
    musicFile.play();
    musicIcon.innerHTML = '<i class="fa-solid fa-volume"></i>';
  } else {
    musicFile.pause();
    musicIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }
}

function restart() {
  document.getElementById('game').removeChild(gridContainer);
  startGame();
}

function returnToMenu() {
  document.querySelector('body').prepend(menu);
  document.getElementById('game').removeChild(gridContainer);
}

//starting definitions
let snake = {
  positions: [],
  length: 2,
  head: '',
  row: 1,
  column: 1,
};
let apple = {
  row: 1,
  column: 1,
  pixel: '',
};
snake.head = document.querySelector(`.r${snake.row}.c${snake.column}`);
let tail = document.querySelector(`.r${snake.row + 1}.c${snake.column}`);
let direction = 'up';
let pulse;
let oldTail = '';
let difficulty = 'Normal';
let pulseFrequency = 500;

//exit menu and create 2 pixel snake
function startGame() {
  makeGrid();
  if (document.querySelector('body').contains(menu)) {
    document.querySelector('body').removeChild(menu);
  }
  resetScore();
  snake.positions.length = 0;
  startSnake();
  console.log(snake.positions);
  drawSnake();
  generateApple();
  //moves, checks for overflow and then draws

  beat();
}

function beat() {
  if (pulseFrequency >= 50) {
    clearInterval(pulse);
    pulse = setInterval(() => {
      eatApple();
      moveSnake(direction);
      drawSnake();
      beat();
    }, pulseFrequency);
    console.log(pulseFrequency);
  }
}

function startSnake() {
  //safe 5-pixel margin
  snake.row = Math.floor(Math.random() * 20 + 5);
  snake.column = Math.floor(Math.random() * 30 + 5);
  console.log(snake.row, snake.column);
  snake.head = document.querySelector(`.r${snake.row}.c${snake.column}`);
  tail = document.querySelector(`.r${snake.row + 1}.c${snake.column}`);
  snake.positions.push(tail);
  snake.positions.push(snake.head);
}

//arrow keypresses
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (direction != 'down') {
        lastKey.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        direction = 'up';
      }
      break;
    case 'ArrowDown':
      if (direction != 'up') {
        lastKey.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
        direction = 'down';
      }
      break;
    case 'ArrowLeft':
      if (direction != 'right') {
        lastKey.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        direction = 'left';
      }
      break;
    case 'ArrowRight':
      if (direction != 'left') {
        lastKey.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        direction = 'right';
      }
      break;
  }
});

function moveSnake(direction) {
  switch (direction) {
    case 'up':
      snake.row -= 1;
      break;
    case 'down':
      snake.row += 1;
      break;
    case 'left':
      snake.column -= 1;
      break;
    case 'right':
      snake.column += 1;
      break;
  }
  overflow();
  console.log(`Snake row:${snake.row}\nSnake column:${snake.column}`);
  snake.head = document.querySelector(`.r${snake.row}.c${snake.column}`);
  snake.positions.push(snake.head);
  eraseTail();
  console.log(snake.positions);
  //checkColision();
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    snake.positions[i].style.backgroundColor = 'purple';
  }
  snake.positions[snake.positions.length - 1].style.backgroundColor = 'pink';
}

function eraseTail() {
  oldTail = snake.positions.splice(0, snake.positions.length - snake.length);
  for (let i = oldTail.length; i > 0; i--) {
    oldTail[i - 1].style.backgroundColor = 'yellowgreen';
  }
}

function overflow() {
  if (snake.row > 30 && direction == 'down') {
    snake.row = 1;
  }
  if (snake.row < 1 && direction == 'up') {
    snake.row = 30;
  }
  if (snake.column > 40 && direction == 'right') {
    snake.column = 1;
  }
  if (snake.column < 1 && direction == 'left') {
    snake.column = 40;
  }
}

function resetScore() {
  score.innerText = '0';
}

function generateApple() {
  apple.row = Math.floor(Math.random() * 20 + 5);
  apple.column = Math.floor(Math.random() * 30 + 5);
  while (Math.abs(apple.row - snake.row) < 3) {
    apple.row = Math.floor(Math.random() * 30 + 5);
  }
  while (Math.abs(apple.column - snake.column) < 3) {
    apple.column = Math.floor(Math.random() * 30 + 5);
  }
  console.log(`Apple row: ${apple.row}\nApple column: ${apple.column}`);
  apple.pixel = document.querySelector(`.r${apple.row}.c${apple.column}`);
  apple.pixel.style.backgroundColor = 'red';
}

function eatApple() {
  /*
  console.log(
    `snake.head${snake.head.classList}\napple.pixel${apple.pixel.classList}`,
  );
  */
  if (snake.head.classList == apple.pixel.classList) {
    growSnake(1);
    generateApple();
    pulseFrequency -= 20;
  }
}

function growSnake(growth) {
  score.innerText = parseInt(score.innerText) + growth;
  snake.length += growth;
}

function changeDifficulty() {
  if (difficulty == 'Normal') {
    difficulty = 'Difícil';
  } else if (difficulty == 'Difícil') {
    difficulty = 'Fácil';
  } else if (difficulty == 'Fácil') {
    difficulty = 'Normal';
  }
  difficultyDisplay.innerText = difficulty;

  if (difficulty == 'Normal') {
    pulseFrequency = 500;
  }
  if (difficulty == 'Fácil') {
    pulseFrequency = 700;
  }
  if (difficulty == 'Difícil') {
    pulseFrequency = 300;
  }
}

/*function checkColision() {
  if (
    snake.positions.indexOf(snake.head) !=
    snake.column.positions.lastIndexOf(snake.head)
  ) {
    restart();
  }
}
*/
