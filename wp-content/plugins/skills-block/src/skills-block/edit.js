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
import { Button, PanelBody, TextControl } from '@wordpress/components';

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
	const { skillsList } = attributes; 

	//add new empty skill (for Add button)
	const addSkill = () => {
		const skillsCopy = [...(skillsList || [])];
		skillsCopy.push(' ');
		setAttributes({ skillsList: skillsCopy });
	};
	//update an existing skill by index
	const updateSkill = (index, newValue) => {
		const skillsCopy = [...skillsList];
		skillsCopy[index] = newValue;
		setAttributes({ skillsList: skillsCopy });
	};

	//remove skill by index (for Remove button)
	const removeSkill = (index) => {
		const skillsCopy = skillsList.filter((_, i) => i !== index);
		setAttributes({ skillsList: skillsCopy });
	}
	return (
		<>

			<InspectorControls>
				<PanelBody title={__('Skills Settings', 'skills-block')}>
					{skillsList && skillsList.map((skill, index) => {
						return (<div key={index}>
							<TextControl
								label={__('Skill', 'skills-block')}
								value={skill}
								onChange={(newValue) => updateSkill(index, newValue)}
							/>
							<Button isDestructive onClick={() => removeSkill(index)}>
								{__('Remove Skill', 'skills-block')}
							</Button>
						</div>)})
					}
					<Button  onClick={addSkill}>
						{__('Add Skill', 'skills-block')}
					</Button>

				</PanelBody>
			</InspectorControls>


			<div {...useBlockProps()}>
				{skillsList && skillsList.map((skill, index) => (
					<div class="skill-item">
						<span key={index} class="skill-name">{skill}</span>
					</div>
				))}
			</div>

		</>
	);
}
