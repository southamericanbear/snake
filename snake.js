let size = 10;
let TIMER = 80;
let canvas = document.querySelector("canvas");
let pointsCounter = document.querySelector(".points-counter");
let canvasSIze = 500;
let ctx = canvas.getContext("2d");
let direction;
let points = 0;

const DIRECTION = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
  D: [1, 0],
  A: [-1, 0],
  S: [0, 1],
  W: [0, -1],
  d: [1, 0],
  a: [-1, 0],
  s: [0, 1],
  w: [0, -1],
};

let controller = {
  movimiento: { x: 1, y: 0 },
  snake: [{ x: 0, y: 0 }],
  fruit: { x: 0, y: 250 },
  playing: false,
  grow: 0,
};

document.onkeydown = (e) => {
  direction = DIRECTION[e.key];
  const [x, y] = direction;
  if (-x !== controller.movimiento.x && -y !== controller.movimiento.y) {
    controller.movimiento.x = x;
    controller.movimiento.y = y;
  }
};

const looper = () => {
  const head = controller.snake[0];
  let tail = {};
  Object.assign(tail, controller.snake[controller.snake.length - 1]);
  let chased = head.x === controller.fruit.x && head.y === controller.fruit.y;
  let dirX = controller.movimiento.x;
  let dirY = controller.movimiento.y;
  let snakeSize = controller.snake.length - 1;

  for (let i = snakeSize; i > -1; i--) {
    const head = controller.snake[i];

    if (i === 0) {
      head.x += dirX;
      head.y += dirY;
    } else {
      head.x = controller.snake[i - 1].x;
      head.y = controller.snake[i - 1].y;
    }
  }

  if (chased) {
    controller.grow += 1;
    newPosition();
  }

  if (controller.grow > 0) {
    controller.snake.push(tail);
    controller.grow -= 1;
  }

  requestAnimationFrame(render);

  setTimeout(looper, TIMER);
};

const newPosition = () => {
  newFruitPosition = randomPosition();
  let fruit = controller.fruit;
  fruit.x = newFruitPosition.x;
  fruit.y = newFruitPosition.y;
  points++;
  pointsCounter.innerHTML = `${points}`;
};

let render = () => {
  ctx.clearRect(0, 0, canvasSIze, canvasSIze);
  let fruit = controller.fruit;

  for (i = 0; i < controller.snake.length; i++) {
    const { x, y } = controller.snake[i];
    createObjects("green", x, y);
  }

  createObjects("orange", fruit.x, fruit.y);
};

let createObjects = (color, x, y) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);
};

const randomPosition = () => {
  let direction = Object.values(DIRECTION);
  return {
    x: parseInt(Math.floor(Math.random() * (35 - 10)) + 10),
    y: parseInt(Math.floor(Math.random() * (35 - 10)) + 10),
    d: direction[parseInt(Math.random() * 11)],
  };
};

window.onload = () => {
  direction = randomPosition();

  let head = controller.snake[0];
  head.x = direction.x;
  head.y = direction.y;
  controller.movimiento.x = direction.d[0];
  controller.movimiento.y = direction.d[1];

  fruitPosition = randomPosition();
  let fruit = controller.fruit;
  fruit.x = fruitPosition.x;
  fruit.y = fruitPosition.y;

  looper();
};
