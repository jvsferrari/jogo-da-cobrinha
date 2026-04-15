//declare outside references
const start = document.querySelector('#start');
const menu = document.querySelector('#menu');
const musicIcon = document.querySelector('#musicIcon');
const musicFile = new Audio('./749455__nathanj848__underground-song-2.wav');
const musicButton = document.querySelector('#musicButton');
const returnButton = document.querySelector('#return');
const gamePage = document.querySelector('#game');
const restartButton = document.querySelector('#restart');
const lastKey = document.querySelector('#lastKey');
const difficultyButton = document.querySelector('#difficultyButton');
const difficultyDisplay = document.querySelector('#difficulty');
const maxScore = document.querySelector('#maxScore');
const tryAgain = document.querySelectorAll('.tryAgain');
const gameOverPopUp = document.querySelector('#gameOverPopUp');
const winPopUp = document.querySelector('#winPopUp');
const popUp = document.querySelectorAll('.popUp');
const scoreboards = document.querySelectorAll('.currentScore');

//make 30x30 grid
function makeGrid() {
  gridContainer = document.createElement('div');
  gridContainer.style.display = 'flex';
  gridContainer.style.flexDirection = 'column';
  gridContainer.id = 'gridContainer';
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
tryAgain.forEach((button) => {
  button.addEventListener('click', restart);
});

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
  popUp.forEach((element) => (element.style.display = 'none'));
  snake.direction = 'up';
  lastKey.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  checkDifficulty();
  startGame();
}

function returnToMenu() {
  gamePage.style.display = 'none';
  document.querySelector('body').prepend(menu);
  document.getElementById('game').removeChild(gridContainer);
  clearInterval(pulse);
}

//starting definitions
//snake object
let snake = {
  positions: [],
  length: 2,
  head: '',
  row: 1,
  column: 1,
  direction: 'up',
  hasChangedDirection: false,
  allPositions: [],
  gridIsFull: false,
};
//apple object
let apple = {
  row: 1,
  column: 1,
  pixel: '',
};
snake.head = document.querySelector(`.r${snake.row}.c${snake.column}`);
let tail = document.querySelector(`.r${snake.row + 1}.c${snake.column}`);
let pulse;
let oldTail = '';
let difficulty = 'Normal';
let pulseTiming = 500;
let gridContainer;

//exit menu, create 2 pixel snake, create grid(if it does noot exist), reset score, positions and snake.length, start and draw snake and apple, start pulsing
function startGame() {
  gamePage.style.display = 'flex';
  makeGrid();
  if (document.querySelector('body').contains(menu)) {
    document.querySelector('body').removeChild(menu);
  }
  resetScore();
  snake.allPositions.length = 0;
  snake.positions.length = 0;
  snake.length = 2;
  startSnake();
  //console.log(snake.positions);
  drawSnake();
  generateApple();
  beat();
}

//pulses moving snake and checking if apple was eaten, calls itself
function beat() {
  if (pulseTiming >= 50) {
    clearInterval(pulse);
    pulse = setInterval(() => {
      eatApple();
      moveSnake(snake.direction);
      win();
      checkColision();
      drawSnake();
      snake.hasChangedDirection = false;
      //erase duplicates
      snake.allPositions = [...new Set(snake.allPositions)];
      //console.log(`snake.allPositions.length: ${snake.allPositions.length}`);
      //console.log(snake.allPositions);
      if (snake.gridIsFull == false) {
        fullGrid();
      }
      beat();
    }, pulseTiming);
  }
}
//start snake and push first and second positions' values
function startSnake() {
  //safe 5-pixel margin
  snake.row = Math.floor(Math.random() * 20 + 5);
  snake.column = Math.floor(Math.random() * 30 + 5);
  //console.log(snake.row, snake.column);
  snake.head = document.querySelector(`.r${snake.row}.c${snake.column}`);
  tail = document.querySelector(`.r${snake.row + 1}.c${snake.column}`);
  snake.allPositions.push(tail);
  snake.allPositions.push(snake.head);
  snake.positions.push(tail);
  snake.positions.push(snake.head);
}

//arrow keypresses*
window.addEventListener('keydown', (event) => {
  //avoid changing direction more than once per pulse
  if (snake.hasChangedDirection == false) {
    switch (event.key) {
      case 'ArrowUp':
        if (snake.direction != 'down') {
          lastKey.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
          snake.direction = 'up';
        }
        break;
      case 'ArrowDown':
        if (snake.direction != 'up') {
          lastKey.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
          snake.direction = 'down';
        }
        break;

      case 'ArrowLeft':
        if (snake.direction != 'right') {
          lastKey.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
          snake.direction = 'left';
        }
        break;
      case 'ArrowRight':
        if (snake.direction != 'left') {
          lastKey.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
          snake.direction = 'right';
        }
        break;
    }
    snake.hasChangedDirection = true;
  }
});

