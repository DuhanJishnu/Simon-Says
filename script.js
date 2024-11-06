// Initial References
const countValue = document.getElementById("count");
const colorPart = document.querySelectorAll(".color-part");
const container = document.querySelector(".container");
const startButton = document.querySelector("#start");
const result = document.querySelector("#result");
const wrapper = document.querySelector(".wrapper");
const restart = document.querySelector("#restart");
const Pause = document.querySelector("#Pause");
const difficultySelect = document.getElementById("difficulty"); // New difficulty selector

// Mapping Colors By Creating Colors Object
const colors = {
  color1: {
    current: "#068e06",
    new: "#11e711",
  },
  color2: {
    current: "#950303",
    new: "#fd2a2a",
  },
  color3: {
    current: "#01018a",
    new: "#2062fc",
  },
  color4: {
    current: "#919102",
    new: "#fafa18",
  },
};

let randomColors = [];
let pathGeneratorBool = false;
let count, clickCount = 0;
let score = 0;
let isPaused = false; // Track the paused state
let pathSequence = []; // Track the sequence during pause
let difficulty = "Player"; // Default difficulty
let speedFactor = 1; // Time delay multiplier based on difficulty

// Function to start the game
startButton.addEventListener("click", () => {
  difficulty = difficultySelect.value; // Get selected difficulty
  setDifficulty();
  count = 0;
  clickCount = 0;
  randomColors = [];
  pathGeneratorBool = false;
  isPaused = false; // Reset pause state
  startButton.classList.add("hide")
  wrapper.classList.remove("hide");
  container.classList.add("hide");
  result.classList.remove("hide");
  restart.classList.remove("hide");
  Pause.classList.remove("hide");
  pathGenerate();
});

// Function to decide the sequence
const pathGenerate = () => {
  randomColors.push(generateRandomValue(colors));
  count = randomColors.length;
  pathGeneratorBool = true;
  pathDecide(count);
};

// Function to get a random value from the colors object
const generateRandomValue = (obj) => {
  let arr = Object.keys(obj);
  return arr[Math.floor(Math.random() * arr.length)];
};

// Function to play the sequence
const pathDecide = async (count) => {
  countValue.innerText = count;

  for (let i of randomColors) {
    if (isPaused) {
      // Wait until the game is resumed
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!isPaused) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }

    let currentColor = document.querySelector(`.${i}`);
    await delay(500 / speedFactor); // Adjust speed based on difficulty
    currentColor.style.backgroundColor = `${colors[i]["new"]}`;
    await delay(600 / speedFactor); // Adjust speed based on difficulty
    currentColor.style.backgroundColor = `${colors[i]["current"]}`;
    await delay(600 / speedFactor); // Adjust speed based on difficulty
  }
  pathGeneratorBool = false;
};

// Delay for blink effect
async function delay(time) {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// When the user clicks on the colors
colorPart.forEach((element) => {
  element.addEventListener("click", async (e) => {
    // If the path is still being generated, ignore clicks
    if (pathGeneratorBool || isPaused) {
      return false;
    }
    
    if (e.target.classList[0] == randomColors[clickCount]) {
      // Color blink effect on click
      e.target.style.backgroundColor = `${colors[randomColors[clickCount]]["new"]}`;
      await delay(500 / speedFactor);

      e.target.style.backgroundColor = `${colors[randomColors[clickCount]]["current"]}`;

      // User click
      clickCount += 1;

      // Next level if the number of valid clicks equals the count
      if (clickCount == count) {
        clickCount = 0;
        score += 10;
        result.innerHTML = `<span> Your Score: </span> ${score}`;
        pathGenerate();
      }
    } else {
      lose();
    }
  });
});

// Restart the game
restart.addEventListener("click", () => {
  count = 0;
  clickCount = 0;
  randomColors = [];
  pathGeneratorBool = false;
  score = 0;
  result.innerHTML = `<span> Your Score: </span> ${score}`;
  pathGenerate();
});

// Pause/Resume the game
Pause.addEventListener("click", () => {
  if (isPaused) {
    // Resume the game
    isPaused = false;
    Pause.innerText = "Pause";
    pathDecide(count); // Resume the path sequence
  } else {
    // Pause the game
    isPaused = true;
    pathGeneratorBool = false; // Stop the sequence generation
    Pause.innerText = "Resume";
  }
});

// Function when the player executes the wrong sequence
const lose = () => {
  result.innerHTML = `<span> Your Score: </span> ${score}`;
  result.style.top = '0px';
  result.style.left = '0px';
  container.classList.remove("hide");
  wrapper.classList.add("hide");
  restart.classList.add("hide");
  Pause.classList.add("hide");
  startButton.innerText = "Play Again";
  startButton.classList.remove("hide");
};

// Set difficulty parameters (speed and sequence length)
const setDifficulty = () => {
  switch (difficulty) {
    case "Noob":
      speedFactor = 0.5; // Slow down the sequence
      break;
    case "Player":
      speedFactor = 1; // Normal speed
      break;
    case "Master":
      speedFactor = 3; // Speed up the sequence
      break;
  }
};

