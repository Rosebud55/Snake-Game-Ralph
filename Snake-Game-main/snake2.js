document.addEventListener("DOMContentLoaded", function () {
  //VARIABLES --------------------------------------------------------------------------------------------------------------------------------
  //Variables that still change in the Game
  // Starting speed of the snake
  let GAME_SPEED = 80;
  // Array to create the starting snake
  let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
  ];
  // The user's score
  let score = 0;
  // When set to true the snake is changing direction
  let changingDirection = false;
  // Food x-coordinate
  let foodirX;
  // Food y-coordinate
  let foodirY;
  // Horizontal velocity
  let dirX = 10;
  // Vertical velocity
  let dirY = 0;
  // Variable for a player to enter their name when a highscore is achieved
  let playerName;
  // Variable to track if the game has started
  let started = false;

  //Constant Variables in the Game
  // Get the canvas element
  const gameCanvas = document.getElementById("gameCanvas");
  // Return a two dimensional drawing context
  const ctx = gameCanvas.getContext("2d");
  // Sizes of the snake and food objects
  const snakeSize = 40;
  const foodSize = 40;
  // The horizontal movement speed
  const movement = 25;
  const snakeHeadImg = new Image();
  snakeHeadImg.src = "icons8-bitten-apple-48.png";

  const snakeBodyImg = new Image();
  snakeBodyImg.src = "icons8-whole-apple-48.png";

  const foodImg = new Image();
  foodImg.src = "icons8-snake-48.png";
  //  constant for increasing the speed in the speedUp function
  const speed = 0.25;

  // EVENT LISTENERS --------------------------------------------------------------------------------------------------------------------------------
  // Add event listener for enter key to start the game
  document.addEventListener("keydown", function (event) {
    // Check if the game has already started or if the pressed key is the Enter key
    if (!started && event.key === "Enter") {
      started = true;
      document.getElementById("textOverlay").style.visibility = "hidden"; // Set started to true to indicate the game has started
      createFood(); // Create initial food
      main(); // Start the game
    }
  });

  // Let the restart button reload the page
  document.getElementById("restart-btn").addEventListener("click", function () {
    // Reload the page
    location.reload();
  });

  // GAME FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------
  /**
   * Main function of the game
   * called repeatedly to create the game loop
   */
  function main() {
    // console.log("Game loop running..."); // Debugging: Log that the game loop is running
    // Check if gameOver equals true, meaning the game has ended.
    if (gameOver()) {
      // console.log("Game ended."); // Debugging: Log that the game ended
      updateHighscoresWhenHighscore();
      GAME_SPEED = 80;
      return;
    }

    //Gameloop to create the gameplay
    setTimeout(function onTick() {
      changingDirection = false;
      clearCanvas();
      moveSnake();
      speedUp(speed);

      // Call game again
      main();
    }, GAME_SPEED);
    document.addEventListener("keydown", snakeMovement);
  }

  /**
   * Reset the background image the snake and the food, gets called in the gameloop to create the movement:
   */
  function clearCanvas() {
    //   Load the background image
    // Load the background image
    const backgroundImage = new Image();
    backgroundImage.src =
      "9a5c87cb4c0eedba092a080a4eaac18d0b03f367ac3189d62b2d6fc753ed2929.png"; // Replace 'background_image_url.jpg' with the URL of your background image

    // Once the background image is loaded, draw it onto the canvas
    backgroundImage.onload = function () {
      ctx.drawImage(backgroundImage, 0, 0, gameCanvas.width, gameCanvas.height);

      drawFood();
      drawSnake();
    };
  }
  // Speed up the snake every 100 points for difficulty
  function speedUp(speed) {
    if (score != 0 && score % 100 == 0) {
      GAME_SPEED -= speed;
      return;
    }
  }
  // Draw the food
  function drawFood() {
    ctx.drawImage(foodImg, foodirX, foodirY, foodSize, foodSize);
  }

  /**
   * Advances the snake by changing the x-coordinates of its parts
   * according to the horizontal velocity and the y-coordinates of its parts
   * according to the vertical veolocity
   */
  function didCollide(x1, y1, x2, y2, size1, size2) {
    return (
      x1 < x2 + size2 && x1 + size1 > x2 && y1 < y2 + size2 && y1 + size1 > y2
    );
  }

  // Snakes movement and checking the collision with food
  function moveSnake() {
    // Create the new Snake's head
    const head = { x: snake[0].x + dirX, y: snake[0].y + dirY };

    // Check if the snake's head collides with the food
    const didEatFood = didCollide(
      snake[0].x,
      snake[0].y,
      foodirX,
      foodirY,
      snakeSize,
      foodSize
    );
    if (didEatFood) {
      // Increase score
      score += 10;
      // Display score on screen
      document.getElementById("score").innerHTML = score;

      // Generate new food location
      createFood();
    } else {
      // Remove the last part of snake body
      snake.pop();
    }

    // Add the new head to the beginning of snake body
    snake.unshift(head);
  }
  // Check for the game over conditions, did the snake collide with itself or the walls
  function gameOver() {
    // Check if the snake's head collides with any part of its body
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        return true; // Game ends if the head collides with the body
      }
    }

    // Check if the snake's head collides with the borders of the canvas
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x + snakeSize > gameCanvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y + snakeSize > gameCanvas.height;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
      return true;
    }
  }
  // Randomization function to create the random variables for the location of the food
  function randomTen(min, max) {
    return (
      Math.round((Math.random() * (max - min) + min) / foodSize) * foodSize
    );
  }

  /**
   * Creates random set of coordinates for the snake food.
   */
  function createFood() {
    // Generate a random number the food x-coordinate
    foodirX = randomTen(0, gameCanvas.width - foodSize);
    // Generate a random number for the food y-coordinate
    foodirY = randomTen(0, gameCanvas.height - foodSize);

    // if the new food location is where the snake currently is, generate a new food location
    snake.forEach(function isFoodOnSnake(part) {
      const foodIsoNsnake = part.x == foodirX && part.y == foodirY;
      if (foodIsoNsnake) createFood();
    });
  }

  /**
   * Function for drawing the snake and rotating the head and
   * body accordingly so the movement looks correct
   */
  function drawSnake() {
    // Draw the head of the snake
    let scaleX = 1; // Scale factor along the x-axis (default: no scaling)
    let scaleY = 1; // Scale factor along the y-axis (default: no scaling)
    let rotationAngle = 0; // Default rotation angle

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
    ctx.drawImage(
      snakeHeadImg,
      -snakeSize / 2,
      -snakeSize / 2,
      snakeSize,
      snakeSize
    ); // Draw the head at the translated position with scaling
    ctx.scale(1 / scaleX, 1 / scaleY); // Reset scaling
    ctx.rotate(-rotationAngle); // Reset the rotation
    ctx.translate(-(snake[0].x + snakeSize / 2), -(snake[0].y + snakeSize / 2)); // Reset the translation

    // Draw the rest of the snake body
    for (let i = 1; i < snake.length; i++) {
      // Calculate the position of the current body segment based on its previous position and direction
      const x = snake[i].x;
      const y = snake[i].y;

      // Calculate the rotation angle for the body segment
      let bodyRotation = rotationAngle;

      // Adjust the rotation angle based on the direction of movement
      if (dirX === movement && i === 1) {
        bodyRotation += Math.PI; // Rotate body segment 180 degrees if moving right
      } else if (dirY === movement && i === 1) {
        bodyRotation -= Math.PI / 2; // Rotate body segment 90 degrees clockwise if moving down
      } else if (dirY === -movement && i === 1) {
        bodyRotation += Math.PI / 2; // Rotate body segment 90 degrees counter-clockwise if moving up
      }

      // Draw the body part with the calculated position and rotation
      ctx.translate(x + snakeSize / 2, y + snakeSize / 2); // Translate to the center of the body part
      ctx.rotate(bodyRotation); // Rotate the canvas
      ctx.drawImage(
        snakeBodyImg,
        -snakeSize / 2,
        -snakeSize / 2,
        snakeSize,
        snakeSize
      ); // Draw the body part at the translated position with rotation
      ctx.rotate(-bodyRotation); // Reset the rotation
      ctx.translate(-(x + snakeSize / 2), -(y + snakeSize / 2));
      // Draw the body part with the calculated position
      ctx.drawImage(snakeBodyImg, snake[i].x, snake[i].y, snakeSize, snakeSize);
    }
  }
  // MOVEMENT --------------------------------------------------------------------------------------------------------------------------------
  //  * Changes the vertical and horizontal velocity of the snake according to the
  //  * key that was pressed.
  //  * The direction cannot be switched to the opposite direction, to prevent the snake
  //  * from reversing.
  //  */
  function snakeMovement(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
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

    const keyPressed = event.keyCode;

    const goingUp = dirY === -movement;
    const goingDown = dirY === movement;
    const goingRight = dirX === movement;
    const goingLeft = dirX === -movement;

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
  }
  // HIGHSCORE FUNCTIONS -----------------------------------------------------------------------------------------------------------------------
  // Function to check if the score is a high score
  function isHighScore(score) {
    console.log("ishighscore is being checked");
    // Get the current high scores from the table
    const highScoreRows = document.querySelectorAll("#highScoreTable tr");

    console.log("Number of high score rows:", highScoreRows.length);

    const highScores = Array.from(highScoreRows).map((row) =>
      parseInt(row.children[2].textContent)
    );

    console.log("High scores:", highScores);

    // Check if the score is higher than any of the existing high scores
    return highScores.some((highScore) => score > highScore);
  }

  // Function to update the high score table with the new score and name
  function updateHighScores(playerName, score) {
    console.log("Score is being updated", playerName, score);
    // Get the current high scores from the table
    const highScoreRows = document.querySelectorAll("#highScoreTable tr");

    console.log("Number of high score rows:", highScoreRows.length);

    const highScorestable = Array.from(highScoreRows).map((row) =>
      parseInt(row.children[2].textContent)
    );

    console.log("High scores:", highScorestable);

    // Find the index of the lowest high score that the new score beats
    const indexToReplace = highScorestable.findIndex(
      (highScore) => score > highScore
    );
    console.log("Index to replace:", indexToReplace);

    // If the score is not a high score, return
    if (indexToReplace > 10) {
      console.log("Score is not a high score");
      return;
    }

    // Create a new row for the new high score
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${
      indexToReplace + 1
    }</td><td>${playerName}</td><td>${score}</td>`;

    // console.log("New row:", newRow);

    // Insert the new row into the table
    const tableBody = document.querySelector("#highScoreTable");

    // console.log(tableBody);
    // insert row above 'indexToReplace'
    tableBody.insertBefore(newRow, highScoreRows[indexToReplace]);

    console.log("Table body:", tableBody);

    // If the table has more than 10 rows, remove the last row
    if (highScoreRows.length >= 10) {
      tableBody.removeChild(highScoreRows[highScoreRows.length - 1]);
    }
  }
  // Function to check and update the highscore table if needed.
  function updateHighscoresWhenHighscore() {
    // console.log("updating being done");
    let newScore = parseInt(document.getElementById("score").textContent);
    console.log(newScore); // Get the player's score
    if (isHighScore(newScore)) {
      playerName = prompt(
        "Congratulations! You scored a HIGHSCORE! please enter your name:"
      );
      // console.log("checking high scores");
      updateHighScores(playerName, newScore);
    }
  }
});
