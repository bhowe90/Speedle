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

/** ✅ Prevent Duplicate Usernames in Daily Mode ✅ */
function isUsernameUsedToday(username) {
    let leaderboard = JSON.parse(localStorage.getItem("dailyLeaderboard")) || [];
    let today = new Date().toDateString();

    return leaderboard.some(entry => entry.username === username && entry.date === today);
}

/** ✅ Ensure Leaderboard Resets at 12 PM AEST Daily ✅ */
function checkLeaderboardReset() {
    let lastReset = localStorage.getItem("lastLeaderboardReset");
    let now = new Date();
    let currentDate = now.toDateString();
    let currentHour = now.getUTCHours(); // Get UTC time

    // Convert 12 PM AEST to UTC (AEST = UTC+10, AEDT = UTC+11)
    let resetHourUTC = now.getMonth() >= 9 && now.getMonth() <= 3 ? 1 : 2; // Handles AEDT adjustments

    if (lastReset !== currentDate && currentHour >= resetHourUTC) {
        console.log("🔄 Resetting Daily Leaderboard...");
        localStorage.setItem("dailyLeaderboard", JSON.stringify([]));
        localStorage.setItem("lastLeaderboardReset", currentDate);
    }
}

/** ✅ Display Leaderboard on End Screen ✅ */
function displayLeaderboard(mode) {
    let leaderboardKey = mode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    let leaderboardTable = document.getElementById("leaderboard-table");

    if (!leaderboardTable) {
        console.error(`⚠️ Leaderboard table not found for mode: ${mode}`);
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

/** ✅ Display Leaderboards on Home Screen ✅ */
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

/** ✅ Format Leaderboard Data into a Table ✅ */
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

/** ✅ Format Time as MM:SS:MS ✅ */
function formatTime(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, '0');
    let sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    let ms = (seconds % 1).toFixed(3).substring(2).padStart(3, '0');
    return `${min}m ${sec}s ${ms}ms`;
}

// ✅ Ensure leaderboards update on page load
window.onload = () => {
    checkLeaderboardReset();
    displayLeaderboard("daily");
    displayLeaderboard("unlimited");
    displayLeaderboardOnHome();
};
