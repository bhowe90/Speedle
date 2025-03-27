function saveToLeaderboard(username, completionTime, scores, gameOrder, gameMode) {
    console.log("💾 Saving to leaderboard...");

    let leaderboardKey = gameMode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

    // ✅ Calculate total score
    let totalScore = gameOrder.reduce((sum, game) => sum + (scores[game.name] || 0), 0);

    // ✅ Prevent duplicate daily entries
    let today = new Date().toDateString();
    let existingPlayerIndex = leaderboard.findIndex(entry => entry.username === username && entry.date === today);

    if (existingPlayerIndex !== -1 && gameMode === "daily") {
        console.warn(`⚠️ ${username} has already played daily mode today!`);
        return; // 🚫 Don't allow replays
    }

    // ✅ Save the new entry
    leaderboard.push({ username, totalScore, completionTime, scores, gameOrder, date: today });

    // ✅ Sort by total score (highest is best)
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    // ✅ Refresh the leaderboard display
    updateLeaderboardDisplay(leaderboardKey);

    console.log(`✅ Leaderboard updated for ${gameMode}. Total entries: ${leaderboard.length}`);
}

/**
 * ✅ Prevents duplicate daily entries
 */
function isUsernameUsedToday(username) {
    let leaderboard = JSON.parse(localStorage.getItem("dailyLeaderboard")) || [];
    let today = new Date().toDateString();
    return leaderboard.some(entry => entry.username === username && entry.date === today);
}

/**
 * ✅ Resets the Daily leaderboard at 12 PM AEST (UTC+10 / UTC+11 in AEDT)
 */
function checkLeaderboardReset() {
    let lastReset = localStorage.getItem("lastLeaderboardReset");
    let now = new Date();
    let currentDate = now.toDateString();
    let currentHour = now.getUTCHours();

    let resetHourUTC = (now.getMonth() >= 9 && now.getMonth() <= 3) ? 1 : 2; // 1 AM UTC (AEDT), 2 AM UTC (AEST)

    if (lastReset !== currentDate && currentHour >= resetHourUTC) {
        console.log("🔄 Resetting Daily Leaderboard...");
        localStorage.setItem("dailyLeaderboard", JSON.stringify([]));
        localStorage.setItem("lastLeaderboardReset", currentDate);
    }
}

/**
 * ✅ Displays the leaderboard on the END SCREEN
 */
function displayLeaderboard(mode) {
    console.log(`📊 Displaying ${mode} leaderboard...`);

    let leaderboardKey = mode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    let leaderboardTable = document.getElementById("leaderboard-table");

    if (!leaderboardTable) {
        console.error(`⚠️ ERROR: Leaderboard table not found!`);
        return;
    }

    leaderboardTable.innerHTML = "<tr><th>Rank</th><th>Username</th><th>Score</th><th>Time</th></tr>";

    if (leaderboard.length === 0) {
        leaderboardTable.innerHTML += "<tr><td colspan='4'>No entries yet</td></tr>";
        return;
    }

    leaderboard.forEach((entry, index) => {
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
        leaderboardTable.innerHTML += `<tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${entry.totalScore}</td>
            <td>${formatTime(entry.completionTime)}</td>
        </tr>`;
    });
}

/**
 * ✅ Displays the leaderboards on the HOME SCREEN
 */
function displayLeaderboardOnHome() {
    console.log("🏠 Displaying leaderboards on home screen...");

    let leaderboardHome = document.getElementById("leaderboard-home");
    let dailyLeaderboard = JSON.parse(localStorage.getItem("dailyLeaderboard")) || [];
    let unlimitedLeaderboard = JSON.parse(localStorage.getItem("unlimitedLeaderboard")) || [];

    if (!leaderboardHome) {
        console.error("⚠️ ERROR: Leaderboard home section not found!");
        return;
    }

    leaderboardHome.innerHTML = `
        <h3>Leaderboards</h3>
        <h4>Daily Mode</h4>
        ${formatLeaderboardTable(dailyLeaderboard)}
        <h4>Unlimited Mode</h4>
        ${formatLeaderboardTable(unlimitedLeaderboard)}
    `;
}

/**
 * ✅ Formats the leaderboard as an HTML table
 */
function formatLeaderboardTable(leaderboard) {
    if (leaderboard.length === 0) {
        return "<p>No leaderboard entries yet</p>";
    }

    let html = `<table><tr><th>Rank</th><th>Username</th><th>Score</th><th>Time</th></tr>`;
    leaderboard.forEach((entry, index) => {
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
        html += `<tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${entry.totalScore}</td>
            <td>${formatTime(entry.completionTime)}</td>
        </tr>`;
    });
    return html + "</table>";
}

/**
 * ✅ Formats time as MM:SS:MS for leaderboard display
 */
function formatTime(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, '0');
    let sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    let ms = (seconds % 1).toFixed(3).substring(2).padStart(3, '0');
    return `${min}m ${sec}s ${ms}ms`;
}

// ✅ Ensure leaderboards update on page load
window.onload = () => {
    console.log("🔄 Loading leaderboard data...");
    checkLeaderboardReset();
    displayLeaderboard("daily");
    displayLeaderboard("unlimited");
    displayLeaderboardOnHome();
};
