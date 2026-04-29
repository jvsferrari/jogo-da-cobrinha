# Jogo da cobrinha (Snake)

## Menu

O [jogador](#jogadores) pode:

- escolher a [dificuldade](#dificuldade),
- escolher ativar a [música](#música),
- escolher se jogará com paredes ou sem paredes,
- ver o [pódio](#pódio).

## Jogo

- a grade de pixels ([tabuleiro](#tabuleiro)) é gerada a cada novo jogo
- a [cobrinha](#cobrinha) inicia movendo-se para cima
- a cada [intervalo](#intervalo), um movimento é gerado na direção selecionada ou na direção do [intervalo](#intervalo) anterior, caso não haja mudança
- uma [maçã](#maçã) é gerada ao iniciar o jogo e cada vez que uma [maçã](#maçã) é [comida](#comer)
- um [bônus](#bônus) é gerado depois que a primeira [maçã](#maçã) é [comida](#comer) e a cada segunda [maçã](#maçã) [comida](#comer), se já não houver um [bônus](#bônus)
- A [pontuação](#pontuação) aumenta uma unidade a cada [maçã](#maçã) [comida](#comer)
- A cada [ponto](#pontos) o comprimento da [cobrinha](#cobrinha) aumenta uma unidade
- A [pontuação](#pontuação) é sempre igual ao comprimento da [cobrinha](#cobrinha) - 2
- o [jogador](#jogadores) perde se a [cobrinha](#cobrinha) tocar o próprio corpo ou se a cabeça bater na parede, caso haja

### Controles

- Pausar
- Reiniciar
- Voltar ao menu
- Mudar direção (com as setas do teclado)

### Vitória

- Quando a cobra tem comprimento de 1200, o _pop-up_ de vitória aparece e o jogador é considerado o vencedor.

## Cobrinha

A cobrinha é um objeto com 9 propriedades, definido, inicialmente, por:

```javascript
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
- O boolean `hasChangedDirection` armazena `true` se a cobrinha já mudou de direção no [intervalo](#intervalo) atual e `false` caso contrário
- O array `allPositions` armazena todas as posições pelas quais a cabeça da cobrinha passou

## Comidas

### Maçã

A maçã é um objeto com 6 propriedades, definido, inicialmente, por:

```javascript
let apple = {
  row: 1,
  column: 1,
  pixel: '',
  points: 1,
  speed: -10,
  count: 0,
};
```

**Uma maçã é gerada cada vez que a maçã anterior é [comida](#comer)**

### Bônus

O bônus é um objeto com 6 propriedades, definido, inicialmente, por:

```javascript
let bonus = {
  pixel: '',
  speed: 0,
  points: 0,
  positions: [],
  wasEaten: true,
  wasGenerated: false,
};
```

**Um bônus é gerado para cada duas [maçãs](#maçã) se o bônus anterior foi [comido](#comer)**

**Os bônus são gerados apenas nos quatro cantos do [tabuleiro](#tabuleiro) e com 5 cores diferentes possíveis**

**A [pontuação](#pontuação) do bônus varia de -20 a +20 e o período acrescido (`speed`) varia de -200 a +200 ms**

- O _integer_ `row` e o _integer_ `column` armazenam a linha e a coluna, respectivamente, em que se encontra a comida
- A _string_ `pixel` armazena o node correspondente ao pixel em que a comida está
- O _integer_ `points` armazena a [pontuação](#pontuação) acrescida a cada comida
- O _integer_ `speed` armazena a diminuição do período do [intervalo](#intervalo) (`-` indica ganho de velocidade e `+` significa perda de velocidade)
- O _integer_ `count` armazena o número da [maçã](#maçã) atual, sendo `1` a primeira [maçã](#maçã)
- O _array_ `positions` armazena todas as posições que o bônus pode ocupar, sendo esses os quatro cantos do [tabuleiro](#tabuleiro)
- O _boolean_ `wasEaten` armazena `true` se o bônus gerado pela [maçã](#maçã) atual foi [comido](#comer) e `false` caso contrário
- O _boolean_ `wasGenerated` armazena `true` se um bônus foi gerado pela [maçã](#maçã) atual e `false` caso contrário

## Comer

O ato de comer é registrado pela função:

```javascript
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

- verifica se a cabeça da [cobrinha](#cobrinha) coincide com a [comida](#comidas)
- aumenta o comprimento de acordo com a [pontuação](#pontuação) atribuída à [comida](#comidas)
- gera uma nova [comida](#comidas)

## Pontos

### Pontuação

- A pontuação e a pontuação máxima da rodada atual são mostradas à direita do [tabuleiro](#tabuleiro)
- Cada [comida](#comidas) tem uma pontuação associada

### Pódio

- O pódio é mostrado a cada _Game Over_ ou pelo botão "Pódio", no [menu](#menu) inicial.
- É considerada para o pódio a jogada com a maior [pontuação](#pontuação) máxima de cada [jogador](#jogadores), **independentemente da [dificuldade](#dificuldade) e da presença de paredes**.

## Jogadores

Cada jogador é um objeto com 8 propriedades criado pela função:

```javascript
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

**Ao iniciar o primeiro jogo, o _pop-up_ pede por um nome para um novo jogador. Nos demais jogos, um jogador já criado também pode ser escolhido.**

Os objetos dos jogadores são armazenados no _array_ `players`

- O _integer_ `index` armazena o índice do jogador no _array_ `players`
- A _string_ `name` armazena o nome do jogador
- O _array_ `scores` armazena as [pontuações](#pontuação) finais de cada rodada do jogador
- O _integer_ `turn` armazena o número da rodada atual
- O _integer_ `bestTurn` armazena o índice da rodada de maior [pontuação](#pontuação) máxima
- O _array_ `maxScores` armazena as [pontuações](#pontuação) máximas de cada rodada do jogador
- O _array_ `walls` armazena `true` se a rodada tiver paredes e `false` caso contrário
- O _array_ `difficulties` armazena a [dificuldade](#dificuldade) de cada rodada

## Tabuleiro

Ao iniciar um [jogo](#jogo), é criado um tabuleiro de 30 linhas e 40 colunas, com paredes (borda) ou sem.

## Tabuleiro cheio

**Se a [cobrinha](#cobrinha) passar por todo o [tabuleiro](#tabuleiro) pelo menos uma vez, uma [pontuação](#pontuação) de 100 é adicionada.**
Por isso, cada pixel que já foi ocupado pela [cobrinha](#cobrinha) é pintado de uma cor levemente diferente da cor de fundo inicial.

## Intervalo

O intervalo é o período `pulseTiming` entre as execuções da função `beat()` em milissegundos.

`pulseTiming` diminui ou aumenta a cada [comida](#comidas).

## Dificuldade

Existem três dificuldades, que alteram o `pulseTiming` ([intervalo](#intervalo)), tornando o [jogo](#jogo) mais rápido ou mais devagar:

### Fácil

`pulseTiming = 700`

### Normal

`pulseTiming = 500`

### Difícil

`pulseTiming = 300`

## Música

A música pode ser ativada ou desativada no [menu](#menu).

**Música: underground song 2 by nathanj848 -- https://freesound.org/s/749455/ -- License: Attribution 4.0**
