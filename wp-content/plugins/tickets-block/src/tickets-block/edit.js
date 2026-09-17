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
				Add new concert: 
				<form id="concert-form" method="post" name="concert-form" action="tickets_process_submission">
					<label for="artist">Artist:</label>
					<input type="text" id="artist" name="artist" required></input>

					<label for="date">Date:</label>
					<input type="date" id="date" name="date"></input>

					<label for="venue_city">Venue Location:</label>
					<input type="text" id="venue_city" name="venue_city"></input>

					<input type="submit" id="concert-submit" name="concert-submit" value="Search for Setlists"></input>
					
				</form>

				<div id="searchResults"></div>
			</div>
		
	);
}
