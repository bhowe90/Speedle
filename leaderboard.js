function saveToLeaderboard(username, time, scores, gameOrder, mode) {
    let leaderboardKey = mode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    leaderboard.push({ 
        username, 
        time, 
        scores, 
        gameOrder, 
        date: new Date().toDateString() // Store today's date
    });

    leaderboard.sort((a, b) => a.time - b.time);
    
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    displayLeaderboard(mode);
}

function displayLeaderboard(mode) {
    let leaderboardKey = mode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    let leaderboardTable = document.getElementById("leaderboard-table");

    if (!leaderboardTable) {
        console.error("⚠️ Leaderboard table not found!");
        return;
    }

    leaderboardTable.innerHTML = "<tr><th>Rank</th><th>Username</th><th>Time</th><th>Game Order</th><th>Scores</th></tr>";

    if (leaderboard.length === 0) {
        leaderboardTable.innerHTML += "<tr><td colspan='5'>No entries yet</td></tr>";
        return;
    }

    leaderboard.forEach((entry, index) => {
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
        let scoreDetails = Object.entries(entry.scores)
            .map(([game, data]) => `${game}: ${data.score}/${games.find(g => g.name === game).maxScore}`)
            .join(" | ");

        leaderboardTable.innerHTML += `<tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${formatTime(entry.time)}</td>
            <td>${entry.gameOrder.map(g => g.name).join(" → ")}</td>
            <td>${scoreDetails}</td>
        </tr>`;
    });
}

function displayLeaderboardOnHome() {
    let leaderboardHome = document.getElementById("leaderboard-home");
    let dailyLeaderboard = JSON.parse(localStorage.getItem("dailyLeaderboard")) || [];
    let unlimitedLeaderboard = JSON.parse(localStorage.getItem("unlimitedLeaderboard")) || [];

    if (!leaderboardHome) {
        console.error("⚠️ Leaderboard home section not found!");
        return;
    }

    leaderboardHome.innerHTML = "<h3>Leaderboards</h3>";

    leaderboardHome.innerHTML += "<h4>Daily Mode</h4>";
    leaderboardHome.innerHTML += formatLeaderboardTable(dailyLeaderboard);

    leaderboardHome.innerHTML += "<h4>Unlimited Mode</h4>";
    leaderboardHome.innerHTML += formatLeaderboardTable(unlimitedLeaderboard);
}

function formatLeaderboardTable(leaderboard) {
    if (leaderboard.length === 0) {
        return "<p>No leaderboard entries yet</p>";
    }

    let html = `<table><tr><th>Rank</th><th>Username</th><th>Time</th></tr>`;
    leaderboard.forEach((entry, index) => {
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
        html += `<tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${formatTime(entry.time)}</td>
        </tr>`;
    });
    return html + "</table>";
}

// Ensure leaderboards update on page load
window.onload = () => {
    displayLeaderboard("daily");
    displayLeaderboard("unlimited");
    displayLeaderboardOnHome();
};


    // Clear previous leaderboard content
    leaderboardTable.innerHTML = "";

    // If no entries, show a placeholder message
    if (leaderboard.length === 0) {
        leaderboardTable.innerHTML = "<p>No entries yet. Play a game to appear on the leaderboard!</p>";
        return;
    }

    // Create the leaderboard table
    let html = `<table>
        <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Time</th>
            <th>Game Order</th>
            <th>Scores</th>
        </tr>`;

    leaderboard.forEach((entry, index) => {
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;

        let scoreDetails = Object.entries(entry.scores)
            .map(([game, data]) => `${game}: ${data.score}/${games.find(g => g.name === game).maxScore}`)
            .join(" | ");

        html += `
        <tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${formatTime(entry.time)}</td>
            <td>${entry.gameOrder.map(g => g.name).join(" → ")}</td>
            <td>${scoreDetails}</td>
        </tr>`;
    });

    html += `</table>`;

    leaderboardTable.innerHTML = html;
}

/** ✅ Prevent Duplicate Usernames in the Same Day ✅ */
function isUsernameUsedToday(username) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let today = new Date().toDateString();

    return leaderboard.some(entry => entry.username === username && entry.date === today);
}

/** ✅ Ensure Leaderboard Resets at 12 PM AEST Daily ✅ */
function checkLeaderboardReset() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let lastReset = localStorage.getItem("lastLeaderboardReset");

    let now = new Date();
    let currentDate = now.toDateString();
    let currentHour = now.getUTCHours(); // Get UTC time

    // Convert 12 PM AEST to UTC (AEST = UTC+10, AEDT = UTC+11)
    let resetHourUTC = now.getMonth() >= 9 && now.getMonth() <= 3 ? 1 : 2; // Handles AEDT adjustments

    if (lastReset !== currentDate && currentHour >= resetHourUTC) {
        console.log("🔄 Resetting leaderboard for a new day...");
        localStorage.setItem("leaderboard", JSON.stringify([]));
        localStorage.setItem("lastLeaderboardReset", currentDate);
    }
}

