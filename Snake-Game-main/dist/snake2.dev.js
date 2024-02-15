"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var tableBody = document.querySelector("#highScoreTable tbody"); // Your script code here

  var GAME_SPEED = 80;
  var CANVAS_BORDER_COLOUR = "red"; // const SNAKE_COLOUR = 'lightgreen';
  // const SNAKE_BORDER_COLOUR = 'darkgreen';
  // const FOOD_COLOUR = 'red';
  // const FOOD_BORDER_COLOUR = 'darkred';

  var snakeSize = 40;
  var foodSize = 40;
  var movement = 25;
  var snake = [{
    x: 150,
    y: 150
  }, {
    x: 140,
    y: 150
  }]; // The user's score

  var score = 0; // When set to true the snake is changing direction

  var changingDirection = false; // Food x-coordinate

  var foodirX; // Food y-coordinate

  var foodirY; // Horizontal velocity

  var dirX = 10; // Vertical velocity

  var dirY = 0;
  var playerName; // Get the canvas element

  var gameCanvas = document.getElementById("gameCanvas"); // Return a two dimensional drawing context

  var ctx = gameCanvas.getContext("2d");
  var started = false; // Variable to track if the game has started
  // Add event listener for keydown event on the document

  document.addEventListener("keydown", function (event) {
    // Check if the game has already started or if the pressed key is an arrow key (key codes 37-40)
    if (!started && event.key === "Enter") {
      started = true;
      document.getElementById("textOverlay").style.visibility = "hidden"; // Set started to true to indicate the game has started

      createFood(); // Create initial food

      main(); // Start the game
    }
  });
  /**
   * Main function of the game
   * called repeatedly to advance the game
   */

  function main() {
    console.log("Game loop running..."); // Debugging: Log that the game loop is running
    // If the game ended return early to stop game

    if (didGameEnd()) {
      updateHighScoresIfNeeded();
      console.log("Game ended."); // Debugging: Log that the game ended

      return;
    }

    setTimeout(function onTick() {
      console.log("Tick..."); // Debugging: Log that the tick is happening

      changingDirection = false;
      clearCanvas();
      drawFood();
      drawSnake();
      advanceSnake(); // Call game again

      main();
    }, GAME_SPEED);
    document.addEventListener("keydown", changeDirection);
  }
  /**
   * Change the background colour of the canvas to CANVAS_BACKGROUND_COLOUR and
   * draw a border around it
   */


  function clearCanvas() {
    //   Load the background image
    // Load the background image
    var backgroundImage = new Image();
    backgroundImage.src = "C:/Users/RalphvanBeek/Downloads/Snake-Game-main/Snake-Game-main/9a5c87cb4c0eedba092a080a4eaac18d0b03f367ac3189d62b2d6fc753ed2929.png"; // Replace 'background_image_url.jpg' with the URL of your background image
    // Once the background image is loaded, draw it onto the canvas

    backgroundImage.onload = function () {
      ctx.drawImage(backgroundImage, 0, 0, gameCanvas.width, gameCanvas.height); // Optionally, you can call other functions here to draw additional elements such as the snake and food

      drawFood();
      drawSnake();
    };
  }

  var snakeHeadImg = new Image();
  snakeHeadImg.src = "icons8-bitten-apple-48.png";
  var snakeBodyImg = new Image();
  snakeBodyImg.src = "icons8-whole-apple-48.png";
  var foodImg = new Image();
  foodImg.src = "icons8-snake-48.png";

  function drawFood() {
    ctx.drawImage(foodImg, foodirX, foodirY, foodSize, foodSize);
  }
  /**
   * Advances the snake by changing the x-coordinates of its parts
   * according to the horizontal velocity and the y-coordinates of its parts
   * according to the vertical veolocity
   */


  function didCollide(x1, y1, x2, y2, size1, size2) {
    return x1 < x2 + size2 && x1 + size1 > x2 && y1 < y2 + size2 && y1 + size1 > y2;
  }

  function advanceSnake() {
    // Create the new Snake's head
    var head = {
      x: snake[0].x + dirX,
      y: snake[0].y + dirY
    }; // Check if the snake's head collides with the food

    var didEatFood = didCollide(snake[0].x, snake[0].y, foodirX, foodirY, snakeSize, foodSize);

    if (didEatFood) {
      // Increase score
      score += 10; // Display score on screen

      document.getElementById("score").innerHTML = score; // Generate new food location

      createFood();
    } else {
      // Remove the last part of snake body
      snake.pop();
    } // Add the new head to the beginning of snake body


    snake.unshift(head);
  }
  /**
   * Returns true if the head of the snake touched another part of the game
   * or any of the walls
   */


  function didGameEnd() {
    // Check if the snake's head collides with any part of its body
    for (var i = 4; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        return true; // Game ends if the head collides with the body
      }
    } // Check if the snake's head collides with the borders of the canvas


    var hitLeftWall = snake[0].x < 0;
    var hitRightWall = snake[0].x + snakeSize > gameCanvas.width;
    var hitTopWall = snake[0].y < 0;
    var hitBottomWall = snake[0].y + snakeSize > gameCanvas.height;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
      return true;
    }
  }

  function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / foodSize) * foodSize;
  }
  /**
   * Creates random set of coordinates for the snake food.
   */


  function createFood() {
    // Generate a random number the food x-coordinate
    foodirX = randomTen(0, gameCanvas.width - foodSize); // Generate a random number for the food y-coordinate

    foodirY = randomTen(0, gameCanvas.height - foodSize); // if the new food location is where the snake currently is, generate a new food location

    snake.forEach(function isFoodOnSnake(part) {
      var foodIsoNsnake = part.x == foodirX && part.y == foodirY;
      if (foodIsoNsnake) createFood();
    });
  }
  /**
   * Draws the snake on the canvas
   */
  // loop through the snake parts drawing each part on the canvas


  function drawSnake() {
    // Draw the head of the snake
    var scaleX = 1; // Scale factor along the x-axis (default: no scaling)

    var scaleY = 1; // Scale factor along the y-axis (default: no scaling)

    var rotationAngle = 0; // Default rotation angle

    if (dirX === movement) {
      scaleX = -1; // Mirror horizontally if moving right
    } else if (dirX === -movement) {
      scaleX = 1; // Default scaling if moving left
    } else if (dirY === movement) {
      rotationAngle = -Math.PI / 2; // Rotate head counter-clockwise by 90 degrees if moving down

      scaleY = -1; // Mirror vertically if moving down
    } else if (dirY === -movement) {
      rotationAngle = Math.PI / 2; // Rotate head clockwise by 90 degrees if moving up

      scaleY = 1; // Default scaling if moving up
    }

    ctx.translate(snake[0].x + snakeSize / 2, snake[0].y + snakeSize / 2); // Translate to the center of the head

    ctx.rotate(rotationAngle); // Rotate the canvas

    ctx.scale(scaleX, scaleY); // Scale horizontally and/or vertically (mirroring)

    ctx.drawImage(snakeHeadImg, -snakeSize / 2, -snakeSize / 2, snakeSize, snakeSize); // Draw the head at the translated position with scaling

    ctx.scale(1 / scaleX, 1 / scaleY); // Reset scaling

    ctx.rotate(-rotationAngle); // Reset the rotation

    ctx.translate(-(snake[0].x + snakeSize / 2), -(snake[0].y + snakeSize / 2)); // Reset the translation
    // Draw the rest of the snake body

    for (var i = 1; i < snake.length; i++) {
      // Calculate the position of the current body segment based on its previous position and direction
      var x = snake[i].x;
      var y = snake[i].y; // Calculate the rotation angle for the body segment

      var bodyRotation = rotationAngle; // Adjust the rotation angle based on the direction of movement

      if (dirX === movement && i === 1) {
        bodyRotation += Math.PI; // Rotate body segment 180 degrees if moving right
      } else if (dirY === movement && i === 1) {
        bodyRotation -= Math.PI / 2; // Rotate body segment 90 degrees clockwise if moving down
      } else if (dirY === -movement && i === 1) {
        bodyRotation += Math.PI / 2; // Rotate body segment 90 degrees counter-clockwise if moving up
      } // Draw the body part with the calculated position and rotation


      ctx.translate(x + snakeSize / 2, y + snakeSize / 2); // Translate to the center of the body part

      ctx.rotate(bodyRotation); // Rotate the canvas

      ctx.drawImage(snakeBodyImg, -snakeSize / 2, -snakeSize / 2, snakeSize, snakeSize); // Draw the body part at the translated position with rotation

      ctx.rotate(-bodyRotation); // Reset the rotation

      ctx.translate(-(x + snakeSize / 2), -(y + snakeSize / 2)); // Draw the body part with the calculated position

      ctx.drawImage(snakeBodyImg, snake[i].x, snake[i].y, snakeSize, snakeSize);
    }
  }
  /**
   * Draws a part of the snake on the canvas
   * @param { object } snakePart - The coordinates where the part should be drawn
   */


  function drawSnakePart(snakePart) {
    // Draw the body parts of the snake using images
    ctx.drawImage(snakeBodyImg, snakePart.x, snakePart.y, snakeSize, snakeSize);
  } //  * Changes the vertical and horizontal velocity of the snake according to the
  //  * key that was pressed.
  //  * The direction cannot be switched to the opposite direction, to prevent the snake
  //  * from reversing
  //  * For example if the the direction is 'right' it cannot become 'left'
  //  * @param { object } event - The keydown event
  //  */


  function changeDirection(event) {
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
    var UP_KEY = 38;
    var DOWN_KEY = 40;

    if ([37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
    }
    /**
     * Prevent the snake from reversing
     * Example scenario:
     * Snake is moving to the right. User presses down and immediately left
     * and the snake immediately changes direction without taking a step down first
     */


    if (changingDirection) return;
    changingDirection = true;
    var keyPressed = event.keyCode;
    var goingUp = dirY === -movement;
    var goingDown = dirY === movement;
    var goingRight = dirX === movement;
    var goingLeft = dirX === -movement;

    if (keyPressed === LEFT_KEY && !goingRight) {
      dirX = -movement;
      dirY = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
      dirX = 0;
      dirY = -movement;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dirX = movement;
      dirY = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
      dirX = 0;
      dirY = movement;
    }
  } // Function to check if the score is a high score


  function isHighScore(score) {
    console.log("ishighscore is being checked"); // Get the current high scores from the table

    var highScoreRows = document.querySelectorAll("#highScoreTable tr");
    console.log("Number of high score rows:", highScoreRows.length);
    var highScores = Array.from(highScoreRows).map(function (row) {
      return parseInt(row.children[2].textContent);
    });
    console.log("High scores:", highScores); // Check if the score is higher than any of the existing high scores

    return highScores.some(function (highScore) {
      return score > highScore;
    });
  } // Function to update the high score table with the new score and name


  function updateHighScores(playerName, score) {
    console.log("Score is being updated", playerName, score); // Get the current high scores from the table

    var highScoreRows = document.querySelectorAll("#highScoreTable tr");
    console.log("Number of high score rows:", highScoreRows.length);
    var highScores = Array.from(highScoreRows).map(function (row) {
      return parseInt(row.children[2].textContent);
    });
    console.log("High scores:", highScores); // Find the index of the lowest high score that the new score beats

    var indexToReplace = highScores.findIndex(function (highScore) {
      return score > highScore;
    });
    console.log("Index to replace:", indexToReplace); // If the score is not a high score, return

    if (indexToReplace === -1) {
      console.log("Score is not a high score");
      return;
    } // Create a new row for the new high score


    var newRow = document.createElement("tr");
    newRow.innerHTML = "<td>".concat(indexToReplace + 1, "</td><td>").concat(playerName, "</td><td>").concat(score, "</td>");
    console.log("New row:", newRow); // Insert the new row into the table

    var tableBody = document.querySelector("#highScoreTable tbody");
    tableBody.insertBefore(newRow, highScoreRows[indexToReplace]);
    console.log("Table body:", tableBody); // If the table has more than 10 rows, remove the last row

    if (highScoreRows.length >= 10) {
      tableBody.removeChild(highScoreRows[highScoreRows.length - 1]);
    }
  }

  function updateHighScoresIfNeeded() {
    console.log("updating being done");
    var newScore = parseInt(document.getElementById("score").textContent);
    console.log(newScore); // Get the player's score

    if (isHighScore(newScore)) {
      playerName = prompt("enter your name:");
      console.log("checking high scores");
      updateHighScores(playerName, newScore);
    }
  }
});