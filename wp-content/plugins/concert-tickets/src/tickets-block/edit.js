/**
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import metadata from './block.json';
import { Disabled, PanelBody, SelectControl, ColorPicker } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { ServerSideRender } from '@wordpress/server-side-render';
import { useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';




/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

//TODO: upgrade to client side rendering rather than using server-side rendering?
export default function Edit({ attributes, setAttributes }) {
	//store as React component to trigger re-render when tickets are fetched from the REST API
	const [tickets, setTickets] = useState([]);
	//runs once when mounted to fetch tickets from the REST API
	useEffect(() => {
		wp.apiFetch({ path: '/wp/v2/ticket' })
			.then(setTickets)
			.catch((error) => {
				console.error('Error fetching tickets:', error);
			});
	}, []);

	const [terms, setTerms] = useState([]);
	const [termsError, setTermsError] = useState('');
	const taxonomy = attributes.filterTaxonomy || '';

	useEffect(() => {
		setTerms([]);
		setTermsError('');

		const taxonomyEndpoints = {
			artist: '/wp/v2/artist',
			venue: '/wp/v2/venue',
			concert_month: '/wp/v2/concert_month',
			concert_year: '/wp/v2/concert_year',
		};

		const endpoint = taxonomyEndpoints[taxonomy];
		if (!endpoint) {
			console.error('No taxonomy selected or invalid taxonomy. Taxonomy value: ', taxonomy);
			return;
		}

		//used to avoid stale data updating the state if the component unmounts before the fetch completes
		let isCurrentRequest = true;

		wp.apiFetch({ path: endpoint })
			.then((fetchedTerms) => {
				if (isCurrentRequest) {
					setTerms(fetchedTerms);
				}
			})
			.catch((error) => {
				if (isCurrentRequest) {
					console.error('Error fetching terms:', error);
					setTermsError('Could not load terms for this taxonomy.');
				}
			});

		//cleanup function, for if the component unmounts before the fetch completes
		return () => {
			isCurrentRequest = false;
		};

	}, [taxonomy]);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ticket Display Settings">
					<SelectControl
						label="Select Display Mode"
						value={attributes.displayMode}
						options={[
							{ label: 'List all Tickets', value: 'list' },
							{ label: 'Display single Ticket', value: 'single' },
							{ label: 'Filter tickets by taxonomy', value: 'archive' }
						]}
						onChange={(displayMode) => {
							setAttributes({ displayMode });


						}
						}
					/>
					{attributes.displayMode === 'single' && (
						<SelectControl
							label="Select Ticket to Display"
							value={attributes.ticketId}
							onChange={(ticketId) => setAttributes({ ticketId })}
							options={tickets.map((ticket) => ({
								label: decodeEntities(ticket.title.rendered),
								value: ticket.id
							}))}
						/>
					)}
					{attributes.displayMode === 'archive' && (

						<SelectControl
							label="Select a taxonomy to filter tickets by"
							value={taxonomy}
							onChange={(filterTaxonomy) => {
								setAttributes({
									filterTaxonomy,
									filterTermId: '' // Reset the filterTerm when the taxonomy changes
								});
							}}
							options={[
								{ label: 'None', value: '' },
								{ label: 'Artist', value: 'artist' },
								{ label: 'Venue', value: 'venue' },
								{ label: 'Month', value: 'concert_month' },
								{ label: 'Year', value: 'concert_year' }
							]}
						/>

					)}
					{taxonomy && (<SelectControl
						label="Select filter value"
						value={attributes.filterTermId || ''}
						options={[
							{ label: 'Choose a value', value: '' },
							...terms.map((term) => ({
								label: decodeEntities(term.name),
								value: String(term.id),
							})),
						]}
						onChange={(filterTermId) => setAttributes({ filterTermId })}
						help={termsError || undefined}
					/>)}


				</PanelBody>
				<PanelBody title="Appearance Customization">
					<ColorPicker
						color={attributes.backgroundColor}
						onChangeComplete={(color) => setAttributes({ backgroundColor: color.hex })}
						label="Background Color"
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<Disabled>
					<ServerSideRender
						block={metadata.name}
						attributes={attributes}
					/>
				</Disabled>
			</div>
		</>
	);
}
