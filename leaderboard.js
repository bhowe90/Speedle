function saveToLeaderboard(username, time, scores, gameOrder) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    leaderboard.push({ 
        username, 
        time, 
        scores, 
        gameOrder, 
        date: new Date().toDateString() // Store today's date
    });

    leaderboard.sort((a, b) => a.time - b.time);
    
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard();
    displayLeaderboardOnHome();
}


function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardTable = document.getElementById("leaderboard-table");

    // Ensure the table exists
    if (!leaderboardTable) {
        console.error("Leaderboard table not found!");
        return;
    }

    leaderboardTable.innerHTML = "<tr><th>Rank</th><th>Username</th><th>Time</th><th>Game Order</th><th>Scores</th></tr>";

    if (leaderboard.length === 0) {
        leaderboardTable.innerHTML += "<tr><td colspan='5'>No entries yet</td></tr>";
        return;
    }

    leaderboard.forEach((entry, index) => {
        let row = leaderboardTable.insertRow();
        row.innerHTML = `<td>${index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}</td>
                         <td>${entry.username}</td>
                         <td>${formatTime(entry.time)}</td>
                         <td>${entry.gameOrder.map(g => g.name).join(" → ")}</td>
                         <td>${Object.entries(entry.scores).map(([g, s]) => `${g}: ${s.score}/${games.find(x => x.name === g).maxScore}`).join(" | ")}</td>`;
    });
}


function displayLeaderboardOnHome() {
    let leaderboardHome = document.getElementById("leaderboard-home");
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    if (!leaderboardHome) {
        console.error("Leaderboard home section not found!");
        return;
    }

    if (leaderboard.length === 0) {
        leaderboardHome.innerHTML = "<p>No leaderboard entries yet</p>";
        return;
    }

    let html = "<h3>Leaderboard</h3><table id='leaderboard-table'><tr><th>Rank</th><th>Username</th><th>Time</th></tr>";
    
    leaderboard.forEach((entry, index) => {
        html += `<tr><td>${index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}</td>
                 <td>${entry.username}</td>
                 <td>${formatTime(entry.time)}</td></tr>`;
    });

    html += "</table>";
    leaderboardHome.innerHTML = html;
}

// Ensure leaderboard loads when the page loads
window.onload = () => {
    displayLeaderboard();
    displayLeaderboardOnHome();
};


function isUsernameUsedToday(username) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let today = new Date().toDateString();

    return leaderboard.some(entry => entry.username === username && entry.date === today);
}

