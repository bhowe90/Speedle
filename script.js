/**
 * ✅ Defines the list of games for Daily Mode (fixed selection)
 */
const dailyGames = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundonedaily", maxScore: 10000 },
    { name: "Framed", url: "https://framed.wtf/", maxScore: 6 },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/daily", maxScore: 5000 },
    { name: "Thrice", url: "https://thrice.geekswhodrink.com/", maxScore: 3 },
    { name: "Bandle", url: "https://bandle.app/", maxScore: 6 }
];

/**
 * ✅ Defines the list of games for Unlimited Mode (random selection)
 */
const unlimitedGames = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundone?referrer=true", maxScore: 10000 },
    { name: "Framed", url: `https://framed.wtf/archive?day=${Math.floor(Math.random() * 1104) + 1}`, maxScore: 6 },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/random", maxScore: 5000 }
];

// Game state variables
let gameMode = "";  // Stores selected mode: "daily" or "unlimited"
let username = "";   // Stores the player's username
let scores = {};     // Stores scores for each game
let gameOrder = [];  // Stores randomized order of games
let startTime;       // Stores when the speedrun started
let currentGame = 0; // Tracks current game index

// ✅ Adds event listeners when the page loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 Page loaded. Waiting for user input...");
    
    document.getElementById("daily-mode-btn").addEventListener("click", () => selectMode("daily"));
    document.getElementById("unlimited-mode-btn").addEventListener("click", () => selectMode("unlimited"));
    document.getElementById("play-btn").addEventListener("click", startGame);
    document.getElementById("username").addEventListener("input", updatePlayButton);
});

/**
 * ✅ Sets the selected game mode (Daily or Unlimited)
 */
function selectMode(mode) {
    console.log(`🎯 Mode selected: ${mode}`);
    
    gameMode = mode;
    document.getElementById("daily-mode-btn").classList.toggle("selected", mode === "daily");
    document.getElementById("unlimited-mode-btn").classList.toggle("selected", mode === "unlimited");

    updatePlayButton();
}

/**
 * ✅ Enables the "Play Speedle" button only when mode & username are entered
 */
function updatePlayButton() {
    const playBtn = document.getElementById("play-btn");
    username = document.getElementById("username").value.trim();
    
    if (gameMode && username) {
        playBtn.innerText = `Play Speedle ${gameMode === "daily" ? "Daily" : "Unlimited"}`;
        playBtn.classList.remove("disabled");
        playBtn.disabled = false;
    } else {
        playBtn.classList.add("disabled");
        playBtn.disabled = true;
    }
}

function startGame() {
    console.log("🎮 Starting game...");

    // Check if the player has already played today in Daily Mode
    if (gameMode === "daily") {
        let leaderboardKey = "dailyLeaderboard";
        let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
        let today = new Date().toDateString();

        let existingEntry = leaderboard.find(entry => entry.username === username && entry.date === today);

        if (existingEntry) {
            // ✅ Player has already completed today's Speedle!
            let rank = leaderboard.findIndex(entry => entry.username === username) + 1;
            let timeUntilReset = getTimeUntilMidnight();

            alert(`🚫 You have already completed your daily Speedle today!\n🏆 You are currently #${rank} on the leaderboard!\n⏳ Check back in ${timeUntilReset} to play again, or try Unlimited Mode!`);

            return; // Stop game from starting
        }
    }

    // ✅ Proceed with starting the game if no duplicate entry
    document.getElementById("mode-selection-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    startTime = performance.now();
    updateTimer();

    gameOrder = gameMode === "daily" ? [...dailyGames] : [...unlimitedGames];
    gameOrder.sort(() => Math.random() - 0.5);

    currentGame = 0;
    loadGame();
}

/**
 * ⏳ Calculates time remaining until the leaderboard resets at midnight.
 * @returns {string} Time remaining in HH:MM format
 */
function getTimeUntilMidnight() {
    let now = new Date();
    let midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set time to 00:00 of next day

    let diff = midnight - now; // Time difference in milliseconds
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}

/**
 * ✅ Loads the next game in the queue
 */
function loadGame() {
    if (currentGame < gameOrder.length) {
        let game = gameOrder[currentGame];
        document.getElementById("game-title").innerText = `Game ${currentGame + 1}: ${game.name}`;

        console.log(`🕹️ Opening ${game.name}`);
        let gameWindow = window.open(game.url, "_blank", "width=1200,height=800");

        trackGameWindow(gameWindow, game.name);
    } else {
        endSpeedrun(); // ✅ Properly triggers the end screen
    }
}

/**
 * ✅ Tracks when the game window is closed and enables score entry
 */
function trackGameWindow(gameWindow, gameName) {
    console.log(`🔍 Tracking ${gameName} window...`);

    const checkWindow = setInterval(() => {
        if (!gameWindow || gameWindow.closed) {
            console.log(`✅ Player closed ${gameName} window!`);
            clearInterval(checkWindow);

            // ✅ Show score entry UI
            document.getElementById("score-entry-container").classList.remove("hidden");
            document.getElementById("current-game-name").innerText = gameName;
            document.getElementById("score-input").value = "";
            document.getElementById("submit-score-btn").disabled = true;

            // ✅ Enable button only when a valid score is entered
            document.getElementById("score-input").addEventListener("input", function () {
                document.getElementById("submit-score-btn").disabled = this.value.trim() === "" || isNaN(this.value) || parseInt(this.value) < 0;
            });

            // ✅ Handle score submission
            document.getElementById("submit-score-btn").onclick = function () {
                let score = parseInt(document.getElementById("score-input").value, 10);
                
                if (!isNaN(score) && score >= 0) {
                    console.log(`🏆 Score recorded for ${gameName}: ${score}`);
                    scores[gameName] = { score: score };
                    
                    // ✅ Hide score entry UI and proceed to next game
                    document.getElementById("score-entry-container").classList.add("hidden");
                    currentGame++;

                    if (currentGame >= gameOrder.length) {
                        endSpeedrun();
                    } else {
                        loadGame();
                    }
                }
            };
        }
    }, 1000);
}


/**
 * ✅ Updates the LiveSplit-style speedrun timer
 */
function updateTimer() {
    setInterval(() => {
        if (startTime) {
            let elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
            document.getElementById("timer").innerText = formatTime(elapsed);
        }
    }, 1);
}

/**
 * ✅ Formats time into MM:SS:MS
 */
function formatTime(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, '0');
    let sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    let ms = (seconds % 1).toFixed(3).substring(2).padStart(3, '0');
    return `${min}m ${sec}s ${ms}ms`;
}

/**
 * ✅ Ends the speedrun and displays final results
 */
function endSpeedrun() {
    console.log("🏁 Speedrun complete!");

    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("leaderboard-screen").classList.remove("hidden");

    let totalTime = ((performance.now() - startTime) / 1000).toFixed(3);
    document.getElementById("final-time").innerText = `Your total time: ${formatTime(totalTime)}`;

    saveToLeaderboard(username, totalTime, scores, gameOrder, gameMode);
}

// ✅ Resets the game when "Return to Home" is clicked
document.getElementById("return-home-btn").addEventListener("click", () => {
    console.log("🏠 Returning to home screen...");
    location.reload();
});
