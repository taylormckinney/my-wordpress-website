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
export default function save({ attributes }) {
	const { concertsList } = attributes;

	return (
		
			<div {...useBlockProps.save()}>
				Add new concert: 
				<form id="concertForm" method="post">
					<label for="artist">Artist:</label>
					<input type="text" id="artist" name="artist" required></input>
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
		
	);
}
