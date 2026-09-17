
jQuery(document).ready(function($) {
    var concertForm = $('#concert-form');

    concertForm.submit(function(event) {
        event.preventDefault();
        console.log('clicked');


        var formData = new FormData(concertForm[0]);
        //Date format required by setlist.fm API is DD-MM-YYYY 
        //Date comes from form in YYYY-MM-DD format
        let date = (formData.get('date')).split('-');
        console.log('date: ', date);
        let dateString = date[2] + '-' + date[1] + '-' + date[0];
        console.log('dateString: ', dateString);

        //update form data to have the correct date format for setlist.fm API
        formData.set('date', dateString);
        formData.append('action', 'tickets_process_submission');
        formData.append('nonce', tickets_form_data.nonce); 
        
        console.log('Form data to be sent:', formData.get('artist'), formData.get('date'), formData.get('venue_city'));


        $.ajax({
            url: tickets_form_data.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json', //do I need this??
            beforeSend: function() {
                $('#concert-submit').text('Sending...');
                console.log('Sending form data to server...');
            },
            success: function(response) {
                if(response.success) {
                    const shows = response.data.setlist;
                    shows.forEach(function(show) {
                        $('#searchResults').append('<div class="show-result"><h3>' + show.artist.name + ' - ' + show.eventDate + '</h3><p>Venue: ' + show.venue.name + ', ' + show.venue.city.name + '</p><a href="' + show.url + '" target="_blank">View Setlist</a></div>');
                    });
                    console.log(shows);
                    concertForm[0].reset(); //clear form on success
                } else {
                    console.log('success func triggered but else hit. Server response:', response);
                    $('#searchResults').text('Error occurred while processing your request. </br> ' + response);
                }
            },
            error: function() {
                $('#searchResults').text('Network error occurred while processing your request. Try again');
            }
        });

        
    });

});

