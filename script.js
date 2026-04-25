//declare outside references
const start = document.querySelector('#start');
const menu = document.querySelector('#menu');
const musicIcon = document.querySelector('#musicIcon');
const musicFile = new Audio('./749455__nathanj848__underground-song-2.wav');
const musicButton = document.querySelector('#musicButton');
const returnButton = document.querySelectorAll('.return');
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
const wallsIcon = document.querySelector('#wallsIcon');
const wallsButton = document.querySelector('#wallsButton');
const pauseButton = document.querySelector('#pause');
const gameContainer = document.getElementById('game');
const newGamePopUp = document.getElementById('newGamePopUp');
const tableBody = document.querySelector('#tableBody');
const nameField = document.querySelector('#nameField');
const newGame = document.querySelector('#newGame');
const selectPlayer = document.querySelector('#selectPlayer');
const newName = document.querySelector('#newName');

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
  points: 1,
  speed: -10,
  count: 0,
};

let bonus = {
  pixel: '',
  speed: 0,
  points: 0,
  positions: [],
  wasEaten: true,
  wasGenerated: false,
};

let players = [];
let ranking = [];

snake.head = document.querySelector(`.r${snake.row}.c${snake.column}`);
let tail = document.querySelector(`.r${snake.row + 1}.c${snake.column}`);
let pulse;
let oldTail = '';
let difficulty = 'Normal';
let pulseTiming = 500;
let gridContainer;
let walls = true;
let isPaused = false;
let currentPlayer = -1;
let gameIsOver = false;

//setup event listeners
start.addEventListener('click', () => {
  startGame('menu');
});
returnButton.forEach((button) => {
  button.addEventListener('click', returnToMenu);
});
musicButton.addEventListener('click', toggleMusic);
restartButton.addEventListener('click', restart);
difficultyButton.addEventListener('click', changeDifficulty);
tryAgain.forEach((button) => {
  button.addEventListener('click', restart);
});
wallsButton.addEventListener('click', cycleWalls);
pauseButton.addEventListener('click', cyclePause);
selectPlayer.addEventListener('change', (event) => {
  if (event.target.value == 'new') {
    newName.style.display = 'flex';
  } else {
    newName.style.display = 'none';
    currentPlayer = parseInt(event.target.value);
  }
});
window.addEventListener('beforeunload', (event) => {
  event.preventDefault();
  event.returnValue = '';
});

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
      default:
        return;
    }
    snake.hasChangedDirection = true;
  }
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
    gridContainer.appendChild(newRow);
  }
  gamePage.prepend(gridContainer);
  const pixels = document.querySelectorAll('.pixel');
  if (walls == false) {
    pixels.forEach((pixel) => {
      pixel.style.border = '0';
    });
  }
  bonus.positions = [
    document.querySelector('.r1.c1'),
    document.querySelector('.r1.c40'),
    document.querySelector('.r30.c1'),
    document.querySelector('.r30.c40'),
  ];
}

function restart() {
  gameOverPopUp.style.display = 'none';
  if (gameContainer.contains(gridContainer)) {
    gameContainer.removeChild(gridContainer);
  }
  popUp.forEach((element) => (element.style.display = 'none'));
  snake.direction = 'up';
  lastKey.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  checkDifficulty();
  startGame();
  isPaused = false;
}

function returnToMenu() {
  clearTimeout(pulse);
  popUp.forEach((element) => (element.style.display = 'none'));
  gamePage.style.display = 'none';
  document.querySelector('body').prepend(menu);
  gameContainer.removeChild(gridContainer);
}

function waitForName(button) {
  return new Promise((resolve) => {
    function newPlayer() {
      button.removeEventListener('click', newPlayer);
      resolve();
    }
    button.addEventListener('click', newPlayer);
  });
}

