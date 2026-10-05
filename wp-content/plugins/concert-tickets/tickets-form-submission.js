/**
 * Once document is loaded, if concert form is present (ie only pages w/custom block present),
 * add event listeners on the 'Submit' buttons for both concert-form and tickets-form.
 * Also adds event listeners for the modal popup functionality.
 */
if (document.getElementById('concert-form')) {

    const concertForm = document.getElementById('concert-form');
    concertForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchResultsDiv = document.getElementById('searchResults');
        searchResultsDiv.textContent = ''; //clear any previous search results
        var concertFormData = new FormData(concertForm);

        //Date comes from form in YYYY-MM-DD format
        let date = (concertFormData.get('date')).split('-');
        //Date format required by setlist.fm API is DD-MM-YYYY 
        let dateString = date[2] + '-' + date[1] + '-' + date[0];
        concertFormData.set('date', dateString);

        //appended to facilitate the AJAX call
        concertFormData.append('action', 'tickets_process_submission');
        concertFormData.append('nonce', tickets_ajax_data.form_nonce);


        jQuery.ajax({
            url: tickets_ajax_data.ajax_url,
            type: 'POST',
            data: concertFormData,
            processData: false,
            contentType: false,
            dataType: 'json',
            beforeSend: function() {
                // Disable the submit button and change its text to indicate loading
                concertForm.querySelector('input[type="submit"]').disabled = true;
                concertForm.querySelector('input[type="submit"]').value = 'Searching...';
                document.body.style.cursor = 'wait';
            },
            success: function (response) {
                if (response.success) { //verifies API call was successful, not just AJAX call
                    const shows = response.data.setlist;
                    searchResultsDiv.innerHTML = '<h2>Select the show you would like to create a ticket for:</h2>'; //clear previous search results before adding new ones
                    shows.forEach(function (show) {
                        searchResultsDiv.innerHTML += '<div class="show-result"><h3>' + show.artist.name + ' on ' + show.eventDate + '</h3><p>Venue: ' + show.venue.name + ' in ' + show.venue.city.name + ', ' + show.venue.city.state + '</p><a href="' + show.url + '" target="_blank">View Setlist on Setlist.fm</a><button class="btn btn-primary" id="select-show-' + show.id + '">Select this show</button></div>';
                        document.getElementById('select-show-' + show.id).addEventListener('click', function () {
                            selectShow(show);
                        });
                    });

                    

                } else {
                    searchResultsDiv.textContent = 'Error occurred while processing your request: ' + response.data;
                }
            },
            error: function () {
                searchResultsDiv.textContent = 'Network error occurred while processing your request. Try again';
            },
            complete: function() {
                // Re-enable the submit button and reset its text
                concertForm.querySelector('input[type="submit"]').disabled = false;
                concertForm.querySelector('input[type="submit"]').value = 'Search for Setlists';
                document.body.style.cursor = 'default';
            }
        });


    });




    //variables for popup modal after user selects a specific show to add seat details 
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('closeBtn');

    function openModal() {
        modal.classList.add("show");
    }
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
        openModal();

        const seatData = {};
        const ticketForm = document.getElementById('ticket-form');

        ticketForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var ticketFormData = new FormData(ticketForm);
            if (ticketFormData.get('generalAdmission')) {
                seatData.section = 'General Admission';
                seatData.row = '';
                seatData.number = '';
            }
            else {
                seatData.section = ticketFormData.get("section");
                seatData.row = ticketFormData.get("row");
                seatData.number = ticketFormData.get("seatNumber");
            }
            //add seat details to show data
            show.seat = seatData;


            //submit all show data to create a new Ticket CPT (or udpate existing)
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
                beforeSend: function() {
                    // Optionally show a loading spinner or message
                },
                success: function (response) {
                    console.log('Ticket created successfully:', response);
                    //TODO: add a toast popup to confirm to user
                    window.location.reload(); //reload concerts page after creation of ticket

                },
                error: function (response) {
                    console.error('Error creating ticket:', response.data);
                }
            });

        });


        const details = document.getElementById("selectedConcertDetails");
        details.textContent = 'You are creating a ticket for the ' + show.artist.name + ' concert on ' + show.date + ' at ' + show.venue.name + ' in ' + show.venue.city.name + ', ' + show.venue.city.state + '.';

        const genAdmCheckbox = document.getElementById("generalAdmission");
        genAdmCheckbox.addEventListener('change', function () {
            const seatDetailsSet = document.getElementById("seatDetails");
            if (this.checked) {
                //general admission checked, seat details not needed 
                seatDetailsSet.style.display = 'none';

            }
            else {
                //genAdm not checked, display form fieldset for seat details
                seatDetailsSet.style.display = 'block';
            }
        });


        //TODO: add option to also search for opening acts



    }

}







