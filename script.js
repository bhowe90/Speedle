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
    loadGame();
    updateTimer();
});

function loadGame() {
    if (currentGame < games.length) {
        document.getElementById("game-title").innerText = `Game ${currentGame + 1}: ${games[currentGame].name}`;
        openTab = window.open(games[currentGame].url, "_blank");
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
    scores[games[currentGame].name] = { score, time: elapsed };
}

function endSpeedrun() {
    let totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("leaderboard-screen").classList.remove("hidden");
    document.getElementById("final-time").innerText = `Your total time: ${totalTime} seconds`;

    saveToLeaderboard(username, totalTime, scores);
    startResetCountdown();
}

function updateTimer() {
    setInterval(() => {
        if (startTime) {
            let elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
            document.getElementById("timer").innerText = elapsed;
        }
    }, 1);
}

function startResetCountdown() {
    let now = new Date();
    let resetTime = new Date();
    resetTime.setHours(24, 0, 0, 0);

    let countdown = setInterval(() => {
        let timeLeft = Math.max(0, resetTime - new Date());
        let hours = Math.floor(timeLeft / (1000 * 60 * 60));
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("reset-timer").innerText = `Check back in ${hours}h ${minutes}m!`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            localStorage.removeItem("leaderboard");
        }
    }, 1000);
}
