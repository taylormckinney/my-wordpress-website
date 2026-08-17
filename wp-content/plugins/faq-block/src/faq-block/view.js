/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
const toggleButtons = document.querySelectorAll('.faq-item');
toggleButtons.forEach((button, index) => {
    button.addEventListener('click', () => toggleAnswer(index));
});

const answers = document.querySelectorAll('.faq-answer');
answers.forEach((answer) => {
    answer.style.display = 'none';
})
function toggleAnswer(index) {


    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, i) => { ///loops through all faq items to un-toggle any other open answers
        const question = item.firstElementChild;
        const answer = item.lastElementChild;
        if (i == index && answer.style.display === 'none') {
            const style = window.getComputedStyle(item);
            const currentWidth = style.width; //enforce current width so that the item doesn't resize when the answer is toggled

            question.classList.remove('faq-question');
            question.classList.add('faq-question-toggled');
            question.setAttribute('aria-expanded', 'true');
            item.classList.add('selected');
            item.style.maxWidth = currentWidth;
            item.style.minWidth = currentWidth;
            answer.style.display = 'inline';
        }
        else {
            question.classList.remove('faq-question-toggled');
            question.classList.add('faq-question');
            question.setAttribute('aria-expanded', 'false');
            item.classList.remove('selected');
            item.style.maxWidth = 'auto';
            item.style.minWidth = 'auto';
            answer.style.display = 'none';
        }
    });

}
/* eslint-enable no-console */
