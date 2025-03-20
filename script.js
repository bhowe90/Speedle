const dailyGames = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundonedaily", maxScore: 10000 },
    { name: "Framed", url: "https://framed.wtf/", maxScore: 6 },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/daily", maxScore: 5000 },
    { name: "Thrice", url: "https://thrice.geekswhodrink.com/", maxScore: 3 },
    { name: "Bandle", url: "https://bandle.app/", maxScore: 6 }
];

const unlimitedGames = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundone?referrer=true", maxScore: 10000 },
    { name: "Framed", url: `https://framed.wtf/archive?day=${Math.floor(Math.random() * 1104) + 1}`, maxScore: 6 },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/random", maxScore: 5000 }
];

let currentGame = 0;
let startTime;
let username = "";
let scores = {};
let gameOrder = [];


let gameMode = ""; // "daily" or "unlimited"

document.addEventListener("DOMContentLoaded", function () {
    const dailyBtn = document.getElementById("daily-mode-btn");
    const unlimitedBtn = document.getElementById("unlimited-mode-btn");
    const playBtn = document.getElementById("play-btn");
    const usernameInput = document.getElementById("username");
    const modeDescription = document.getElementById("mode-description");

    function selectMode(mode) {
        gameMode = mode;
        dailyBtn.classList.remove("selected");
        unlimitedBtn.classList.remove("selected");
        if (mode === "daily") {
            dailyBtn.classList.add("selected");
            modeDescription.innerText = "Daily Mode includes all 5 games and resets daily.";
        } else {
            unlimitedBtn.classList.add("selected");
            modeDescription.innerText = "Unlimited Mode includes only 3 games and never resets.";
        }
        updatePlayButton();
    }

    function updatePlayButton() {
        if (gameMode && usernameInput.value.trim() !== "") {
            playBtn.innerText = `Play Speedle ${gameMode === "daily" ? "Daily" : "Unlimited"}`;
            playBtn.classList.remove("disabled");
            playBtn.disabled = false;
        } else {
            playBtn.innerText = "Play Speedle";
            playBtn.classList.add("disabled");
            playBtn.disabled = true;
        }
    }

    dailyBtn.addEventListener("click", () => selectMode("daily"));
    unlimitedBtn.addEventListener("click", () => selectMode("unlimited"));
    usernameInput.addEventListener("input", updatePlayButton);
    playBtn.addEventListener("click", startGame);
});


function startGame(mode) {
    gameMode = mode;
    username = prompt("Enter your username:");

    if (!username) {
        alert("Please enter a username!");
        return;
    }

    if (gameMode === "daily" && isUsernameUsedToday(username)) {
        alert("This username has already been used today in Daily Mode.");
        return;
    }

    document.getElementById("mode-selection-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    startTime = performance.now();
    gameOrder = mode === "daily" ? [...dailyGames] : [...unlimitedGames];
    gameOrder.sort(() => Math.random() - 0.5);
    currentGame = 0;
    loadGame();
    updateTimer();
}

function loadGame() {
    if (currentGame < gameOrder.length) {
        let currentGameObj = gameOrder[currentGame];
        document.getElementById("game-title").innerText = `Game ${currentGame + 1}: ${currentGameObj.name}`;

        console.log(`🕹️ Launching ${currentGameObj.name} in a new window...`);
        let gameWindow = window.open(currentGameObj.url, "_blank", "width=1200,height=800");

        trackGameWindow(gameWindow, currentGameObj.name);
    } else {
        endSpeedrun();
    }
}

function trackGameWindow(gameWindow, gameName) {
    console.log(`🔍 Tracking ${gameName} window...`);

    const checkWindow = setInterval(() => {
        if (!gameWindow || gameWindow.closed) {
            console.log(`✅ Player closed ${gameName} window!`);

            let confirmCompletion = confirm(`Did you finish playing ${gameName}?`);
            if (confirmCompletion) {
                let score = prompt(`Enter your final score for ${gameName}:`);

                if (score && !isNaN(score)) {
                    console.log(`🏆 Manually Entered Score for ${gameName}: ${score}`);
                    recordGameScore(parseInt(score, 10));
                } else {
                    console.warn(`⚠️ Invalid score entered for ${gameName}. Assigning 0.`);
                    recordGameScore(0);
                }
            } else {
                console.warn(`⚠️ Player did not complete ${gameName}. Assigning 0.`);
                recordGameScore(0);
            }

            clearInterval(checkWindow);
            currentGame++;
            loadGame();
        }
    }, 1000);
}

function recordGameScore(score) {
    let elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    scores[gameOrder[currentGame].name] = { score, time: elapsed };

    console.log(`Game ${gameOrder[currentGame].name} completed! Score: ${score}, Time: ${elapsed}s`);
}

function endSpeedrun() {
    let totalTime = ((performance.now() - startTime) / 1000).toFixed(3);
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("leaderboard-screen").classList.remove("hidden");
    document.getElementById("final-time").innerText = `Your total time: ${formatTime(totalTime)}`;

    saveToLeaderboard(username, totalTime, scores, gameOrder, gameMode);
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, '0');
    let sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    let ms = (seconds % 1).toFixed(3).substring(2).padStart(3, '0');
    return `${min}m ${sec}s ${ms}ms`;
}
