/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, Dashicon, Divider, TextControl, DatePicker, Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit() {

	return (
		<div {...useBlockProps()}>
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
					<p id="selectedConcertDetails"></p>
					<form id="ticket-form" name="ticket-form" method="post">
						<label for="generalAdmission">General Admission Show</label>
						<input type="checkbox" id="generalAdmission" name="generalAdmission"></input>
						<fieldset id="seatDetails">
							<legend>Seat Details</legend>
							<label for="section">Section: </label>
							<input type="text" id="section" name="section"></input>
							<br />
							<label for="row">Row: </label>
							<input type="text" id="row" name="row"></input>
							<br />
							<label for="seatNumber">Seat Number:</label>
							<input type="number" id="seatNumber" name="seatNumber" min="0" step="1"></input>
						</fieldset>
						<input type="submit" id="ticket-submit" name="ticket-submit" value="Create or Update Ticket"></input>
					</form>
				</div>
			</div>

		</div>


	);
}