//exit menu, create 2 pixel snake, create grid(if it does not exist), reset score, positions and snake.length, start and draw snake and apple, start pulsing
async function startGame(caller) {
  checkDifficulty();
  pauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
  isPaused = false;
  if (caller == 'menu') {
    newGamePopUp.style.display = 'flex';
    await waitForName(newGame);
    if (selectPlayer.value == 'new') {
      currentPlayer = players.length;
      let newPlayer = document.createElement('option');
      if (nameField.value.trim() == '') {
        nameField.value = `Jogador ${currentPlayer}`;
      }
      newPlayer.innerText = nameField.value;

      newPlayer.value = currentPlayer;
      selectPlayer.appendChild(newPlayer);
      players.push(createPlayer(nameField.value, walls, difficulty));
    } else {
      players[currentPlayer].turn++;
    }
    nameField.value = '';
    newGamePopUp.style.display = 'none';
  } else players[currentPlayer].turn++;
  players[currentPlayer].scores[players[currentPlayer].turn] = 0;
  players[currentPlayer].maxScores[players[currentPlayer].turn] = 0;
  players[currentPlayer].walls[players[currentPlayer].turn] = walls;
  players[currentPlayer].difficulties[players[currentPlayer].turn] = difficulty;
  gamePage.style.display = 'flex';
  makeGrid();
  if (document.querySelector('body').contains(menu)) {
    document.querySelector('body').removeChild(menu);
  }
  resetScore();
  snake.allPositions.length = 0;
  snake.positions.length = 0;
  maxScore.innerText = 0;
  snake.length = 2;
  snake.direction = 'up';
  apple.count = 0;
  bonus.wasEaten = true;
  snake.gridIsFull = false;
  lastKey.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  startSnake();
  //console.log(snake.positions);
  drawSnake();
  generateApple();
  gameIsOver = false;
  clearTimeout(pulse);
  beat();
}

