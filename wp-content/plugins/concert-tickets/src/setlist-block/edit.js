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

			<form id="concert-form" name="concert-form" method="post" action="tickets_process_submission">
				<fieldset>
					<legend>Search for a Concert to add:</legend>
					<label for="artist">Artist:</label>
					<input type="text" id="artist" name="artist" required></input>

					<label for="date">Date:</label>
					<input type="date" id="date" name="date"></input>

					<label for="venue_city">Venue Location:</label>
					<input type="text" id="venue_city" name="venue_city"></input>

					<input type="submit" id="concert-submit" name="concert-submit" value="Search for Setlists"></input>
				</fieldset>
			</form>

			<div id="search-results"><p><i>Search results will appear here once form is submitted.</i></p></div>

			<div id="modal" class="modal-overlay">
				<div class="modal-box">
					<button id="closeBtn" class="modal-close">X</button>
					<h2>Create or Update Ticket: </h2>
					<p id="selectedConcertDetails"></p>
					<form id="ticket-form" name="ticket-form" method="post">
						<input type="checkbox" id="includeOpeners" name="includeOpeners"></input>
						<label for="includeOpeners">Include Opening Acts</label>
						<div id="openersContainer"></div>
						<input type="checkbox" id="generalAdmission" name="generalAdmission"></input>
						<label for="generalAdmission">General Admission Show</label>
						<fieldset id="seatDetails">
							<legend>Seat Details</legend>
							<label for="section">Section: </label>
							<input type="text" id="section" name="section"></input>
							<label for="row">Row: </label>
							<input type="text" id="row" name="row"></input>
							<label for="seatNumber">Seat Number:</label><br />
							<input type="number" id="seatNumber" name="seatNumber" min="0" step="1"></input>
						</fieldset>
						<input type="submit" id="ticket-submit" name="ticket-submit" value="Create or Update Ticket"></input>
					</form>
				</div>
			</div>

		</div>


	);
}
