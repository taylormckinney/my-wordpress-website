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
export default function save({attributes}) {
	const {faqList} = attributes;
	return (
		<div { ...useBlockProps.save() }>
			{ faqList && faqList.map((faq, index) => (
				<button class="faq-item" key={index} id={'toggle' + index}>
					<p class="faq-question" id={'question' + index}>{faq.question}</p>
					<p class="faq-answer" id={'answer' + index} style={{display:'none'}}>{faq.answer}</p>
				</button>
			))}
		</div>
	);
}
