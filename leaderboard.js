function saveToLeaderboard(username, time, scores) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    leaderboard.push({ username, time, scores });
    leaderboard.sort((a, b) => a.time - b.time);
    
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard();
}

function isUsernameUsedToday(username) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    return leaderboard.some(entry => entry.username === username);
}

function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardList = document.getElementById("leaderboard");
    leaderboardList.innerHTML = "";

    leaderboard.forEach((entry, index) => {
        let listItem = document.createElement("li");
        let scoreDetails = Object.entries(entry.scores).map(([game, data]) => 
            `${game}: ${data.score}/${games.find(g => g.name === game).maxScore}`
        ).join(" | ");

        listItem.innerText = `${index + 1}. ${entry.username} - ${entry.time}s | ${scoreDetails}`;
        leaderboardList.appendChild(listItem);
    });
}

window.onload = displayLeaderboard;
