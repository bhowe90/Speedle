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
    let leaderboardContainer = document.getElementById("leaderboard-table");

    if (!leaderboardContainer) {
        console.error("Leaderboard container not found!");
        return;
    }

    // Clear previous leaderboard content
    leaderboardContainer.innerHTML = "";

    // If no entries, show a placeholder message
    if (leaderboard.length === 0) {
        leaderboardContainer.innerHTML = "<p>No entries yet. Play a game to appear on the leaderboard!</p>";
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

    leaderboardContainer.innerHTML = html;
}



function displayLeaderboardOnHome() {
    let leaderboardHome = document.getElementById("leaderboard-home");
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    if (!leaderboardHome) {
        console.error("Leaderboard home section not found!");
        return;
    }

    leaderboardHome.innerHTML = "<h3>Leaderboard</h3>";

    if (leaderboard.length === 0) {
        leaderboardHome.innerHTML += "<p>No leaderboard entries yet</p>";
        return;
    }

    let html = `<table>
        <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Time</th>
        </tr>`;

    leaderboard.forEach((entry, index) => {
        let rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;
        html += `
        <tr>
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${formatTime(entry.time)}</td>
        </tr>`;
    });

    html += `</table>`;

    leaderboardHome.innerHTML += html;
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

