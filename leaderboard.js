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

// Run reset check on page load
window.onload = () => {
    checkLeaderboardReset();
    displayLeaderboard();
    displayLeaderboardOnHome();
};
