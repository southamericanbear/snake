let size = 10;
let TIMER = 80;
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let direction;

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

let controller = { movimiento: { x: 1, y: 0 }, snake: [{ x: 0, y: 0 }] };

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
  let dirX = controller.movimiento.x;
  let dirY = controller.movimiento.y;
  head.x += dirX;
  head.y += dirY;

  requestAnimationFrame(render);

  setTimeout(looper, TIMER);
};

let render = (color) => {
  ctx.clearRect(0, 0, 500, 500);
  let head = controller.snake[0];
  ctx.fillStyle = "green";
  ctx.fillRect(head.x * size, head.y * size, size, size);
};

window.onload = () => {
  looper();
};
