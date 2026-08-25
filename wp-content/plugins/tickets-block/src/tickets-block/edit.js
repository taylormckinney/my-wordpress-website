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
import { PanelBody, Button, Dashicon, Divider, TextControl, DatePicker } from '@wordpress/components';
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
export default function Edit({attributes, setAttributes}) {
	const { concertsList } = attributes;

	//add new empty concert (for Add button)
	const addConcert = () => {
		const concertsCopy = [...(concertsList || [])];
		concertsCopy.push(' ');
		setAttributes({ concertsList: concertsCopy });
	};
	//update an existing concert by index
	const updateConcert = (index, newValue) => {
		const concertsCopy = [...concertsList];
		concertsCopy[index] = newValue;
		setAttributes({ concertsList: concertsCopy });
	};

	//remove concert by index (for Remove button)
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
				<Button onClick={() => addConcert()}>
					<Dashicon icon="insert" style={{marginRight: '5px'}}/>
						{__('Add a new Concert', 'tickets-block')}
				</Button>
				{concertsList && concertsList.map((concert, index) => (
					<>
						<Divider />
						<TextControl
						key={index}
						label={__('Insert artist for Concert ' + (index + 1), 'tickets-block')}
						value={concert.artist}
						onChange={(newValue) => updateConcert(index, newValue)}
						/>
						<DatePicker
						key={index}
						label={__('Insert date for Concert ' + (index + 1), 'tickets-block')}
						value={concert.date}
						onChange={(newValue) => updateConcert(index, newValue)}
						/>

						</>))};

			</PanelBody>
		</InspectorControls>
		<p { ...useBlockProps() }>
			{ __( 'Tickets Block – hello from the editor!', 'tickets-block' ) }
		</p>
		</>
	);
}
