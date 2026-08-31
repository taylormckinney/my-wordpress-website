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
export default function Edit({ attributes, setAttributes }) {
	const { concertsList } = attributes;

	const removeConcert = (index) => {
		const concertsCopy = concertsList.filter((_, i) => i !== index);
		setAttributes({ concertsList: concertsCopy });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Concerts Settings', 'tickets-block')}
					initialOpen={true}
				>
					{concertsList && concertsList.map((concert, index) => (
						<>
							<p>{concert.artist} on {concert.date} at {concert.venue}</p>

							<Button isDestructive onClick={() => removeConcert(index)}>
								<Dashicon icon="remove" style={{ marginRight: '5px' }} />
								{__('Remove Concert', 'tickets-block')}
							</Button>

							
						</>
					))}


				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				Add new concert: 
				<form id="concertForm" method="post">
					<label for="artist">Artist:</label>
					<input type="text" id="artist" name="artist"></input>
					<label for="date">Date:</label>
					<input type="date" id="date" name="date"></input>
					<label for="venue.city">Venue Location:</label>
					<input type="text" id="venue.city" name="venue.city"></input>
					<input type="submit"></input>
				</form>

				<div id="searchResults"></div>
				
				{concertsList && concertsList.map((concert, index) => (
					<div key={index}>
						<h3>{concert.artist}</h3>
						<p>{concert.date}</p>
					</div>
				))}
			</div>
		</>
	);
}
