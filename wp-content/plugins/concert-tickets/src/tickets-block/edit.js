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
import { Disabled, PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { ServerSideRender } from '@wordpress/server-side-render';
import metadata from './block.json';
import { TextControl } from '@wordpress/components';




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
	return (
		<>
		<InspectorControls>
			<PanelBody title="Ticket Display Settings">
				<SelectControl
					label="Select Display Mode"
					value={attributes.displayMode}
					options={[
						{ label: 'List all Tickets', value: 'list' },
						{ label: 'Display single Ticket', value: 'single' }
					]}
					onChange={(displayMode) => {
						setAttributes({ displayMode });
					}}
				/>
				<TextControl
					label="Optionally Specify Ticket ID"
					value={attributes.ticketId}
					onChange={(ticketId) => setAttributes({ ticketId })}
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
