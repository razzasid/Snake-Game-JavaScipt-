// Game Constants and variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/Roku Snake OST  Main Theme.mp3");
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let isPaused = false;

// Speed levels configuration
const speedLevels = [
  { score: 0, speed: 5 },
  { score: 5, speed: 6 },
  { score: 10, speed: 7 },
  { score: 15, speed: 8 },
  { score: 20, speed: 9 },
  { score: 30, speed: 10 },
  { score: 40, speed: 11 },
  { score: 50, speed: 12 },
  { score: 60, speed: 13 },
  { score: 70, speed: 14 },
  { score: 80, speed: 15 },
  { score: 100, speed: 16 },
];

// Show instructions when the game loads
window.addEventListener("load", () => {
  document.getElementById("instructions").style.display = "block";
});

// Hide instructions when a key is pressed (desktop) or a button is tapped (mobile)
window.addEventListener("keydown", hideInstructions);
document.querySelectorAll(".control-btn").forEach((button) => {
  button.addEventListener("touchstart", hideInstructions);
});

function hideInstructions() {
  document.getElementById("instructions").style.display = "none";
  // Remove event listeners after the game starts
  window.removeEventListener("keydown", hideInstructions);
  document.querySelectorAll(".control-btn").forEach((button) => {
    button.removeEventListener("touchstart", hideInstructions);
  });
}

// Function to generate food at a valid position, including edges
function generateFood() {
  let newFoodPosition;

  do {
    let a = 0; // Allow food on the edge (x and y between 0 and 17)
    let b = 17; // Maximum index for an 18x18 grid
    newFoodPosition = {
      x: Math.floor(a + (b - a + 1) * Math.random()), // Use Math.floor for consistent grid placement
      y: Math.floor(a + (b - a + 1) * Math.random()),
    };
  } while (isFoodOnSnake(newFoodPosition)); // Ensure food doesn't spawn on the snake's body

  return newFoodPosition;
}

// Function to check if food overlaps with the snake
function isFoodOnSnake(foodPosition) {
  return snakeArr.some(
    (segment) => segment.x === foodPosition.x && segment.y === foodPosition.y
  );
}

// Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);

  if (isPaused) {
    return; // Skip game updates if paused
  }

  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }

  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // If you bump into the wall
  if (
    snake[0].x >= 18 ||
    snake[0].x < 0 ||
    snake[0].y >= 18 ||
    snake[0].y < 0
  ) {
    return true;
  }
  return false;
}

function gameEngine() {
  // Updating the snake array and food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    alert("Game over. Press any key to play again!");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    speed = 5; // Reset speed
    musicSound.play(); // Restart music
  }

  // If you have eaten the food, increment the score and regenerate the food.
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score++;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    }
    scoreBox.innerHTML = "Score: " + score;

    // Generate new food position
    food = generateFood();

    // Add new segment to the snake
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    // Update speed based on score
    for (const level of speedLevels) {
      if (score >= level.score) {
        speed = level.speed;
      }
    }
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Display the snake and food
  board.innerHTML = ""; // Clear previous elements
  snakeArr.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y + 1;
    snakeElement.style.gridColumnStart = e.x + 1;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // Display the food
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y + 1;
  foodElement.style.gridColumnStart = food.x + 1;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
let hiscoreval;
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);

// Handle touch input for direction controls
document.getElementById("up").addEventListener("touchstart", () => {
  if (!isPaused && inputDir.y === 0) {
    // Prevent reversing direction
    inputDir = { x: 0, y: -1 };
  }
});

document.getElementById("down").addEventListener("touchstart", () => {
  if (!isPaused && inputDir.y === 0) {
    // Prevent reversing direction
    inputDir = { x: 0, y: 1 };
  }
});

document.getElementById("left").addEventListener("touchstart", () => {
  if (!isPaused && inputDir.x === 0) {
    // Prevent reversing direction
    inputDir = { x: -1, y: 0 };
  }
});

document.getElementById("right").addEventListener("touchstart", () => {
  if (!isPaused && inputDir.x === 0) {
    // Prevent reversing direction
    inputDir = { x: 1, y: 0 };
  }
});

// Example: Ignore touch on control buttons when toggling pause
const controlButtons = document.querySelectorAll(".control-btn");

window.addEventListener("touchstart", (e) => {
  if ([...controlButtons].some((button) => button.contains(e.target))) {
    return; // Exit if a control button is tapped
  }

  // Toggle pause if the tap is not on a button
  isPaused = !isPaused;

  if (isPaused) {
    musicSound.pause(); // Pause the music when the game is paused
  } else {
    musicSound.play(); // Resume the music when the game is unpaused
  }
});
// Handle keydown events
window.addEventListener("keydown", (e) => {
  moveSound.play();
  musicSound.play();

  // Prevent snake from reversing direction
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (inputDir.y === 0) {
        // Only allow up if the snake is not already moving vertically
        inputDir = { x: 0, y: -1 };
      }
      break;
    case "ArrowDown":
    case "s":
      if (inputDir.y === 0) {
        // Only allow down if the snake is not already moving vertically
        inputDir = { x: 0, y: 1 };
      }
      break;
    case "ArrowLeft":
    case "a":
      if (inputDir.x === 0) {
        // Only allow left if the snake is not already moving horizontally
        inputDir = { x: -1, y: 0 };
      }
      break;
    case "ArrowRight":
    case "d":
      if (inputDir.x === 0) {
        // Only allow right if the snake is not already moving horizontally
        inputDir = { x: 1, y: 0 };
      }
      break;
    case " ":
      // Toggle pause
      isPaused = !isPaused;
      if (isPaused) {
        musicSound.pause();
      } else {
        musicSound.play();
      }
      break;
    default:
      break;
  }
});
