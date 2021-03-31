let size = 10;
let TIMER = 80;
let canvas = document.querySelector("canvas");
let pointsCounter = document.querySelector(".points-counter");
let canvasSIze = 500;
let ctx = canvas.getContext("2d");
let direction;
let points = 0;
let level = 1;
let eatFruitAudio = document.getElementById("fruitAudio");
let loseAudio = document.getElementById("loseAudio");
let gameOver = document.querySelector(".game-over");
let keyUp = document.querySelector(".keyUp");
let keyRight = document.querySelector(".keyRight");
let keyDown = document.querySelector(".keyDown");
let keyLeft = document.querySelector(".keyLeft");
let start = document.querySelector(".start-span");
let levelNumberSpan = document.querySelector(".level-number");
let pointsSpanNumber = document.querySelector(".points-number");
let finalScore = document.querySelector(".final-score");

// 1) We create this variable with all the controlls that we can use in the game. This controls are fired with `document.onkeydown`.
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

// 3) This controller objects is the main core of the game, here we have the movimiento, which is the direction were the snake is going, alse we have the snake, which have an array with another object inside with the location, fruit is the food of the snake, shows up randomly all around the map, playing like the word say holds a false boolean that turns true when the game start, and grow it's the size of the snake.
let controller = {
  movimiento: { x: 1, y: 0 },
  snake: [{ x: 0, y: 0 }],
  fruit: { x: 0, y: 250 },
  playing: false,
  grow: 0,
};

// 2) Use the event 'onkeydown' to track the keys that we are pressing in the game, so we can move the snake.
document.onkeydown = (e) => {
  // Here we get the key that we press and we save it in the variable direction
  direction = DIRECTION[e.key];
  // We pass the value of the keydown into the variables x and y
  const [x, y] = direction;
  // With this conditional we check if the key that we press is not in the oposite direction to the head of the snake, so we can't go backward with the snake.
  if (-x !== controller.movimiento.x && -y !== controller.movimiento.y) {
    // And here we pass the direction of x and y to the controller object in the movimiento key
    controller.movimiento.x = x;
    controller.movimiento.y = y;
  }
};

keyUp.addEventListener("click", () => {
  controller.movimiento.x = 0;
  controller.movimiento.y = -1;
});
keyRight.addEventListener("click", () => {
  controller.movimiento.x = 1;
  controller.movimiento.y = 0;
});
keyDown.addEventListener("click", () => {
  controller.movimiento.x = 0;
  controller.movimiento.y = 1;
});
keyLeft.addEventListener("click", () => {
  controller.movimiento.x = -1;
  controller.movimiento.y = 0;
});

// 4)Looper is a function that like his name says it's a loop, in this function we do things like create the head of the snake, create the tail, asign the direction of the snake, check if the snake is eating the fruits, make the snake grow(in some part) between another things, this function is posible because we use the setTimeout in the last line calling the function againt and setting the time with the variable TIME.
const looper = () => {
  if (!controller.playing) return;
  // Here we get the head of the snake taking the firs position of the array of coordinates.
  const head = controller.snake[0];
  // This empty object is the tail, is filled with the length of the snake, for example everytime the snake eats a fruit in controller.snake: its added a new object, that object is passed to the tail.
  let tail = {};
  Object.assign(tail, controller.snake[controller.snake.length - 1]);
  // this is simple, if the head is in the same position of x and y as the fruit, the fruit it's chased ;), oooh almost forgot to said this, chased hold a boolean in false that changes to true when the snake chase a fruit
  let chased = head.x === controller.fruit.x && head.y === controller.fruit.y;

  // Here we check if the function detectCrash() is true, if thar it's correct it will pass playing back again to false, set the innerHtml of pointsCounter with a new message and make the snake disappear from the screen
  if (detectCrash()) {
    loseAudio.play();
    pointsCounter.classList.add("hide");
    finalScore.innerHTML = `Your final score is : ${points}`;
    gameOver.classList.remove("hide");
    controller.playing = false;
  }
  // Do you remember in 'onkeydown' that we pass the value of x and y to the controller.movimiento? well now we pass that value into a new variables that gave us the position to render of the snake and his body.
  let dirX = controller.movimiento.x;
  let dirY = controller.movimiento.y;
  // This variable gave us the size of the snake, searchin into the array of object that was created inside snake.
  let snakeSize = controller.snake.length - 1;

  // What does this loop? well it's a little tricky you know? Even I don't understand very well the logic but well, it's works.
  // The for loop runs in backward through the array of objects that snakesize is and gave back the head, then we chake if the index of the array is 0 the computer will add the value of dirX to head.x and the same for head.y and dirY, else we will pass the position of the index -1 of the snake array into the head and here is where the magic happens!
  if (controller.playing) {
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
  }

  // Here we check if the snake ate the fruit or not, if that it's true it will add 1 to the grow and fire the function that make appear a new fruit in the window

  if (chased) {
    controller.grow += 1;
    eatFruitAudio.play();
    newPosition();
  }

  // This check if the grow it's bigger than zero if that it's true we made a push into the snake with the new position and then reset the grow back to zero again

  if (controller.grow > 0) {
    controller.snake.push(tail);
    controller.grow -= 1;
  }
  requestAnimationFrame(render);

  setTimeout(looper, TIMER);
};

