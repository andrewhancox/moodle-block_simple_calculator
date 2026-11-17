// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Adds a button to the page that opens the calculator in a draggable popup.
 *
 * @module     block_simple_calculator/calculatorpopup
 * @copyright  2021 Andrew Hancox <andrew_dc_hancox@googlemail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from 'core/templates';
import Notification from 'core/notification';
import Modal from 'core/modal';
import ModalEvents from 'core/modal_events';

/**
 * Let the user move the popup by dragging its header.
 *
 * @param {HTMLElement} root The modal's root element.
 */
const makeDraggable = (root) => {
    const header = root.querySelector('.modal-header');
    const dialog = root.querySelector('.modal-dialog');
    if (!header || !dialog) {
        return;
    }
    header.style.cursor = 'move';

    let offsetX = 0;
    let offsetY = 0;
    let startX = 0;
    let startY = 0;

    header.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('button')) {
            return;
        }
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        header.setPointerCapture(e.pointerId);
    });
    header.addEventListener('pointermove', (e) => {
        if (!header.hasPointerCapture(e.pointerId)) {
            return;
        }
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        dialog.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    header.addEventListener('pointerup', (e) => {
        if (header.hasPointerCapture(e.pointerId)) {
            header.releasePointerCapture(e.pointerId);
        }
    });
};

/**
 * Press the calculator button bound to a key, if there is one on the page.
 *
 * @param {KeyboardEvent} e The key press.
 */
const handleKey = (e) => {
    const key = e.key === 'Enter' ? '=' : e.key;
    document.querySelectorAll(`[data-keybinding="${CSS.escape(key)}"]`).forEach((button) => button.click());
};

/**
 * Add the popup button to the page and open the calculator when it is clicked.
 */
export const init = () => {
    Templates.render('block_simple_calculator/popupbutton', {}).then((html) => {
        const footer = document.getElementById('page-footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', html);
        }
        return html;
    }).catch(Notification.exception);

    document.addEventListener('keydown', handleKey);

    Templates.render('block_simple_calculator/simple_calculator', {}).then((calculator) => {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#block-calculator-output-popupbutton')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();

            Modal.create({
                title: '',
                body: calculator,
            }).then((modal) => {
                modal.show();
                makeDraggable(modal.getRoot()[0]);

                // Modal events are fired through the modal's own API, so listen with it too.
                modal.getRoot().on(ModalEvents.hidden, () => {
                    document.querySelectorAll('[data-keybinding="Delete"]').forEach((button) => button.click());
                    modal.destroy();
                });
                return modal;
            }).catch(Notification.exception);
        });
        return calculator;
    }).catch(Notification.exception);
};
