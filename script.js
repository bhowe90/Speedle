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

let gameMode = "";
let username = "";
let scores = {};
let gameOrder = [];
let startTime;
let currentGame = 0;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("daily-mode-btn").addEventListener("click", () => selectMode("daily"));
    document.getElementById("unlimited-mode-btn").addEventListener("click", () => selectMode("unlimited"));
    document.getElementById("play-btn").addEventListener("click", startGame);
});

function selectMode(mode) {
    gameMode = mode;
    document.getElementById("daily-mode-btn").classList.toggle("selected", mode === "daily");
    document.getElementById("unlimited-mode-btn").classList.toggle("selected", mode === "unlimited");
    document.getElementById("mode-description").innerText = mode === "daily" 
        ? "Daily Mode includes all 5 games and resets daily." 
        : "Unlimited Mode includes only 3 games and never resets.";
    updatePlayButton();
}

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
    document.getElementById("mode-selection-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    startTime = performance.now();
    gameOrder = gameMode === "daily" ? [...dailyGames] : [...unlimitedGames];
    gameOrder.sort(() => Math.random() - 0.5);
    currentGame = 0;
    loadGame();
    updateTimer();
}

function loadGame() {
    if (currentGame < gameOrder.length) {
        let game = gameOrder[currentGame];
        window.open(game.url, "_blank", "width=1200,height=800");
        currentGame++;
        setTimeout(loadGame, 5000);
    } else {
        endSpeedrun();
    }
}

function endSpeedrun() {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("leaderboard-screen").classList.remove("hidden");
    document.getElementById("return-home-btn").addEventListener("click", () => location.reload());
}
