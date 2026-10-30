import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
/**
 * Once document is loaded, if concert form is present (ie only pages w/custom block present),
 * add event listeners on the 'Submit' buttons for both concert-form and tickets-form.
 * Also adds event listeners for the modal popup functionality.
 */
if (document.getElementById('concert-form')) {

    const concertForm = document.getElementById('concert-form');


    //Submit event listener on concert form => modifies date format, then sends data in AJAX call
    //to perform GET on Setlist.fm API call to search for concerts that match user-submitted data 
    concertForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchResultsDiv = document.getElementById('search-results');
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


                } else { //AJAX succeeds but returns error (invalid inputs)
                    searchResultsDiv.textContent = 'Error occurred while processing your request: ' + response.data;
                }
            },
            error: function () { //AJAX failure
                searchResultsDiv.textContent = 'Network error occurred while processing your request. Please try again.';
            },
            complete: function () {
                // Re-enable the submit button and reset its text
                concertForm.querySelector('input[type="submit"]').disabled = false;
                concertForm.querySelector('input[type="submit"]').value = 'Search for Setlists';
                document.body.style.cursor = 'default';
            }
        });


    });



    /** 
     * After API returns successfully, iterate through returned shows and render each as 
     * a div w/details & a button to select that specific show, to create ticket for it 
     **/
    function createShowResult(show) {
        const result = document.createElement('div');
        result.className = 'show-result';

        const content = document.createElement('div');
        const heading = document.createElement('h3');
         heading.textContent = show.artist.name + ' on ' + show.pretty_date;
        content.append(heading);

         

        const venue = document.createElement('p');
        venue.innerHTML = '<strong>Venue</strong>: ' + show.venue.name + ' in ' + show.venue.city.name + ', ' + show.venue.city.state;
        content.append(venue);

        if (typeof show.url === 'string' && show.url.startsWith('https://www.setlist.fm/')) {
            const setlistLink = document.createElement('a');
            setlistLink.href = show.url;
            setlistLink.target = '_blank';
            setlistLink.rel = 'noopener noreferrer';
            setlistLink.textContent = 'View Setlist on Setlist.fm';
            content.append(setlistLink);
        } else {
            const unavailableLink = document.createElement('span');
            unavailableLink.textContent = 'Setlist link unavailable';
            content.append(unavailableLink);
        }

        result.append(content);

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



    //variables/helper funcs for popup modal after user selects a specific show, to add seat details 
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


    /**
     * After user selects a show from the rendered results, display a popup modal to confirm the show 
     * selection, add seat details, select if opening acts should be included, then create ticket: 
     * */
    function selectShow(show) {
        openModal(); //opens popup modal to add final details for ticket creation

        const seatData = {};
        const ticketForm = document.getElementById('ticket-form');
        const details = document.getElementById("selectedConcertDetails");
        details.textContent = 'You are creating a ticket for the ' + show.artist.name + ' concert on ' + show.pretty_date + ' at ' + show.venue.name + ' in ' + show.venue.city.name + ', ' + show.venue.city.state + '.';

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
        const openerCandidates = [];
        const includeOpenersCheckbox = document.getElementById("includeOpeners");
        const openersContainer = document.getElementById("openersContainer");
        includeOpenersCheckbox.addEventListener('change', function () {
            if (this.checked) {
                //if user wants to include opening acts, reuses same AJAX action to query Setlist.fm API
                openersContainer.style.display = 'block';

                const openersData = {
                    action: 'tickets_process_submission',
                    nonce: tickets_ajax_data.form_nonce,
                    date: show.eventDate,
                    venue_id: show.venue.id
                };

                jQuery.ajax({
                    url: tickets_ajax_data.ajax_url,
                    type: 'POST',
                    data: openersData,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            const openers = response.data.setlist;
                            
                            if (openers.length === 1 && openers[0].artist.name === show.artist.name) {
                                const noOpenersMsg = document.createElement('p');
                                noOpenersMsg.textContent = 'No opening acts found for this show. Optionally, you can manually add opening acts below.';
                                openersContainer.appendChild(noOpenersMsg);

                                const manualOpenersInput = document.createElement('input');
                                manualOpenersInput.type = 'text';
                                manualOpenersInput.style.width = '70%';
                                manualOpenersInput.id = 'manualOpeners';
                                manualOpenersInput.name = 'manualOpeners';
                                manualOpenersInput.placeholder = 'Enter opening acts separated by commas';
                                openersContainer.appendChild(manualOpenersInput);
                            }
                            else {
                                openers.forEach(function (opener) {
                                    // Process each opener
                                    if (opener.artist.name !== show.artist.name) { // Exclude the headliner
                                        const openerDiv = document.createElement('div');
                                        openerDiv.textContent = 'Opening Act: ' + opener.artist.name;
                                        //render checkbox to determine if opener's full setlist should also be included
                                        const openerCheckbox = document.createElement('input');
                                        openerCheckbox.type = 'checkbox';
                                        openerCheckbox.name = 'includeOpenerSetlist';
                                        openerCheckbox.value = opener.artist.mbid;
                                        openerDiv.appendChild(openerCheckbox);
                                        openersContainer.appendChild(openerDiv);

                                        var openerObj = {
                                            name: opener.artist.name,
                                            id: opener.artist.mbid || null,
                                            setlist: opener
                                        };
                                        openerCandidates.push(openerObj);

                                    }

                                });
                            }
                        }

                    }
                });

            }
            else {
                openersContainer.style.display = 'none';
            }
        });

        //event listener for ticket details form submission => normalizes data & creates new ticket via AJAX
        ticketForm.addEventListener('submit', function (event) {
            event.preventDefault();

            //normalize seat data:
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

            //add opening acts to show data if user selected that option
            //names of openers are added by default when includeOpeners is checked
            if (ticketFormData.get('includeOpeners')) {
                const selectedIds = new Set(ticketFormData.getAll('includeOpenerSetlist'));
                const manualNames = String(ticketFormData.get('manualOpeners') || '')
                    .split(',')
                    .map(name => name.trim())
                    .filter(Boolean);

                show.openers = [
                    ...openerCandidates.map(opener => {
                        const entry = { name: opener.name };
                        //only include entire setlist if user selected so for this artist
                        if (selectedIds.has(opener.id)) {
                            entry.setlist = opener.setlist;
                        }
                        return entry;
                    }),
                    ...manualNames.map(name => ({ name }))
                ];

            }

            console.log(show.openers);


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




    }

}


