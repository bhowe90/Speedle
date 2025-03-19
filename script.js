const games = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundonedaily", maxScore: 10000 },
    { name: "Framed", url: "https://framed.wtf/", maxScore: 6 },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/daily", maxScore: 5000 },
    { name: "Thrice", url: "https://thrice.geekswhodrink.com/", maxScore: 3 },
    { name: "Bandle", url: "https://bandle.app/", maxScore: 6 }
];

let currentGame = 0;
let startTime, gameStartTime;
let username = "";
let scores = {};
let gameOrder = [];
let openTab = null;

document.getElementById("start-btn").addEventListener("click", () => {
    username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter a username!");
        return;
    }

    if (isUsernameUsedToday(username)) {
        alert("This username has already been used today. Please enter a new one.");
        return;
    }

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    startTime = performance.now();
    gameOrder = [...games].sort(() => Math.random() - 0.5); // Randomize order
    loadGame();
    updateTimer();
});

function loadGame() {
    if (currentGame < gameOrder.length) {
        document.getElementById("game-title").innerText = `Game ${currentGame + 1}: ${gameOrder[currentGame].name}`;
        openTab = window.open(gameOrder[currentGame].url, "_blank");
        gameStartTime = performance.now();

        let checkTabClosed = setInterval(() => {
            if (openTab.closed) {
                clearInterval(checkTabClosed);
                recordGameScore(0);
                currentGame++;
                loadGame();
            }
        }, 1000);
    } else {
        endSpeedrun();
    }
}

function recordGameScore(score) {
    let elapsed = ((performance.now() - gameStartTime) / 1000).toFixed(2);
    scores[gameOrder[currentGame].name] = { score, time: elapsed };
}

function endSpeedrun() {
    let totalTime = ((performance.now() - startTime) / 1000).toFixed(3);
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("leaderboard-screen").classList.remove("hidden");
    document.getElementById("final-time").innerText = `Your total time: ${totalTime}`;

    saveToLeaderboard(username, totalTime, scores, gameOrder);
    startResetCountdown();
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
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    let ms = (seconds % 1).toFixed(3).substring(2);
    return `${min}:${sec}:${ms}`;
}

document.getElementById("return-home-btn").addEventListener("click", () => {
    location.reload();
});