//pulses moving snake and checking if apple was eaten, calls itself
function beat() {
  if (isPaused == false) {
    eat(apple);
    eat(bonus);
    moveSnake(snake.direction);
    win();
    snake.hasChangedDirection = false;
    //erase duplicates
    snake.allPositions = [...new Set(snake.allPositions)];
    //console.log(`snake.allPositions.length: ${snake.allPositions.length}`);
    //console.log(snake.allPositions);
    players[currentPlayer].bestTurn = players[currentPlayer].maxScores.indexOf(
      Math.max(...players[currentPlayer].maxScores),
    );
    if (snake.gridIsFull == false) {
      fullGrid();
    }
    checkColision();
    drawSnake();
    if (gameIsOver == false) {
      pulse = setTimeout(beat, pulseTiming);
    }
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
  //console.log(snake.positions);
}

function drawSnake() {
  eraseTail();
  for (let i = 0; i < snake.length - 1; i++) {
    if (snake.positions.length > i) {
      snake.positions[i].style.backgroundColor = '#FCB7C7';
    }
  }
  snake.positions[snake.positions.length - 1].style.backgroundColor = '#CA6180';
}

function eraseTail() {
  oldTail = snake.positions.splice(0, snake.positions.length - snake.length);
  for (let i = oldTail.length; i > 0; i--) {
    oldTail[i - 1].style.backgroundColor = '#74e17a';
  }
}

//check if snake has hit a border
function overflow() {
  if (!walls) {
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
  } else {
    if (snake.row > 30 && snake.direction == 'down') {
      snake.row = 1;
      gameOver();
    }
    if (snake.row < 1 && snake.direction == 'up') {
      snake.row = 30;
      gameOver();
    }
    if (snake.column > 40 && snake.direction == 'right') {
      snake.column = 1;
      gameOver();
    }
    if (snake.column < 1 && snake.direction == 'left') {
      snake.column = 40;
      gameOver();
    }
  }
}

function resetScore() {
  scoreboards.forEach((scoreboard) => {
    scoreboard.innerText = '0';
  });
  //players[currentPlayer].scores[players[currentPlayer].turn] = 0;
}

//generate and draw apple at least 3 pixels away from head and only where there is no snake body
function generateApple() {
  bonus.wasGenerated = false;
  apple.count++;
  do {
    apple.row = Math.floor(Math.random() * 24 + 1);
    apple.column = Math.floor(Math.random() * 34 + 1);
    apple.pixel = document.querySelector(`.r${apple.row}.c${apple.column}`);
  } while (
    Math.abs(apple.row - snake.row) < 3 ||
    Math.abs(apple.column - snake.column) < 3 ||
    snake.positions.includes(apple.pixel) ||
    apple.pixel == bonus.pixel
  );
  //console.log(`Apple row: ${apple.row}\nApple column: ${apple.column}`);
  apple.pixel = document.querySelector(`.r${apple.row}.c${apple.column}`);
  apple.pixel.style.backgroundColor = 'red';
}

//check if apple was eaten; increase score, generate apple and speed up the game if the apple was eaten

function growSnake(growth) {
  if (growth < -parseInt(scoreboards[0].innerText)) {
    incrementScore(-parseInt(scoreboards[0].innerText));
    if (snake.length + growth < 2) {
      snake.length = 2;
    } else snake.length += -parseInt(scoreboards[0].innerText);
  } else {
    incrementScore(growth);
    if (snake.length + growth < 2) {
      snake.length = 2;
    } else snake.length += growth;
  }
}

function incrementScore(growth) {
  scoreboards.forEach(
    (scoreboard) =>
      (scoreboard.innerText = parseInt(scoreboard.innerText) + growth),
  );
  players[currentPlayer].scores[players[currentPlayer].turn] = parseInt(
    scoreboards[0].innerText,
  );
  if (parseInt(maxScore.innerText) < parseInt(scoreboards[0].innerText)) {
    maxScore.innerText = scoreboards[0].innerText;
    players[currentPlayer].maxScores[players[currentPlayer].turn] = parseInt(
      scoreboards[0].innerText,
    );
  }
}

function rank() {
  for (let i = 0; i < players.length; i++) {
    ranking[i] = {
      index: players[i].index,
      name: players[i].name,
      maxScore: players[i].maxScores[players[i].bestTurn],
      difficulty: players[i].difficulties[players[i].bestTurn],
      wall: players[i].walls[players[i].bestTurn],
    };
  }

  ranking.sort((a, b) => {
    return b.maxScore - a.maxScore;
  });
}

function drawTable() {
  tableBody.replaceChildren();

  for (let i = 0; i < ranking.length; i++) {
    const newRow = document.createElement('tr');
    const name = document.createElement('td');
    const score = document.createElement('td');
    const walls = document.createElement('td');
    const difficulty = document.createElement('td');
    name.innerText = ranking[i].name;
    score.innerText = ranking[i].maxScore;
    if (ranking[i].wall) {
      walls.innerText = 'Sim';
    } else walls.innerText = 'Não';
    difficulty.innerText = ranking[i].difficulty;
    newRow.appendChild(name);
    newRow.appendChild(score);
    newRow.appendChild(walls);
    newRow.appendChild(difficulty);
    tableBody.appendChild(newRow);
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
  if (gameIsOver) return;
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
  gameOverPopUp.style.display = 'flex';
  gameIsOver = true;
  players[currentPlayer].bestTurn = players[currentPlayer].maxScores.indexOf(
    Math.max(...players[currentPlayer].maxScores),
  );
  rank();
  drawTable();
}

//adicionar cobra com 1200 de length (win)
function win() {
  if (snake.length >= 1200) {
    winPopUp.style.display = 'flex';
    gameIsOver = true;
    rank();
    drawTable();
  }
}

function cycleWalls() {
  switch (walls) {
    case true:
      walls = false;
      wallsIcon.innerHTML = '<i class="fa-regular fa-circle"></i>';
      break;
    case false:
      walls = true;
      wallsIcon.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
      break;
  }
}

function cyclePause() {
  switch (isPaused) {
    case false:
      pauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
      isPaused = true;
      clearTimeout(pulse);
      break;
    case true:
      pauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
      isPaused = false;
      beat();
      break;
  }
}

function generateBonus() {
  do {
    bonus.pixel = bonus.positions[Math.floor(Math.random() * 4)];
  } while (snake.positions.includes(bonus.pixel));

  switch (Math.floor(Math.random() * 4 + 1)) {
    case 1:
      bonus.pixel.style.backgroundColor = '#8B62A3';
      break;
    case 2:
      bonus.pixel.style.backgroundColor = '#CA6180';
      break;
    case 3:
      bonus.pixel.style.backgroundColor = '#E05D3A';
      break;
    case 4:
      bonus.pixel.style.backgroundColor = '#D1A000';
      break;
    case 5:
      bonus.pixel.style.backgroundColor = '#4495A2';
      break;
  }
  if (Math.random() >= 0.5) {
    bonus.points = +Math.floor(Math.random() * 19 + 1);
  } else bonus.points = -Math.floor(Math.random() * 19 + 1);
  if (Math.random() >= 0.5) {
    bonus.speed = +Math.floor(Math.random() * 199 + 1);
  } else bonus.speed = -Math.floor(Math.random() * 199 + 1);
  bonus.wasEaten = false;
  bonus.wasGenerated = true;
}

function eat(food) {
  if (snake.head === food.pixel) {
    growSnake(food.points);
    if (pulseTiming >= 50) {
      pulseTiming += food.speed;
    }
    if (pulseTiming < 50) {
      pulseTiming = 50;
    }
    if (food == apple) {
      generateApple();
    }
    if (food == bonus) {
      bonus.wasEaten = true;
    }
    if (
      apple.count % 2 == 0 &&
      bonus.wasEaten == true &&
      bonus.wasGenerated == false
    ) {
      generateBonus();
    }
  }
}

function createPlayer(name, walls, difficulty) {
  return {
    index: players.length,
    name: name,
    scores: [0],
    turn: 0,
    bestTurn: 0,
    maxScores: [0],
    walls: [walls],
    difficulties: [difficulty],
  };
}
