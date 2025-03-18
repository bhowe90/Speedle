const games = [
    { name: "TimeGuessr", url: "https://timeguessr.com/roundonedaily" },
    { name: "Framed", url: "https://framed.wtf/" },
    { name: "FoodGuessr", url: "https://www.foodguessr.com/game/daily" },
    { name: "Thrice", url: "https://thrice.geekswhodrink.com/" },
    { name: "Bandle", url: "https://bandle.app/" }
];

let currentGame = 0;
let startTime;
let username = "";

document.getElementById("start-btn").addEventListener("click", () => {
    username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter a username!");
        return;
    }

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    startTime = Date.now();
    loadGame();
});

function loadGame() {
    if (currentGame < games.length) {
        document.getElementById("game-title").innerText = `Game ${currentGame + 1}: ${games[currentGame].name}`;
        document.getElementById("game-frame").src = games[currentGame].url;
    } else {
        endSpeedrun();
    }
}

document.getElementById("next-game-btn").addEventListener("click", () => {
    currentGame++;
    loadGame();
});

function endSpeedrun() {
    let totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("leaderboard-screen").classList.remove("hidden");
    document.getElementById("final-time").innerText = `Your total time: ${totalTime} seconds`;

    saveToLeaderboard(username, totalTime);
}

function restartGame() {
    location.reload();
}

setInterval(() => {
    if (startTime) {
        let elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        document.getElementById("timer").innerText = `Time: ${elapsed} sec`;
    }
}, 1000);
