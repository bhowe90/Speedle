/**
 * ✅ Saves the player's result to the appropriate leaderboard (Daily or Unlimited)
 * ✅ Sorts leaderboard by time (fastest first)
 * ✅ Updates the leaderboard display after saving
 */
function saveToLeaderboard(username, time, scores, gameOrder, mode) {
    console.log(`📝 Saving ${username}'s result to the ${mode} leaderboard...`);

    let leaderboardKey = mode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

    leaderboard.push({ 
        username, 
        time, 
        scores, 
        gameOrder, 
        date: new Date().toDateString() // Store today's date for daily resets
    });

    // ✅ Sort leaderboard by fastest time (ascending order)
    leaderboard.sort((a, b) => a.time - b.time);
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    console.log(`✅ Leaderboard updated for ${mode}. Total entries: ${leaderboard.length}`);
    
    displayLeaderboard(mode);
}

/**
 * ✅ Checks if a username has already played Daily Mode today
 * ✅ Prevents duplicate entries in the same daily session
 */
function isUsernameUsedToday(username) {
    let leaderboard = JSON.parse(localStorage.getItem("dailyLeaderboard")) || [];
    let today = new Date().toDateString();

    let used = leaderboard.some(entry => entry.username === username && entry.date === today);
    console.log(`🔍 Checking if username "${username}" has been used today: ${used ? "❌ YES (Duplicate)" : "✅ NO (Unique)"} `);
    return used;
}

/**
 * ✅ Resets the Daily leaderboard at 12 PM AEST (UTC+10 or UTC+11 in AEDT)
 * ✅ Prevents incorrect leaderboard carryover across multiple days
 */
function checkLeaderboardReset() {
    let lastReset = localStorage.getItem("lastLeaderboardReset");
    let now = new Date();
    let currentDate = now.toDateString();
    let currentHour = now.getUTCHours(); // Get UTC time

    // Convert 12 PM AEST to UTC (AEST = UTC+10, AEDT = UTC+11)
    let resetHourUTC = now.getMonth() >= 9 && now.getMonth() <= 3 ? 1 : 2; // Handles AEDT adjustments

    console.log(`⏳ Checking leaderboard reset... Current UTC Time: ${currentHour}, Reset Hour UTC: ${resetHourUTC}`);

    if (lastReset !== currentDate && currentHour >= resetHourUTC) {
        console.log("🔄 Resetting Daily Leaderboard...");
        localStorage.setItem("dailyLeaderboard", JSON.stringify([]));
        localStorage.setItem("lastLeaderboardReset", currentDate);
    } else {
        console.log("✅ No reset needed. Leaderboard is up to date.");
    }
}

/**
 * ✅ Displays the leaderboard on the END SCREEN
 * ✅ Fixes the issue where scores were appearing as "undefined"
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

    leaderboardTable.innerHTML = "<tr><th>Rank</th><th>Username</th><th>Time</th><th>Game Order</th><th>Scores</th></tr>";

    if (leaderboard.length === 0) {
        console.log("ℹ️ No leaderboard entries yet.");
        leaderboardTable.innerHTML += "<tr><td colspan='5'>No entries yet</td></tr>";
        return;
    }

    leaderboard.forEach((entry, index) => {
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;

        // ✅ Fix how scores are displayed
        let scoreDetails = Object.entries(entry.scores)
            .map(([game, data]) => `${game}: ${data && data.score !== undefined ? data.score : 0}`) // ✅ Prevent "undefined" values
            .join(" | ");

        leaderboardTable.innerHTML += `<tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${formatTime(entry.time)}</td>
            <td>${entry.gameOrder.map(g => g.name).join(" → ")}</td>
            <td>${scoreDetails}</td>
        </tr>`;

        console.log(`🏆 ${rank} - ${entry.username}: ${entry.time}s, Scores: ${scoreDetails}`);
    });
}

/**
 * ✅ Displays the leaderboards on the HOME SCREEN
 * ✅ Ensures proper formatting and centering
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
