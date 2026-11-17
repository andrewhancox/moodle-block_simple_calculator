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
 * Calculator logic shared by the inline and popup display modes.
 *
 * @module     block_simple_calculator/simple_calculator
 * @copyright  2020 A K M Safat Shahin <safatshahin@gmail.com>
 * @copyright  2021 Andrew Hancox <andrew_dc_hancox@googlemail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

let initialised = false;
let currentOperand = '';
let previousOperand = '';
let operation = null;

/**
 * Show the current state of the calculation.
 */
const updateDisplay = () => {
    const current = document.getElementById('data-block-calculator-current-operand');
    const previous = document.getElementById('data-block-calculator-previous-operand');
    if (current) {
        current.textContent = currentOperand;
    }
    if (previous) {
        previous.textContent = operation ? previousOperand + operation : '';
    }
};

/**
 * Apply the pending operation to the previous and current operands.
 *
 * @param {Boolean} finished True when = was pressed, which also clears the pending operation.
 */
const calculate = (finished) => {
    const previous = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    let result;
    if (operation === '+') {
        result = previous + current;
    } else if (operation === '-') {
        result = previous - current;
    } else if (operation === '*') {
        result = previous * current;
    } else if (operation === '÷') {
        result = previous / current;
    } else {
        return;
    }
    currentOperand = result;
    if (finished) {
        operation = null;
        previousOperand = '';
    }
};

/**
 * Handle a number or decimal point button.
 *
 * @param {String} number The digit or decimal point pressed.
 */
const pressNumber = (number) => {
    if (number !== '.' || !currentOperand.toString().includes('.')) {
        currentOperand = currentOperand.toString() + number;
    }
    updateDisplay();
};

/**
 * Handle an operation button.
 *
 * @param {String} newOperation The operation pressed.
 */
const pressOperation = (newOperation) => {
    if (operation !== null && currentOperand !== '' && previousOperand !== '') {
        calculate(false);
        previousOperand = currentOperand;
        currentOperand = '';
        updateDisplay();
    }
    operation = newOperation;
    if (currentOperand !== '') {
        if (previousOperand !== '') {
            calculate(false);
        }
        previousOperand = currentOperand;
        currentOperand = '';
        updateDisplay();
    } else if (previousOperand !== '') {
        updateDisplay();
    }
};

/**
 * Handle the equals button.
 */
const pressEquals = () => {
    if (currentOperand !== '') {
        if (previousOperand !== '') {
            calculate(true);
        }
        updateDisplay();
    }
};

/**
 * Clear the whole calculation.
 */
const clearAll = () => {
    currentOperand = '';
    previousOperand = '';
    operation = null;
    updateDisplay();
};

/**
 * Remove the last character of the current entry.
 */
const deleteLast = () => {
    currentOperand = currentOperand.toString().slice(0, -1);
    updateDisplay();
};

/**
 * Listen for clicks on the calculator buttons.
 */
export const init = () => {
    if (initialised) {
        return;
    }
    initialised = true;

    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) {
            return;
        }
        const value = button.textContent.trim();
        if (button.classList.contains('data-calculator-number')) {
            pressNumber(value);
        } else if (button.classList.contains('data-calculator-operation')) {
            pressOperation(value);
        } else if (button.classList.contains('data-calculator-equals')) {
            pressEquals();
        } else if (button.classList.contains('data-calculator-all-clear')) {
            clearAll();
        } else if (button.classList.contains('data-calculator-delete')) {
            deleteLast();
        }
    });
};