// 10) This function checks is the head of the snake crash against the walls if thar happens it returns a boolean in true
const detectCrash = () => {
  let head = controller.snake[0];
  // We check here if the head of the snake it's out of the bounderies of the canvas, if that it's correct GAME OVER!
  if (head.x < 0 || head.x >= 40 || head.y >= 40 || head.y < 0) {
    return true;
  }
  // Also we check if the snake touchs himself, if that happens you know... GAME OVER!
  for (i = 1; i < controller.snake.length; i++) {
    let snakeHead = controller.snake[i];
    if (snakeHead.x === head.x && snakeHead.y === head.y) {
      return true;
    }
  }
};

// 9) here we create the new position for the fruit this funcion grab a random number from the random position, then pass it into x and y from fruit and theeeeeen oh man I almos foget it, the game have an wait for it... POINTS COUNTER, so here we add a new point to the counter and then we render those points into the html
const newPosition = () => {
  newFruitPosition = randomPosition();
  let fruit = controller.fruit;
  fruit.x = newFruitPosition.x;
  fruit.y = newFruitPosition.y;
  points++;
  levelNumberSpan.innerHTML = `${level}`;
  pointsSpanNumber.innerHTML = `${points}`;
  if (points === 3) {
    TIMER = 70;
  }
  if (points === 7) {
    TIMER = 60;
    level = 2;
  }
  if (points === 15) {
    TIMER = 50;
    level = 3;
  }
  if (points === 20) {
    TIMER = 40;
    level = 4;
  }
  if (points === 25) {
    TIMER = 30;
    level = 5;
  }
  if (points === 35) {
    level = 6;
  }
};

// 5) Render makes the objects shows up in the screen
let render = () => {
  // this clear all the pixels in the canvas
  ctx.clearRect(0, 0, canvasSIze, canvasSIze);
  // this create the fruit
  let fruit = controller.fruit;

  // this loop go though all the objects inside the array of snake and get the positions of x and y, then after the loop is finished it's passed to the funcion createObjects that create the pixels that will form the body of the animal

  for (i = 0; i < controller.snake.length; i++) {
    const { x, y } = controller.snake[i];
    createObjects("green", x, y);
  }
  // this is similar to the previous one but it's only for the fruit
  createObjects("orange", fruit.x, fruit.y);
};

// 8) Here we create a function that create new objects we can rehusit all the time
let createObjects = (color, x, y) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);
};

// 7) this create random numbers that will made our objets show up everytime in a diferent position
const randomPosition = () => {
  let direction = Object.values(DIRECTION);
  return {
    x: parseInt(Math.floor(Math.random() * (35 - 10)) + 10),
    y: parseInt(Math.floor(Math.random() * (35 - 10)) + 10),
    d: direction[parseInt(Math.random() * 11)],
  };
};

let startOver = () => {
  TIMER = 80;
  level = 1;
  points = 0;
  controller = {
    movimiento: { x: 1, y: 0 },
    snake: [{ x: 0, y: 0 }],
    fruit: { x: 0, y: 250 },
    playing: false,
    grow: 0,
  };
  // here we gave a random direction for the head of the snake
  direction = randomPosition();

  let head = controller.snake[0];
  // here we gave the random direction to the head of the snake
  head.x = direction.x;
  head.y = direction.y;
  // and pass it into the movimiento to make it move
  controller.movimiento.x = direction.d[0];
  controller.movimiento.y = direction.d[1];

  // basically all the same but for the fruit
  fruitPosition = randomPosition();
  let fruit = controller.fruit;
  fruit.x = fruitPosition.x;
  fruit.y = fruitPosition.y;
  // we call looper and the party starts and pass playing to true
  controller.playing = true;
};

// 6) Here it's where everything start

document.body.onkeyup = (e) => {
  if (e.keyCode == 32) {
    gameOver.classList.add("hide");
    const title = document.querySelector("h1");
    title.classList.add("hide");
    pointsCounter.classList.remove("hide");
    startOver();
    levelNumberSpan.innerHTML = ` ${level}`;
    pointsSpanNumber.innerHTML = ` ${points}`;
    looper();
  }
};

start.addEventListener("click", () => {
  gameOver.classList.add("hide");
  const title = document.querySelector("h1");
  title.classList.add("hide");
  pointsCounter.classList.remove("hide");
  startOver();
  levelNumberSpan.innerHTML = `${level} `;
  pointsSpanNumber.innerHTML = `${points}`;
  looper();
});
