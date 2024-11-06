// Initial References
const countValue = document.getElementById("count");
const colorPart = document.querySelectorAll(".color-part");
const container = document.querySelector(".container");
const startButton = document.querySelector("#start");
const result = document.querySelector("#result");
const wrapper = document.querySelector(".wrapper");
const restart = document.querySelector("#restart");
const Pause = document.querySelector("#Pause");
const difficultySelect = document.getElementById("difficulty"); // Difficulty selector
const leaderboard = document.getElementById("leaderboard"); // Leaderboard container

// Mapping Colors
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
let isPaused = false; // Track paused state
let difficulty = "medium"; // Default difficulty
let speedFactor = 1; // Time delay multiplier


// Initialize leaderboard with localStorage data
function initializeLeaderboard() {
  const easyScore = localStorage.getItem("easyScore") || 0;
  const mediumScore = localStorage.getItem("mediumScore") || 0;
  const hardScore = localStorage.getItem("hardScore") || 0;
  document.getElementById("easy-score").innerText = easyScore;
  document.getElementById("medium-score").innerText = mediumScore;
  document.getElementById("hard-score").innerText = hardScore;
}

// Function to start the game
startButton.addEventListener("click", () => {
  difficulty = difficultySelect.value; // Get selected difficulty
  setDifficulty();
  count = 0;
  clickCount = 0;
  randomColors = [];
  pathGeneratorBool = false;
  isPaused = false; // Reset pause state
  wrapper.classList.remove("hide");
  container.classList.add("hide");
  result.classList.remove("hide");
  restart.classList.remove("hide");
  Pause.classList.remove("hide");
  leaderboard.classList.add("hide");
  pathGenerate();
});

// Function to decide the sequence
const pathGenerate = () => {
  randomColors.push(generateRandomValue(colors));
  count = randomColors.length;
  pathGeneratorBool = true;
  pathDecide(count);
};

// Function to get a random color
const generateRandomValue = (obj) => {
  let arr = Object.keys(obj);
  return arr[Math.floor(Math.random() * arr.length)];
};

// Function to play the sequence
const pathDecide = async (count) => {
  countValue.innerText = count;

  for (let i of randomColors) {
    if (isPaused) {
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
    await delay(500 / speedFactor);
    currentColor.style.backgroundColor = `${colors[i]["new"]}`;
    await delay(600 / speedFactor);
    currentColor.style.backgroundColor = `${colors[i]["current"]}`;
    await delay(600 / speedFactor);
  }
  pathGeneratorBool = false;
};

// Delay function for color effects
async function delay(time) {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Handle user clicks on colors
colorPart.forEach((element) => {
  element.addEventListener("click", async (e) => {
    if (pathGeneratorBool || isPaused) {
      return false;
    }

    if (e.target.classList[0] == randomColors[clickCount]) {
      e.target.style.backgroundColor = `${colors[randomColors[clickCount]]["new"]}`;
      await delay(500 / speedFactor);

      e.target.style.backgroundColor = `${colors[randomColors[clickCount]]["current"]}`;

      clickCount += 1;

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

// Pause/Resume functionality
Pause.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    Pause.innerText = "Pause";
    pathDecide(count); // Resume game
  } else {
    isPaused = true;
    pathGeneratorBool = false; // Stop sequence generation
    Pause.innerText = "Resume";
  }
});

// End the game and update the leaderboard
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
  leaderboard.classList.remove("hide");

  // Update leaderboard for the current difficulty
  const currentBestScore = localStorage.getItem(difficulty + "Score") || 0;
  if (score > currentBestScore) {
    localStorage.setItem(difficulty + "Score", score);
    document.getElementById(difficulty + "-score").innerText = score;
  }
};

// Set difficulty
const setDifficulty = () => {
  switch (difficulty) {
    case "easy":
      speedFactor = 0.5;

      break;
    case "medium":
      speedFactor = 1;
   
      break;
    case "hard":
      speedFactor = 3;
   
      break;
  }
  initializeLeaderboard(); // Display updated leaderboard
};

// Initialize leaderboard
initializeLeaderboard();
