let letters = [];
let letterIndex = 0;
let timeoutId;
let increaseTextSizeID;
//Starting time for scoring purposes
let startTime= Date.now();
//page elements
const typeElement = document.getElementById('blastletter');
const msgElement = document.getElementById('msg');
const titleElement = document.getElementById('title');
const pointsElement = document.getElementById('points');
const modal = document.getElementById('myModal');
const restartButton = document.getElementById('restartbtn');
const startButton = document.getElementById('start');
const endgameMessageElement = document.getElementById('endgamemsg');
const leaderboardElement = document.getElementById('leaderboard');
const leaderboard = document.querySelectorAll('.highscores li');
const topScores = [0, 0, 0, 0, 0]; //Initializes leaderboard as all 0s
var scoresShown = localStorage.length; //Tracker for how many scores have been recorded
var delayBetweenLetters = 10; //TODO: Placeholder for now, max delay between letters if previous letter not typed, maybe add min delay too?
var pointsTotal = 0; //Tracker for points
var fontSize = 5;
const mapScores = new Map();
updateLeaderboard();

//Closes the modal that appears after a quote is completed
restartButton.onclick =function () {
  modal.style.display = "none";
  startButton.style.display = 'inline';
  leaderboardElement.style.display = 'block';
  titleElement.style.display = 'block';
  msgElement.style.display = 'block';
  pointsElement.style.display = 'none';
}

// Updates scoreboard with localstorage values
function updateLeaderboard() {
  // Sets scores to 0 if its null
  if ((localStorage.getItem("First") === null) || localStorage.getItem("First") === 'null') {
    localStorage.setItem("First", 0)
  }
  if ((localStorage.getItem("Second") === null) || localStorage.getItem("Second") === 'null') {
    localStorage.setItem("Second", 0)
  }
  if ((localStorage.getItem("Third") === null) || localStorage.getItem("Third") === 'null') {
    localStorage.setItem("Third", 0)
  }
  if ((localStorage.getItem("Fourth") === null) || localStorage.getItem("Fourth") === 'null') {
    localStorage.setItem("Fourth", 0)
  }
  if ((localStorage.getItem("Fifth") === null) || localStorage.getItem("Fifth") === 'null') {
    localStorage.setItem("Fifth", 0)
  }
  for (let i=1; i <= 5; i++){ // Replaces topScore elements with localstorage
    mapScores.set(1, localStorage.getItem("First"));
    mapScores.set(2, localStorage.getItem("Second"));
    mapScores.set(3, localStorage.getItem("Third"));
    mapScores.set(4, localStorage.getItem("Fourth"));
    mapScores.set(5, localStorage.getItem("Fifth"));
    topScores[i - 1] = mapScores.get(i);
  }
  topScores.forEach((score, j) => {
  leaderboard[j].textContent = score;
  });
}

function compareScore(newScore, scoreCheck) {//Returns true if there is no value in that slot or it is higher than the score in that ranking
  return ((localStorage.getItem(scoreCheck) === null) || (localStorage.getItem(scoreCheck) === 'null') || (newScore > (localStorage.getItem(scoreCheck)))); 
}

function replaceScore(newScore) { //Checks if the new score is higher than the score in the ranking
  if (compareScore(newScore, "First")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", localStorage.getItem("Third"));
      localStorage.setItem("Third", localStorage.getItem("Second"));
      localStorage.setItem("Second", localStorage.getItem("First"));
      localStorage.setItem("First", newScore);
      updateLeaderboard();
  }
  else if (compareScore(newScore, "Second")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", localStorage.getItem("Third"));
      localStorage.setItem("Third", localStorage.getItem("Second"));
      localStorage.setItem("Second", newScore);
      updateLeaderboard();
  }
  else if (compareScore(newScore, "Third")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", localStorage.getItem("Third"));
      localStorage.setItem("Third", newScore);
      updateLeaderboard();
  }
  else if (compareScore(newScore, "Fourth")){
      localStorage.setItem("Fifth", localStorage.getItem("Fourth"));
      localStorage.setItem("Fourth", newScore);
      updateLeaderboard();
  }
  else if (compareScore(newScore, "Fifth")){
      localStorage.setItem("Fifth", newScore);
      updateLeaderboard();
  }
}

function generateLetters(number) { //generates number amount of letters to type randomly
    var result = '';
    var char = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < number; i++) {
        result += char.charAt(Math.floor(Math.random() * char.length));
    }
    return result;
}

  function generateGridArea(){
    var result = '';
    result += (Math.floor(Math.random() * 13) + 2) + ' / ';
    result += (Math.floor(Math.random() * 13) + 2);
    return result;
  }