//move snake according to direction and erase tail
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
  //console.log(`Snake row:${snake.row}\nSnake column:${snake.column}`);
  snake.head = document.querySelector(`.r${snake.row}.c${snake.column}`);
  //pushes the new position and then splices the old
  snake.positions.push(snake.head);
  snake.allPositions.push(snake.head);
  eraseTail();
  //console.log(snake.positions);
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    if (snake.positions.length > i) {
      snake.positions[i].style.backgroundColor = '#FCB7C7';
    }
  }
  snake.positions[snake.positions.length - 1].style.backgroundColor = '#CA6180';
}

function eraseTail() {
  oldTail = snake.positions.splice(0, snake.positions.length - snake.length);
  for (let i = oldTail.length; i > 0; i--) {
    oldTail[i - 1].style.backgroundColor = '#2E7D32';
  }
}

//check if snake has hit a border
function overflow() {
  if (snake.row > 30 && snake.direction == 'down') {
    snake.row = 1;
  }
  if (snake.row < 1 && snake.direction == 'up') {
    snake.row = 30;
  }
  if (snake.column > 40 && snake.direction == 'right') {
    snake.column = 1;
  }
  if (snake.column < 1 && snake.direction == 'left') {
    snake.column = 40;
  }
}

function resetScore() {
  scoreboards.forEach((scoreboard) => {
    scoreboard.innerText = '0';
  });
}

//generate and draw apple at least 3 pixels away from head and only where there is no snake body
function generateApple() {
  apple.row = Math.floor(Math.random() * 29 + 1);
  apple.column = Math.floor(Math.random() * 39 + 1);
  apple.pixel = document.querySelector(`.r${apple.row}.c${apple.column}`);
  while (
    Math.abs(apple.row - snake.row) < 3 ||
    Math.abs(apple.column - snake.column) < 3 ||
    snake.positions.includes(apple.pixel)
  ) {
    apple.row = Math.floor(Math.random() * 30);
    apple.column = Math.floor(Math.random() * 40);
    apple.pixel = document.querySelector(`.r${apple.row}.c${apple.column}`);
  }
  //console.log(`Apple row: ${apple.row}\nApple column: ${apple.column}`);
  apple.pixel = document.querySelector(`.r${apple.row}.c${apple.column}`);
  apple.pixel.style.backgroundColor = 'red';
}

//check if apple was eaten; increase score, generate apple and speed up the game if the apple was eaten
function eatApple() {
  /*
  console.log(
    `snake.head${snake.head.classList}\napple.pixel${apple.pixel.classList}`,
  );
  */
  if (snake.head.classList == apple.pixel.classList) {
    growSnake(1);
    generateApple();
    pulseTiming -= 20;
  }
}

function growSnake(growth) {
  incrementScore(growth);
  snake.length += growth;
}

function incrementScore(growth) {
  scoreboards.forEach(
    (scoreboard) =>
      (scoreboard.innerText = parseInt(scoreboard.innerText) + growth),
  );
  if (parseInt(maxScore.innerText) < parseInt(scoreboards[1].innerText)) {
    maxScore.innerText = parseInt(maxScore.innerText) + growth;
  }
}

//change game speed according to difficulty
function changeDifficulty() {
  if (difficulty == 'Normal') {
    difficulty = 'Difícil';
  } else if (difficulty == 'Difícil') {
    difficulty = 'Fácil';
  } else if (difficulty == 'Fácil') {
    difficulty = 'Normal';
  }
  difficultyDisplay.innerText = difficulty;

  checkDifficulty();
}
function checkDifficulty() {
  switch (difficulty) {
    case 'Normal':
      pulseTiming = 500;
      break;
    case 'Fácil':
      pulseTiming = 700;
      break;
    case 'Difícil':
      pulseTiming = 300;
      break;
  }
}
//check if the snake's head has hit its body
function checkColision() {
  if (
    snake.positions.indexOf(snake.head) !=
    snake.positions.lastIndexOf(snake.head)
  ) {
    gameOver();
  }
}

//full grid bonus
function fullGrid() {
  if (snake.allPositions.length == 1200) {
    snake.gridIsFull = true;
    incrementScore(100);
  }
}

function gameOver() {
  //gameOverScore.innerText = score.innerText;
  gameOverPopUp.style.display = 'flex';
  clearInterval(pulse);
}

//adicionar cobra com 1200 de length (win)
function win() {
  if (snake.length == 1200) {
    winPopUp.style.display = 'flex';
    clearInterval(pulse);
  }
}
