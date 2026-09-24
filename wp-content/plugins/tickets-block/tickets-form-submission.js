
jQuery(document).ready(function ($) {
    var concertForm = $('#concert-form');

    concertForm.submit(function (event) {
        event.preventDefault();
        $('#searchResults').innerHTML = ""; //clear any previous search results

        var formData = new FormData(concertForm[0]);
        //Date comes from form in YYYY-MM-DD format
        let date = (formData.get('date')).split('-');
        //Date format required by setlist.fm API is DD-MM-YYYY 
        let dateString = date[2] + '-' + date[1] + '-' + date[0];
        //update form data to have the correct date format for setlist.fm API
        formData.set('date', dateString);

        //appended to facilitate the AJAX call
        formData.append('action', 'tickets_process_submission');
        formData.append('nonce', tickets_ajax_data.form_nonce);


        $.ajax({
            url: tickets_ajax_data.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    const shows = response.data.setlist;
                    shows.forEach(function (show) {
                        $('#searchResults').append('<div class="show-result"><h3>' + show.artist.name + ' on ' + show.eventDate + '</h3><p>Venue: ' + show.venue.name + ' in ' + show.venue.city.name + ', ' + show.venue.city.state + '</p><a href="' + show.url + '" target="_blank">View Setlist on Setlist.fm</a><button class="btn btn-primary" id="select-show-' + show.id + '">Select this show</button></div>');
                        document.getElementById('select-show-' + show.id).addEventListener('click', function () {
                            selectShow(show);
                        });
                    });
                    console.log(shows);
                    concertForm[0].reset(); //clear form on success
                } else {
                    $('#searchResults').text('Error occurred while processing your request. </br> ' + response);
                }
            },
            error: function () {
                $('#searchResults').text('Network error occurred while processing your request. Try again');
            }
        });


    });

});

function selectShow(show) {
    const confirmed = confirm('You are selecting the show by ' + show.artist.name + ' on ' + show.eventDate + ' at ' + show.venue.name + '. Click OK to confirm or Cancel to go back.');
    if (!confirmed) {
        return;
    }
    //user clicked ok, create ticket
    console.log('confirmed selection of show: ', show);
    const showData = {
        action: 'create_new_ticket',
        nonce: tickets_ajax_data.create_ticket_nonce,
        show: JSON.stringify(show) //send the show object as a JSON string
    }
    jQuery.ajax({
        url: tickets_ajax_data.ajax_url,
        method: 'POST',
        data: showData,
        dataType: 'json',
        success: function (response) {
            console.log('Ticket created successfully:', response);
        },
        error: function (response) {
            console.error('Error creating ticket:', response.data);
        }
    });
}




function openModal() {
    document.getElementById('newConcertModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('newConcertModal').style.display = 'none';
}