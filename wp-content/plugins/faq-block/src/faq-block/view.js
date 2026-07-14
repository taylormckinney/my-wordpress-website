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
 const toggleButtons = document.querySelectorAll('.faq-item button');
 toggleButtons.forEach((button, index) => {
     button.addEventListener('click', () => toggleAnswer(index));
 });

 const answers = document.querySelectorAll('.faq-answer');
 answers.forEach((answer) => {
        answer.style.display = 'none';
 })
function toggleAnswer(index) {
    const question = document.getElementById('question' + index);
    const answer = document.getElementById('answer' + index);
    if (answer.style.display === 'none') {
        answer.style.display = 'inline';
        question.style.display = 'none';
        question.setAttribute('aria-expanded', 'true');
    } else {
        answer.style.display = 'none';
        question.style.display = 'inline';
        question.setAttribute('aria-expanded', 'false');
    }
    console.log('Toggled answer for FAQ ' + (index + 1));
}
/* eslint-enable no-console */
