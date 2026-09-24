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
		<>
		<a href="#" onclick="openModal()">Add new concert:</a>
			<div {...useBlockProps.save()} id="newConcertModal" className="modal">
				<span class="closeButton" onclick="closeModal()">&times;</span>
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
			</div>
			</>
		
	);
}
