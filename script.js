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
const headPositions = [];
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
  document.getElementById('game').removeChild(gridContainer);
  makeGrid();
  startSnake();
  resetScore();
}

function returnToMenu() {
  document.querySelector('body').prepend(menu);
  document.getElementById('game').removeChild(gridContainer);
}

let currentRow = 1;
let currentColumn = 1;

//exit menu and create 2 pixel snake
function startGame() {
  makeGrid();
  document.querySelector('body').removeChild(menu);
  resetScore();
  startSnake();
}

function startSnake() {
  //safe 5-pixel margin
  currentRow = Math.floor(Math.random() * 20 + 5);
  currentColumn = Math.floor(Math.random() * 30 + 5);
  console.log(currentRow, currentColumn);
  let head = document.querySelector(`.r${currentRow}.c${currentColumn}`);
  let tail = document.querySelector(`.r${currentRow + 1}.c${currentColumn}`);
  headPositions.push(head);
  head.style.backgroundColor = 'purple';
  tail.style.backgroundColor = 'purple';
}

//arrow keypresses
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      break;
    case 'ArrowDown':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
      break;
    case 'ArrowLeft':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      break;
    case 'ArrowRight':
      lastKey.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      break;
  }
});

let direction = 'up';

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
}

function drawSnake() {
  console.log(currentColumn, currentRow);
  let head = document.querySelector(`.r${currentRow}.c${currentColumn}`);
  head.style.backgroundColor = 'purple';
}

setInterval(moveSnake(direction), 1000);
setInterval(drawSnake(), 1000);

function increaseScore() {
  score.innerText++;
}

function resetScore() {
  score.innerText = '0';
}

function changeDirection() {}
