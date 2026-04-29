# Jogo da cobrinha (Snake)

## Menu

O jogador pode:

- escolher a [dificuldade](##Dificuldade),

* escolher ativar a [música](#Música),
* escolher se jogará com [paredes](##Paredes) ou sem [paredes](##Paredes),
* ver o [pódio](##Pódio).

## Jogo

- a grade de pixels (tabuleiro) é gerada a cada novo jogo
- a [cobrinha](##Cobrinha) inicia movendo-se para cima
- a cada [intervalo](##Intervalo), um movimento é gerado na direção selecionada ou na direção do [intervalo](##Intervalo) anterior, caso não haja mudança
- uma maçã é gerada ao iniciar o jogo e cada vez que uma maçã é [comida](##Comer)
- um bônus é gerado depois que a primeira maçã é comida e a cada segunda maçã comida, se já não houver um bônus
- A pontuação aumenta uma unidade a cada maçã comida
- A cada ponto o comprimento da cobrinha aumenta uma unidade
- A pontuação é sempre igual ao comprimento da cobrinha - 2

- o jogador perde se a cobrinha tocar o própio corpo ou se a cabeça bater na parede, caso haja

## Cobrinha

A cobrinha é um objeto com 9 propriedades, definido, inicialmente, por:

```
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
```

- O array `positions` armazena todas as posições que a cobrinha ocupa no momento
- O integer `length` armazena o comprimento da cobrinha
- A string `head` armazena o node correspondente ao pixel em que se encontra a cabeça da cobrinha
- O integer `row` e o integer `column` armazenam a linha e a coluna, respectivamente, em que se encontra a cabeça da cobrinha
- A string `direction` armazena o sentido atual do movimento da cobrinha, pode ser `up`, `down`, `left` ou `right`
- O boolean `hasChangedDirection` armazena `true` se a cobrinha já mudou de direção no intervalo atual e `false` caso contrário
- O array `allPositions` armazena todas as posições pelas quais a cabeça da cobrinha passou

## Comidas

### Maçã

A maçã é um objeto com 6 propriedades, definido, inicialmente, por:

```
let apple = {
  row: 1,
  column: 1,
  pixel: '',
  points: 1,
  speed: -10,
  count: 0,
};
```

**Uma maçã é gerada cada vez que a maçã anterior é comida**

### Bônus

O bônus é um objeto com 6 propriedades, definido, inicialmente, por:

```
let bonus = {
  pixel: '',
  speed: 0,
  points: 0,
  positions: [],
  wasEaten: true,
  wasGenerated: false,
};
```

**Um bônus é gerado para cada duas maçãs se o bônus anterior foi comido**

**Os bônus são gerados apenas nos quatro cantos do tabuleiro**

**A pontuação do bônus varia de -20 a +20 e o período acrescido (`speed`) varia de -200 a +200 ms**

- O _integer_ `row` e o integer `column` armazenam a linha e a coluna, respectivamente, em que se encontra a comida
- A _string_ `pixel` armazena o node correspondente ao pixel em que a comida está
- O _integer_ `points` armazena a pontuação acrescida a cada comida
- O _integer_ `speed` armazena a diminuição do período do intervalo ( `-` indica ganho de velocidade e `+` significa perda de velocidade)
- O _integer_ `count` armazena o número da maçã atual, sendo `1` a primeira maçã
- O _array_ `positions` armazena todas as posições que o bônus pode ocupar, sendo esses os quatro cantos do tabuleiro
- O _boolean_ `wasEaten` armazena `true` se o bônus gerado pela maçã atual foi comido e `false` caso contrário
- O _boolean_ `wasGenerated` armazena `true` se um bônus foi gerado pela maçã atual e `false` caso contrário

## Comer

O ato de comer é registrado pela função:

```
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
```

A função:

- verifica se a cabeça da cobrinha coincide com a comida
- aumenta o comprimento de acordo com a pontuação atribuída à comida
- gera uma nova comida

## Pontos

### Pontuação

- A pontuação e a pontuação máxima da rodada atual são mostradas à direita do tabuleiro
- Cada comida tem uma pontuação associada

### Pódio

- O pódio é mostrado a cada _Game Over_ ou pelo botão "Pódio", no menu inicial.

- É considerada para o pódio a jogada com a maior pontuação máxida de cada jogador, **independentemente da dificuldade e da presença de paredes**.

## Jogadores

Cada jogador é um objeto com 8 propriedades criado pela função:

```
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
```

Os objetos dos jogadores são armazenados no _array_ `players`

- O integer `index` armazena o índice do jogador no _array_ `players`
- A string `name` armazena o nome do jogador
- O _array_ `scores` armazena as pontuações finais de cada rodada do jogador
- O integer `turn` armazena o número da rodada atual
- O integer `bestTurn` armazena o índice da rodada de maior pontuação máxima
- O _array_ `maxScores` armazena as pontuações máximas de cada rodada do jogador
- O _array_ `walls` armazena `true` se a rodada tiver paredes e `false` caso contrário
- O _array_ `difficulties` armazena a dificuldade de cada rodada
