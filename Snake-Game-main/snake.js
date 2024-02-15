
// // set score
// let score = 0;


// let changingDirection = false;
// let dirX = 10; //horizontal velocity
// let dirY = 0; // vertical veloci    ty
// //set food basics
// let foodX;
// let foodY;

// let snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
// //Game constants:
// //  Score display
// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext('2d');

// const scoreDisplay = document.getElementById("score");

// const startButton = document.getElementById("start-btn");

// const snakeSpeed = 1;
// const snakeColor = "green";
// const foodColor = "blue";
// const foodSize = 10;
// const snakeSize = 10;
// main();
// // Create the first food location
// createFood();
// // Call changeDirection whenever a key is pressed
// document.addEventListener("keydown", changeDirection);

// function main() {
//     if (gameOver()) return;

//     setTimeout(function onTick() {
//         changingDirection = false;
//         clearCanvas();
//         drawFood();
//         growSnake();
//         drawSnake();
//         main();
//     }, snakeSpeed)
// }


// function randomTen(min, max) {
//     return Math.round(Math.random() * (max - min) + min / 10) * 10;

// }
// function createFood() {
//     foodX = randomTen(0, canvas.width - 10);
//     foodY = randomTen(0, canvas.height - 10);
// }
// for (let i = 0; i < snake.length; i++) {
//     const SnakeIsOnfood = snake[i].x === foodX && snake[i].y === foodY;
//     if (SnakeIsOnfood) {
//         createFood();

//     }

// };

// function drawFood() {
//     ctx.fillStyle = foodColor;
//     ctx.fillRect(foodX, foodY, foodSize, foodSize);
// }


// function drawSnakePart(SnakePart) {
//     ctx.fillStyle = snakeColor
//         ;
//     ctx.fillRect(SnakePart.x, SnakePart.y, snakeSize, snakeSize);
// }

// function drawSnake() {
//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Set the Snake color
//     ctx.fillStyle = snakeColor;

//     // Draw the Snake
//     for (let i = 0; i < snake.length; i++) {
//         ctx.fillRect(snake[i].x * snakeSize, snake[i].y * snakeSize, snakeSize, snakeSize); // Adjust position and size as needed
//     }
// }
// function growSnake() {
//     const head = { x: snake[0].x + dirX, y: snake[0].y + dirY };
//     snake.unshift(head);

//     const didEatfood = snake[0].x === foodX && snake[0].y === foodY;
//     if (didEatfood) {
//         score += 10;

//         document.getElementById("score").innerHTML = score;
//         createFood();
//     } else {
//         snake.pop();
//     }
// }

// function gameOver() {
//     for (let i = 2; i < snake.length; i++) {
//         if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
//             return true;
//         }
//     }

//     const hitLeftWall = snake[0].x < 0;
//     const hitRightWall = snake[0].x > canvas.width - snakeSize;
//     const hitTopWall = snake[0].y < 0;
//     const hitBottomWall = snake[0].y > canvas.height - snakeSize;

//     return hitLeftWall || hitBottomWall || hitRightWall || hitTopWall;
// }
// function clearCanvas() {
//     //  Select the colour to fill the drawing
//     ctx.fillStyle = 'black';
//     //  Select the colour for the border of the canvas
//     ctx.strokestyle = 'bisque';

//     // Draw a "filled" rectangle to cover the entire canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// }


// function changingDirection(event) {
//     //Directional settings

//     const leftKey = 37;
//     const rightKey = 39;
//     const upKey = 38;
//     const downKey = 40;

//     if (changingDirection) { return; }
//     changingDirection = true;

//     const keyPressed = event.keyCode;

//     const moveUp = dirY === -snakeSize;
//     const moveDown = dirY === snakeSize;
//     const moveRight = dirX === snakeSize;
//     const moveLeft = dirX === -snakeSize;
//     if ((keyPressed === leftKey || keyPressed === rightKey || keyPressed === upKey || keyPressed === downKey) && !moveRight) {
//         event.preventDefault(); // Prevent default behavior of arrow keys
//     }
//     if (keyPressed === leftKey && !moveRight) {
//         dirX = -snakeSize;
//         dirY = 0;

//     }
//     if (keyPressed === rightKey && !moveLeft) {
//         dirX = snakeSize;
//         dirY = 0;

//     }
//     if (keyPressed === upKey && !moveDown) {
//         dirX = 0;
//         dirY = -snakeSize;

//     }
//     if (keyPressed === downKey && !moveUp) {
//         dirX = 0;
//         dirY = snakeSize;

//     }
// }

// function startGame() {

//     changingDirection = false;
//     clearCanvas();
//     createFood();
//     drawSnake();
//     drawFood();
//     growSnake();

//     setInterval(function () {
//         console.log("Game loop tick");
//         if (!gameOver()) {
//             growSnake();
//             drawSnake();
//             drawFood();
//         } else {
//             alert("Game Over!");

//             score = 0;
//             document.getElementById("score").innerHTML = score;

//             snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
//             dirX = 10;
//             dirY = 0;
//             clearCanvas();
//             createFood();
//             drawSnake();
//             drawFood();
//         }
//     }, snakeSpeed);


// }

// startButton.addEventListener("click", startGame);
// document.addEventListener("keydown", changingDirection);




