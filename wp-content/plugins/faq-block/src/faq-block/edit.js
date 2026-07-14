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
import { Dashicon, Flex, FlexItem, Button, PanelBody, TextControl, Divider } from '@wordpress/components';

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
	const { faqList } = attributes;

	const addFaq = () => {
		const faqCopy = [...(faqList || [])];
		faqCopy.push({ question: '', answer: '' });
		setAttributes({ faqList: faqCopy });
	}

	const updateFaq = (index, field, newValue) => {
		const faqCopy = [...faqList];
		faqCopy[index][field] = newValue;
		setAttributes({ faqList: faqCopy });
	}

	const removeFaq = (index) => {
		const faqCopy = faqList.filter((_, i) => i !== index);
		setAttributes({ faqList: faqCopy });
	}
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('FAQ Settings', 'faq-block')}
					initialOpen={true}
				>
					{faqList && faqList.map((faq, index) => (
						<>
							<TextControl
								key={index}
								label={__('Question ' + (index + 1), 'faq-block')}
								value={faq.question}
								onChange={(value) => updateFaq(index, 'question', value)}
							/>
							<TextControl
								key={index}
								label={__('Answer ' + (index + 1), 'faq-block')}
								value={faq.answer}
								onChange={(value) => updateFaq(index, 'answer', value)}
							/>
							<Button isDestructive onClick={() => removeFaq(index)}>
								<Dashicon icon="remove" style={{marginRight: '5px'}}/>
								{__('Remove FAQ ' + (index + 1), 'faq-block')}
							</Button>
						</>
					))}
					<Button onClick={() => addFaq()}>
						<Dashicon icon="insert" style={{marginRight: '5px'}}/>
						{__('Add a new FAQ', 'faq-block')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				{faqList && faqList.map((faq, index) => (
					<div class="faq-item" key={index}>
						<span class="faq-question" id={'question' + index}>{faq.question}</span>
						<span class="faq-answer" id={'answer' + index}>{faq.answer}</span>
					</div>
				))}
			</div>
		</>
	);
}
