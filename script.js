// Initial References
document.addEventListener("DOMContentLoaded", () => {

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
const theme=document.getElementById("theme"); // Theme selector
const div1=document.getElementsByClassName("color1");
const div2=document.getElementsByClassName("color2");
const div3=document.getElementsByClassName("color3");
const div4=document.getElementsByClassName("color4");
const name=document.getElementById("name");


// Mapping Colors
const RGB = {
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

const Neon = {
  color1: { current: "#39ff14", new: "#00ff22" }, // Brighter Green
  color2: { current: "#ff073a", new: "#ff3355" }, // Brighter Red
  color3: { current: "#7a00ff", new: "#a52cff" }, // Brighter Purple
  color4: { current: "#fffb00", new: "#ffff33" }  // Brighter Yellow
};



const Ocean = {
  color1: { current: "#1b3a5f", new: "#234d70" }, // Brighter Deep Blue
  color2: { current: "#017374", new: "#029f9c" }, // Brighter Teal
  color3: { current: "#4c9dbd", new: "#67b1d9" }, // Brighter Light Ocean Blue
  color4: { current: "#80d6ff", new: "#b3e7ff" }  // Brighter Sky Blue
};

const Earthy = {
  color1: { current: "#795548", new: "#9c7b65" }, // Slightly Brighter Earth Brown
  color2: { current: "#8d6e63", new: "#b28a80" }, // Brighter Clay
  color3: { current: "#5d4037", new: "#6f514a" }, // Brighter Soil Brown
  color4: { current: "#a1887f", new: "#c9b2a7" }  // Brighter Taupe
};




let randomColors = [];
let pathGeneratorBool = false;
let count, clickCount = 0;
let score = 0;
let isPaused = false; // Track paused state
let difficulty = "Player"; // Default difficulty
let speedFactor = 1; // Time delay multiplier
let themeValue="RGB"

// Initialize leaderboard with localStorage data
function initializeLeaderboard() {
  const easyScore = localStorage.getItem("easyScore") || 0;
  const mediumScore = localStorage.getItem("mediumScore") || 0;
  const hardScore = localStorage.getItem("hardScore") || 0;
  document.getElementById("Noob-score").innerText = easyScore;
  document.getElementById("Player-score").innerText = mediumScore;
  document.getElementById("Master-score").innerText = hardScore;
}

// Function to start the game
startButton.addEventListener("click", () => {
  difficulty = difficultySelect.value; // Get selected difficulty
  setDifficulty();
  count = 0;
  
  // Map the theme string to the actual theme object
  switch (theme.value) {
    case "RGB":
      themeValue = RGB;
      break;
    case "Neon":
      themeValue = Neon;
      break;
    case "Ocean":
      themeValue = Ocean;
      break;
    case "Earthy":
      themeValue = Earthy;
      break;
    default:
      themeValue = RGB; // Default to RGB if no match
  }
  
  console.log(themeValue); // Check that themeValue is now an object
  console.log(div1)
// Apply background color to each element in the HTMLCollections
Array.from(div1).forEach(element => element.style.backgroundColor = themeValue.color1.current);
Array.from(div2).forEach(element => element.style.backgroundColor = themeValue.color2.current);
Array.from(div3).forEach(element => element.style.backgroundColor = themeValue.color3.current);
Array.from(div4).forEach(element => element.style.backgroundColor = themeValue.color4.current);
  clickCount = 0;
  randomColors = [];
  pathGeneratorBool = false;
  isPaused = false; // Reset pause state
  wrapper.classList.remove("hide");
  container.classList.add("hide");
  result.classList.remove("hide");
  name.classList.add("hide");
  restart.classList.remove("hide");
  Pause.classList.remove("hide");
  leaderboard.classList.add("hide");
  pathGenerate();
});

// Function to decide the sequence
const pathGenerate = () => {
  randomColors.push(generateRandomValue(themeValue));
  console.log(randomColors)
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
    playSound(i);
    console.log(currentColor);
    await delay(500 / speedFactor);
    currentColor.style.backgroundColor = `${themeValue[i]["new"]}`; 
    await delay(600 / speedFactor);
    currentColor.style.backgroundColor = `${themeValue[i]["current"]}`; 

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
    const clickedColor = e.target.classList[0];
    playSound(clickedColor);

    if (e.target.classList[0] == randomColors[clickCount]) {
      // Correct access of the color for the clicked element
      e.target.style.backgroundColor = `${
        themeValue[randomColors[clickCount]]["new"]
      }`;
      await delay(500 / speedFactor);

      e.target.style.backgroundColor = `${ themeValue[randomColors[clickCount]]["current"]}`;

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
    case "Noob":
      speedFactor = 0.5;

      break;
    case "Player":
      speedFactor = 1;
   
      break;
    case "Master":
      speedFactor = 3;
   
      break;
  }
  initializeLeaderboard(); // Display updated leaderboard
};

// Initialize leaderboard
initializeLeaderboard();

// Importing Sounds

  // Sounds
  const colorSounds = {
    color1: new Audio("sounds/color1.mp3"),
    color2: new Audio("sounds/color2.mp3"),
    color3: new Audio("sounds/color3.mp3"),
    color4: new Audio("sounds/color4.mp3"),
  };

  function playSound(color) {
    if (colorSounds[color]) {
      colorSounds[color].currentTime = 0;
      colorSounds[color].play();
    }
  }
});
