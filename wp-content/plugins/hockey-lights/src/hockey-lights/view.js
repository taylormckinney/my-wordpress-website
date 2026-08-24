/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
let gameDay = new Date();
let schedule = {};
let selectedGame = {};
const nhlBaseUrl = 'https://corsproxy.io/?url=https://api-web.nhle.com/v1/';
const nhlStatsBaseUrl = 'https://corsproxy.io/?url=https://api.nhle.com/stats/rest/en/';

/**
 * Once page HTML loads, add event listener to game day form submit button to fetch schedule for selected game day
 */
document.addEventListener('DOMContentLoaded', () => {

    const gameDayForm = document.getElementById('gameDayForm');

    gameDayForm.addEventListener('submit', (event) => {
        event.preventDefault();
        gameDay = gameDayForm.elements['gameDay'].value;

        let apiURL = nhlBaseUrl + 'schedule/' + gameDay;

        schedule = getSchedule(apiURL);
    });
});





/**
 * Fetches schedule from NHL API & triggers display of week's schedule
 */
async function getSchedule(apiURL) {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
        const schedule = await response.json();
        const gameWeek = schedule.gameWeek;
        console.log(gameWeek);
        displaySchedule(gameWeek);
    }
    catch (error) {
        console.error(error.message);
    }
}

/**
 * Displays week's schedule & highlights selected game day. Triggers display of games
 */
function displaySchedule(gameWeek) {
    const weekDiv = document.getElementById("weekSchedule");

    //clear any displayed schedule, if exists
    while (weekDiv.hasChildNodes()) {
        weekDiv.removeChild(weekDiv.firstChild);
    }

    gameWeek.forEach((day) => {
        const newDayDiv = document.createElement("div");
        newDayDiv.classList.add("day");
        if (day.date == gameDay) {
            newDayDiv.classList.add("gameDay");
            displayGames(day.games);
        }
        const dayDate = new Date(day.date);
        newDayDiv.innerHTML = `<p>${day.dayAbbrev} <br />${dayDate.getMonth() + 1}/${dayDate.getDate()} </p><p><b>Games:</b> ${day.numberOfGames}</p>`;
        newDayDiv.onclick = () => {
            gameDay = day.date;
            displaySchedule(gameWeek);
        };

        weekDiv.appendChild(newDayDiv);
    });
}


/**
 * Displays games for selected game day
 */
function displayGames(gamesList) {
    const gamesDiv = document.getElementById("games");
    //clear any displayed games, if exists
    while (gamesDiv.hasChildNodes()) {
        gamesDiv.removeChild(gamesDiv.firstChild);
    }

    const toggleGamesButton = document.createElement("button");
    toggleGamesButton.id = "toggleGames";
    toggleGamesButton.innerHTML = "Hide Games";
    toggleGamesButton.onclick = toggleShowGames;
    gamesDiv.insertBefore(toggleGamesButton, null);

    gamesList.forEach((game) => {
        const awayTeam = game.awayTeam;
        const homeTeam = game.homeTeam;

        const newGameDiv = document.createElement("div");

        newGameDiv.classList.add("game");
        newGameDiv.id = game.id;
        newGameDiv.innerHTML = `<p>${awayTeam.commonName.default} at ${homeTeam.commonName.default}</p><p>Local start time: ${new Date(game.startTimeUTC).toLocaleString()}</p>`;
        newGameDiv.onclick = () => {
            selectedGame = game;
            newGameDiv.classList.add("selectedGame");
            displayGameDetails(selectedGame);
            toggleShowGames();
        };

        gamesDiv.appendChild(newGameDiv);
    });
}
/**
 * Toggles display of games; If a game is selected, it will remain displayed when toggling, otherwise all are hidden
 * If a game is selected and user clicks 'Show all games', all games will be displayed and the selected game is unset
 */
function toggleShowGames() {
    const toggleButton = document.getElementById("toggleGames");
    const gamesElmts = document.getElementsByClassName("game");

    if (toggleButton.innerHTML === "Hide Games") {
        console.log('triggered toggleShowGames to hide games; seleted game ID: ' + selectedGame.id);
        [...gamesElmts].forEach((gameDiv) => {
            if (gameDiv.id != selectedGame.id) {
                gameDiv.style.display = "none";
            }
        });
        toggleButton.innerHTML = "Show All Games";
    }
    else {
        [...gamesElmts].forEach((gameDiv) => {
            gameDiv.style.display = "block";
            gameDiv.classList.remove("selectedGame");
        });
        toggleButton.innerHTML = "Hide Games";
    }

}

/**
 * Displays details for a selected game & triggers display of Lights control 
 */
function displayGameDetails(game) {
    console.log('triggered displayGameDetails for ' + game.id);
}




/* eslint-enable no-console */