startButton.addEventListener('click', () => {
    // get a list of letters for typing
    const lettersToType = generateLetters(10); //TODO: Change # of letters based on difficulty(to be added)
    // Put the quote into an array of letters
    letters = lettersToType.split('');
    // reset the word index for tracking
    letterIndex = 0;
    // reset points
    pointsTotal = 0;
  
    // UI updates
    // Convert into string and set as innerHTML on quote display
    typeElement.innerHTML = letters[letterIndex]; //may require multiple elements for multiple letters at a time
    // Clear any prior messages
    pointsElement.style.display = 'block';
    pointsElement.innerText = 0;
    typeElement.style.fontSize = "5px";
    typeElement.style.gridArea = generateGridArea();
    createTimeout(10000); // 10s timeout, change as needed
    // Attach window event listener
    window.addEventListener("keydown", handleKeyDown);
    // Start the timer
    startTime = new Date().getTime();
    increaseTextSize(200);
    startButton.style.display = 'none';
    leaderboardElement.style.display = 'none';
    titleElement.style.display = 'none';
    msgElement.style.display = 'none';
  });
  
  // Function for increasing letter size by 1 every 0.2s
  const increaseTextSize = (interval) => {
    const increaseFontOverTime = () => {
      fontSize += 1;
      typeElement.style.fontSize = fontSize + "px";
    };
    increaseTextSizeID = setInterval(increaseFontOverTime, interval)
  };

  // Function for timeout if correct letter has not been inputed in time.
  const createTimeout = (delay) => {
    const myFunction = () => {
      clearInterval(increaseTextSizeID);
      if (letterIndex === letters.length - 1) {
          const message = `CONGRATULATIONS! You scored ${pointsTotal} points!`;
          endgameMessageElement.innerText = message;
          modal.style.display="block";
          window.removeEventListener('keydown', handleKeyDown);
          replaceScore(pointsTotal);
      }
      else {
        typeElement.style.fontSize = "5px";
        increaseTextSize(200);
        letterIndex++;
        fontSize = 5;
        typeElement.style.gridArea = generateGridArea();
        typeElement.innerHTML = letters[letterIndex];
        startTime = new Date().getTime();
        createTimeout(10000);
      }
    };
    timeoutId = setTimeout(myFunction, delay);
  };

  function Addpoints (elapsedTime) {
    pointsTotal += Math.floor(100 * ((10 - elapsedTime) / 10));
    pointsElement.innerText = pointsTotal;
  }

  function Screenshake(duration, intensity) {
    const body = document.getElementById("spawnZone");
    const startShakeTime = new Date().getTime();
    function shake() {
        const elapsed = Date.now() - startShakeTime;
        if (elapsed > duration) {
          body.style.transform = ''; // Reset position
          window.addEventListener("keydown", handleKeyDown); // Reset player input
          return;
        }

        const offsetX = (Math.random() * intensity * 2 - intensity).toFixed(2);
        const offsetY = (Math.random() * intensity * 2 - intensity).toFixed(2);
        body.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        window.removeEventListener('keydown', handleKeyDown); // Prevent player input
        requestAnimationFrame(shake);
      }

      shake();
  }

  // Read keyboard down input and compare to letter
  function handleKeyDown(event) {
          // Get the current letter
      const currentletter = letters[letterIndex];
      // Get the current value
      const typedValue = event.key;
      // If letter is correct and is the last letter
      if (typedValue === currentletter) {
        clearTimeout(timeoutId);
        clearInterval(increaseTextSizeID);
        const elapsedTime = ((new Date().getTime() - startTime) / 1000);
        Addpoints(elapsedTime);
        startTime = new Date().getTime();
        if (letterIndex === letters.length - 1) {
          const message = `CONGRATULATIONS! You scored ${pointsTotal} points!`;
          typeElement.innerHTML = '';
          endgameMessageElement.innerText = message;
          modal.style.display="block";
          window.removeEventListener('keydown', handleKeyDown);
          replaceScore(pointsTotal);
        } else {
            typeElement.style.fontSize = "5px";
            increaseTextSize(200);
            letterIndex++;
            fontSize = 5;
            typeElement.style.gridArea = generateGridArea();
            typeElement.innerHTML = letters[letterIndex];
            createTimeout(10000);
          //TODO: function to bypass delay and send next letter if multiple letters at a time are implemented
        }
      } else {
        Screenshake(700, 5);
      }
  }
