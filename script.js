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
    document.getElementById("username").addEventListener("input", updatePlayButton);
});

function selectMode(mode) {
    gameMode = mode;
    document.getElementById("daily-mode-btn").classList.toggle("selected", mode === "daily");
    document.getElementById("unlimited-mode-btn").classList.toggle("selected", mode === "unlimited");
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
    updateTimer();
    loadGame();
}

function updateTimer() {
    setInterval(() => {
        if (startTime) {
            let elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
            document.getElementById("timer").innerText = formatTime(elapsed);
        }
    }, 1);
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, '0');
    let sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    let ms = (seconds % 1).toFixed(3).substring(2).padStart(3, '0');
    return `${min}m ${sec}s ${ms}ms`;
}

document.getElementById("return-home-btn").addEventListener("click", () => location.reload());
