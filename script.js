const games = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundonedaily" },
    { name: "Framed", url: "https://framed.wtf/" },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/daily" },
    { name: "Thrice", url: "https://thrice.geekswhodrink.com/" },
    { name: "Bandle", url: "https://bandle.app/" }
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

        // Open in new tab & track closure
        openTab = window.open(games[currentGame].url, "_blank");
        gameStartTime = performance.now();

        // Check every second if the tab is closed
        let checkTabClosed = setInterval(() => {
            if (openTab.closed) {
                clearInterval(checkTabClosed);
                recordGameScore(0); // Assign 0 if they fail
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
}

function updateTimer() {
    setInterval(() => {
        if (startTime) {
            let elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
            document.getElementById("timer").innerText = `Time: ${elapsed} sec`;
        }
    }, 1);
}

function restartGame() {
    location.reload();
}
