import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
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
        if (concertFormData.get('date') != '') {
            //Date comes from form in YYYY-MM-DD format
            let date = (concertFormData.get('date')).split('-');
            //Date format required by setlist.fm API is DD-MM-YYYY
            let dateString = date[2] + '-' + date[1] + '-' + date[0];
            concertFormData.set('date', dateString);
        }

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
            beforeSend: function () {
                // Disable the submit button and change its text to indicate loading
                concertForm.querySelector('input[type="submit"]').disabled = true;
                concertForm.querySelector('input[type="submit"]').value = 'Searching...';
                document.body.style.cursor = 'wait';
            },
            success: function (response) {
                if (response.success) { //verifies API call was successful, not just AJAX call
                    const shows = response.data.setlist;
                    const heading = document.createElement('h2');
                    heading.textContent = 'Select the show you would like to create a ticket for:';
                    const results = document.createDocumentFragment();
                    shows.forEach(function (show) {
                        results.append(createShowResult(show));
                    });
                    searchResultsDiv.replaceChildren(heading, results);


                } else {
                    searchResultsDiv.textContent = 'Error occurred while processing your request: ' + response.data;
                }
            },
            error: function () {
                searchResultsDiv.textContent = 'Network error occurred while processing your request. Try again';
            },
            complete: function () {
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
    //After API returns, render each returned show as div w/details & a button to select that show to create ticket
    function createShowResult(show) {
        const result = document.createElement('div');
        result.className = 'show-result';

        const heading = document.createElement('h3');
        heading.textContent = show.artist.name + ' on ' + show.eventDate;
        result.append(heading);

        const venue = document.createElement('p');
        venue.textContent = 'Venue: ' + show.venue.name + ' in ' + show.venue.city.name + ', ' + show.venue.city.state;
        result.append(venue);

        if (typeof show.url === 'string' && show.url.startsWith('https://www.setlist.fm/')) {
            const setlistLink = document.createElement('a');
            setlistLink.href = show.url;
            setlistLink.target = '_blank';
            setlistLink.rel = 'noopener noreferrer';
            setlistLink.textContent = 'View Setlist on Setlist.fm';
            result.append(setlistLink);
        } else {
            const unavailableLink = document.createElement('span');
            unavailableLink.textContent = 'Setlist link unavailable';
            result.append(unavailableLink);
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-primary';
        button.id = 'select-show-' + show.id;
        button.textContent = 'Select this show';
        button.addEventListener('click', function () {
            selectShow(show);
        });
        result.append(button);

        return result;
    }

    //After user selects a show from results, render modal to confirm/add seat details, then create ticket: 
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
                beforeSend: function () {
                    // Disable the submit button and change its text to indicate loading
                ticketForm.querySelector('input[type="submit"]').disabled = true;
                ticketForm.querySelector('input[type="submit"]').value = 'Creating Ticket...';
                document.body.style.cursor = 'wait';
                },
                success: function (response) {
                    Toastify({
                        text: 'Ticket created or updated successfully!',
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#4CAF50",
                        callback: function () {
                            window.location.reload();
                        }
                    }).showToast();

                },
                error: function (response) {
                    console.error('Error creating ticket:', response.data);
                }
            });

        });


        const details = document.getElementById("selectedConcertDetails");
        details.textContent = 'You are creating a ticket for the ' + show.artist.name + ' concert on ' + show.eventDate + ' at ' + show.venue.name + ' in ' + show.venue.city.name + ', ' + show.venue.city.state + '.';

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


