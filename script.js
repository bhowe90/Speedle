const games = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundonedaily", maxScore: 10000 },
    { name: "Framed", url: "https://framed.wtf/", maxScore: 6 },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/daily", maxScore: 5000 },
    { name: "Thrice", url: "https://thrice.geekswhodrink.com/", maxScore: 3 },
    { name: "Bandle", url: "https://bandle.app/", maxScore: 6 }
];

let currentGame = 0;
let startTime;
let username = "";
let scores = {};
let gameOrder = [];

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-btn");

    if (!startButton) {
        console.error("Error: 'Play Speedle' button not found!");
        return;
    }

    startButton.addEventListener("click", function () {
        username = document.getElementById("username").value.trim();

        if (!username) {
            alert("Please enter a username!");
            return;
        }

        if (typeof isUsernameUsedToday !== "function") {
            console.error("Error: isUsernameUsedToday function is missing.");
            return;
        }

        if (isUsernameUsedToday(username)) {
            alert("This username has already been used today. Please enter a new one.");
            return;
        }

        console.log("Starting game for:", username);

        document.getElementById("start-screen").classList.add("hidden");
        document.getElementById("game-screen").classList.remove("hidden");

        startTime = performance.now();
        gameOrder = [...games].sort(() => Math.random() - 0.5); // Random order
        currentGame = 0;
        loadGame();
        updateTimer();
    });
});

/** ✅ Load Game in a New Window ✅ */
function loadGame() {
    if (currentGame < gameOrder.length) {
        let currentGameObj = gameOrder[currentGame];
        document.getElementById("game-title").innerText = `Game ${currentGame + 1}: ${currentGameObj.name}`;

        console.log(`🕹️ Launching ${currentGameObj.name} in a new window...`);

        // Open game in a **new window** instead of a tab
        let gameWindow = window.open(currentGameObj.url, "_blank", "width=1200,height=800");

        // Track game completion
        trackGameWindow(gameWindow, currentGameObj.name);
    } else {
        endSpeedrun();
    }
}

/** ✅ Track When the Player Finishes a Game ✅ */
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

/** 🏆 Function to Record Game Scores 🏆 */
function recordGameScore(score) {
    let elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    scores[gameOrder[currentGame].name] = { score, time: elapsed };

    console.log(`Game ${gameOrder[currentGame].name} completed! Score: ${score}, Time: ${elapsed}s`);
}

/** 🏁 End the Speedrun & Save Scores 🏁 */
function endSpeedrun() {
    let totalTime = ((performance.now() - startTime) / 1000).toFixed(3);
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("leaderboard-screen").classList.remove("hidden");
    document.getElementById("final-time").innerText = `Your total time: ${formatTime(totalTime)}`;

    saveToLeaderboard(username, totalTime, scores, gameOrder);
}

/** ⏱ Speedrun Timer ⏱ */
function updateTimer() {
    setInterval(() => {
        if (startTime) {
            let elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
            document.getElementById("timer").innerText = formatTime(elapsed);
        }
    }, 1);
}

/** ⏱ Format Time as MM:SS:MS ⏱ */
function formatTime(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, '0');
    let sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    let ms = (seconds % 1).toFixed(3).substring(2).padStart(3, '0');
    return `${min}m ${sec}s ${ms}ms`;
}

/** 🔄 Restart Game (Return to Home) 🔄 */
document.getElementById("return-home-btn").addEventListener("click", () => {
    location.reload();
});
