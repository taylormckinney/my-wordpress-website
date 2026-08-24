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
			<div id="hue">Connect to Hue account: </div>

			<hr></hr>

				<form id="gameDayForm" method="post">
					<label for="gameDay">Choose a date to get started</label>
					<input type="date" id="gameDay" name="gameDay"></input>
					<input type="submit"></input>
				</form>

				<div id="weekSchedule"></div>

				<div id="games"></div>

				<div id="gameDetails"></div>

		</div>

	);
}
