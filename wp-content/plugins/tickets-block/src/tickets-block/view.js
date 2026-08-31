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

const setlistFmBaseUrl = 'https://api.setlist.fm/rest/1.0/search/setlists?'

document.addEventListener('DOMContentLoaded', () => {
    const concertForm = document.getElementById('concertForm');

    concertForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let artist = concertForm.elements['artist'].value;
        let date = new Date(concertForm.elements['date'].value);
        let city = concertForm.elements['venue.city'].value;
        
        //Date format required by setlist.fm API is DD-MM-YYYY 
        let dateString = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

        let searchURL = setlistFmBaseUrl + 'artistName=' + artist + '&date=' + dateString + '&cityName=' + city;
        console.log(searchURL);
        searchForSetlist(searchURL);
    });

});

function searchForSetlist(searchURL) {
    fetch(searchURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'x-api-key': SETLISTFM_API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching setlist:', error);
    });
}

function displaySearchResults(data) {
    console.log(data);
}


/* eslint-enable no-console */
