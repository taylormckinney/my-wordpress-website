/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save() {

	return (
		
			<div {...useBlockProps.save()}>
				<h2>Add new Concert:</h2>
				<form id="concert-form" name="concert-form" method="post" action="tickets_process_submission">
					<label for="artist">Artist:</label>
					<input type="text" id="artist" name="artist" required></input>

					<label for="date">Date:</label>
					<input type="date" id="date" name="date"></input>

					<label for="venue_city">Venue Location:</label>
					<input type="text" id="venue_city" name="venue_city"></input>

					<input type="submit" id="concert-submit" name="concert-submit" value="Search for Setlists"></input>

				</form>

				<div id="searchResults"></div>

				<div id="modal" class="modal-overlay">
					<div class="modal-box">
						<button id="closeBtn" class="modal-close">X</button>
						<h2>Create or Update Ticket: </h2>
						<p id="selected-concert-details"></p>
						<form id="ticket-form" name="ticket-form" method="post">
							<label for="generalAdmission">General Admission Show</label>
							<input type="checkbox" id="generalAdmission" name="generalAdmission"></input>
							<p></p>
							<label for="section">Section: </label>
							<input type="text" id="section" name="section"></input>
							<br/>
							<label for="row">Row: </label>
							<input type="text" id="row" name="row"></input>
							<br/>
							<label for="seat">Seat Number:</label>
							<input type="number" id="seat" name="seat" min="0" step="1"></input>
							<br/>
							<input type="submit" id="ticket-submit" name="ticket-submit" value="Create or Update Ticket"></input>
						</form>
					</div>
				</div>

			</div>
			
		
	);
}
