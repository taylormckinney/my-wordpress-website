//Form submission handling: 
jQuery(document).ready(function ($) {
    const concertForm = $('#concert-form');
    const ticketForm = $('#ticket-form');


    concertForm.submit(function (event) {
        event.preventDefault();
        $('#searchResults').text(''); //clear any previous search results
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
                    concertForm[0].reset(); //clear form on success
                } else {
                    $('#searchResults').text('Error occurred while processing your request: ' + response.data);
                }
            },
            error: function () {
                $('#searchResults').text('Network error occurred while processing your request. Try again');
            }
        });


    });

});

//variables for popup modal after user selects a specific show to add seat details 
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');

function closeModal() {
    modal.classList.remove("show");
}

closeBtn.addEventListener("click", closeModal);

//Close modal when clicking outside the box: 
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeModal();
    }
});
//Close modal if user pushes Esc key
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

//After form is submitted & API is searched, user selects a show from results: 
function selectShow(show) {
    modal.classList.add("show"); //opens confirmation popup

    //TODO: add seat data from popup !!!! to <p>:
    const details = document.getElementById("selected-concert-details");

    //TODO: prevent default submit on tickets form
    //TODO: validation on gen adm vs seats
    //TODO: add seat details to data & send with showData
    //TODO: add option to also search for opening acts

    if (false) { //placeholder while I work on modal popup as confirmation 
        const showData = {
            action: 'create_new_ticket',
            nonce: tickets_ajax_data.create_ticket_nonce,
            show: JSON.stringify(show) //send the show object as a JSON string
        };

        jQuery.ajax({
            url: tickets_ajax_data.ajax_url,
            method: 'POST',
            data: showData,
            dataType: 'json',
            success: function (response) {
                console.log('Ticket created successfully:', response);
                //TODO: add a toast popup to confirm to user
            },
            error: function (response) {
                console.error('Error creating ticket:', response.data);
            }
        });
    }
}




