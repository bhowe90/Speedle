function saveToLeaderboard(username, completionTime, scores, gameOrder, gameMode) {
    console.log("💾 Saving to leaderboard...");

    let leaderboardKey = gameMode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";

    // Retrieve leaderboard from local storage or initialize empty array
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

    // Calculate total score
    let totalScore = gameOrder.reduce((sum, game) => sum + (scores[game.name] || 0), 0);

    // Check if the player already exists in the leaderboard (daily mode only)
    let existingPlayerIndex = leaderboard.findIndex(entry => entry.username === username);

    if (existingPlayerIndex !== -1 && gameMode === "daily") {
        // 🛑 Prevent duplicate entries in daily leaderboard!
        let existingPlayer = leaderboard[existingPlayerIndex];

        if (totalScore > existingPlayer.totalScore) {
            console.log(`🔄 Updating ${username}'s score. New: ${totalScore}, Old: ${existingPlayer.totalScore}`);
            leaderboard[existingPlayerIndex] = { username, totalScore, completionTime };
        } else {
            console.warn(`⚠️ ${username} already exists with a better or equal score. No update.`);
        }
    } else {
        // Add new entry to the leaderboard
        leaderboard.push({ username, totalScore, completionTime });
        console.log(`✅ Added ${username} to the leaderboard.`);
    }

    // Save updated leaderboard to local storage
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));

    // Refresh leaderboard display
    updateLeaderboardDisplay(leaderboardKey);
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
 * ✅ Uses Speed & Accuracy Rank-Based System (70% Score, 30% Speed)
 */
function displayLeaderboard(mode) {
    console.log(`📊 Displaying ${mode} leaderboard with ranking system...`);

    let leaderboardKey = mode === "daily" ? "dailyLeaderboard" : "unlimitedLeaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    let leaderboardTable = document.getElementById("leaderboard-table");

    if (!leaderboardTable) {
        console.error(`⚠️ ERROR: Leaderboard table not found!`);
        return;
    }

    leaderboardTable.innerHTML = "<tr><th>Rank</th><th>Username</th><th>Final Score</th><th>Time</th><th>Game Order</th><th>Scores</th></tr>";

    if (leaderboard.length === 0) {
        console.log("ℹ️ No leaderboard entries yet.");
        leaderboardTable.innerHTML += "<tr><td colspan='6'>No entries yet</td></tr>";
        return;
    }

    // ✅ Step 1: Extract Scores & Times
    let scoreRankings = leaderboard.map(entry => ({
        username: entry.username,
        baseScore: Object.values(entry.scores).reduce((sum, game) => sum + game.score, 0),
        completionTime: entry.time
    }));

    // ✅ Step 2: Rank Players by Score (Higher is better)
    scoreRankings.sort((a, b) => b.baseScore - a.baseScore);
    scoreRankings.forEach((player, index) => {
        player.scoreRank = ((scoreRankings.length - index - 1) / (scoreRankings.length - 1)) * 100 || 100;
    });

    // ✅ Step 3: Rank Players by Speed (Lower is better)
    scoreRankings.sort((a, b) => a.completionTime - b.completionTime);
    scoreRankings.forEach((player, index) => {
        player.speedRank = ((scoreRankings.length - index - 1) / (scoreRankings.length - 1)) * 100 || 100;
    });

    // ✅ Step 4: Compute Final Score (70% Score Rank + 30% Speed Rank)
    const weightScore = 70;
    const weightSpeed = 30;

    scoreRankings.forEach(player => {
        player.finalScore = ((weightScore * player.scoreRank) + (weightSpeed * player.speedRank)) / 100;
    });

    // ✅ Step 5: Sort by Final Score
    scoreRankings.sort((a, b) => b.finalScore - a.finalScore);

    // ✅ Step 6: Display the Leaderboard
    scoreRankings.forEach((player, index) => {
        let entry = leaderboard.find(entry => entry.username === player.username);
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
        let scoreDetails = Object.entries(entry.scores)
            .map(([game, data]) => `${game}: ${data.score}`)
            .join(" | ");

        leaderboardTable.innerHTML += `<tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${player.finalScore.toFixed(2)}</td>
            <td>${formatTime(entry.time)}</td>
            <td>${entry.gameOrder.map(g => g.name).join(" → ")}</td>
            <td>${scoreDetails}</td>
        </tr>`;

        console.log(`🏆 ${rank} - ${entry.username}: Final Score ${player.finalScore.toFixed(2)}`);
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
