function saveToLeaderboard(username, time) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ username, time });
    leaderboard.sort((a, b) => a.time - b.time);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    displayLeaderboard();
}

function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardList = document.getElementById("leaderboard");
    leaderboardList.innerHTML = "";

    leaderboard.forEach((entry, index) => {
        let listItem = document.createElement("li");
        listItem.innerText = `${index + 1}. ${entry.username} - ${entry.time} sec`;
        leaderboardList.appendChild(listItem);
    });
}

window.onload = displayLeaderboard;
