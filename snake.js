let size = 10;
let TIMER = 80;
let canvas = document.querySelector("canvas");
let pointsCounter = document.querySelector(".points-counter");
console.log(pointsCounter);
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
  let head = controller.snake[0];
  let chased = head.x === controller.fruit.x && head.y === controller.fruit.y;
  let dirX = controller.movimiento.x;
  let dirY = controller.movimiento.y;
  head.x += dirX;
  head.y += dirY;

  if (chased) {
    newPosition();
  }

  requestAnimationFrame(render);

  setTimeout(looper, TIMER);
};
console.log(points);

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
  let snake = controller.snake[0];
  let fruit = controller.fruit;
  createObjects("green", snake.x, snake.y);
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
