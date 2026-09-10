/* const apiKey = {}
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
    }); */

    jQuery(document).ready(function($) {
        $('#searchSubmitButton').on('click', function() {
            $.ajax({
                url: ajax_object.ajax_url,
                method: 'GET',
                data: {
                    action: 'get_setlist_ajax',
                    security: ajax_object.nonce,
                    setlist_search_url: searchURL
                },
                success: function(response) {
                    console.log(response);
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                }
            });
        });

    });