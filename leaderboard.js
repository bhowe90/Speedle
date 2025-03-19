function saveToLeaderboard(username, time, scores, gameOrder) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    leaderboard.push({ username, time, scores, gameOrder, date: new Date().toDateString() });
    leaderboard.sort((a, b) => a.time - b.time);
    
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard();
}


function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardTable = document.getElementById("leaderboard-table");
    leaderboardTable.innerHTML = "<tr><th>Rank</th><th>Username</th><th>Time</th><th>Game Order</th><th>Scores</th></tr>";

    leaderboard.forEach((entry, index) => {
        let row = leaderboardTable.insertRow();
        row.innerHTML = `<td>${index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}</td>
                         <td>${entry.username}</td>
                         <td>${formatTime(entry.time)}</td>
                         <td>${entry.gameOrder.map(g => g.name).join(" → ")}</td>
                         <td>${Object.entries(entry.scores).map(([g, s]) => `${g}: ${s.score}/${games.find(x => x.name === g).maxScore}`).join(" | ")}</td>`;
    });
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    let ms = (seconds % 1).toFixed(3).substring(2);
    return `${min}:${sec}:${ms}`;
}

function isUsernameUsedToday(username) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let today = new Date().toDateString();

    return leaderboard.some(entry => entry.username === username && entry.date === today);
}

