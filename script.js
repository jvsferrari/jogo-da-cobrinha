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
  snake.positions.length = 0;
  document.getElementById('game').removeChild(gridContainer);
  makeGrid();
  startSnake();
  resetScore();
}

function returnToMenu() {
  document.querySelector('body').prepend(menu);
  document.getElementById('game').removeChild(gridContainer);
}

//starting definitions
let currentRow = 1;
let currentColumn = 1;
let head = document.querySelector(`.r${currentRow}.c${currentColumn}`);
let tail = document.querySelector(`.r${currentRow + 1}.c${currentColumn}`);
let direction = 'up';
let snake = {
  positions: [],
  length: 2,
  head: '',
};
let pulse;
let oldTail = '';

//exit menu and create 2 pixel snake
function startGame() {
  makeGrid();
  document.querySelector('body').removeChild(menu);
  resetScore();
  snake.positions.length = 0;
  startSnake();
  console.log(snake.positions);
  drawSnake();
  //moves, checks for overflow and then draws
  if (pulse !== null) {
    clearInterval(pulse);
  }
  pulse = setInterval(() => {
    moveSnake(direction);
    drawSnake();
  }, 500);
}

function startSnake() {
  //safe 5-pixel margin
  currentRow = Math.floor(Math.random() * 20 + 5);
  currentColumn = Math.floor(Math.random() * 30 + 5);
  console.log(currentRow, currentColumn);
  snake.head = document.querySelector(`.r${currentRow}.c${currentColumn}`);
  tail = document.querySelector(`.r${currentRow + 1}.c${currentColumn}`);
  snake.positions.push(tail);
  snake.positions.push(snake.head);
}

//arrow keypresses
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      direction = 'up';
      break;
    case 'ArrowDown':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
      direction = 'down';
      break;
    case 'ArrowLeft':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      direction = 'left';
      break;
    case 'ArrowRight':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      direction = 'right';
      break;
  }
});

function moveSnake(direction) {
  switch (direction) {
    case 'up':
      currentRow -= 1;
      break;
    case 'down':
      currentRow += 1;
      break;
    case 'left':
      currentColumn -= 1;
      break;
    case 'right':
      currentColumn += 1;
      break;
  }
  overflow();
  console.log(currentRow, currentColumn);
  head = document.querySelector(`.r${currentRow}.c${currentColumn}`);
  snake.positions.push(head);
  // oldTail = snake.positions.shift();
  eraseTail();
  console.log(snake.positions);
}

function drawSnake() {
  for (let i = snake.length; i >= 1; i--) {
    snake.positions[snake.positions.length - 1].style.backgroundColor =
      'purple';
  }
}

function eraseTail() {
  snake.positions.splice(0, snake.positions.length - snake.length);
}

function overflow() {
  if (currentRow > 30 && direction == 'down') {
    currentRow = 1;
  }
  if (currentRow < 1 && direction == 'up') {
    currentRow = 30;
  }
  if (currentColumn > 40 && direction == 'right') {
    currentColumn = 1;
  }
  if (currentColumn < 1 && direction == 'left') {
    currentColumn = 40;
  }
}

function increaseScore() {
  score.innerText++;
}

function resetScore() {
  score.innerText = '0';
}
