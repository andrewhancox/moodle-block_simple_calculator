<?php
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Block simple calculator is defined here.
 *
 * @package     block_simple_calculator
 * @copyright   2020 A K M Safat Shahin <safatshahin@gmail.com>
 * @copyright   2021 Andrew Hancox <andrew_dc_hancox@googlemail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Simple calculator block.
 *
 * @package     block_simple_calculator
 * @copyright   2020 A K M Safat Shahin <safatshahin@gmail.com>
 * @copyright   2021 Andrew Hancox <andrew_dc_hancox@googlemail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_simple_calculator extends block_base {
    /** @var int Display the calculator inline within the block. */
    const DISPLAYMODE_INLINE = 10;
    /** @var int Display the calculator in a popup. */
    const DISPLAYMODE_POPUP = 20;

    /**
     * Initializes class member variables.
     */
    public function init() {
        // Needed by Moodle to differentiate between blocks.
        $this->title = get_string('pluginname', 'block_simple_calculator');
    }

    /**
     * Can you configure this block?
     *
     * @return bool
     */
    public function instance_allow_config() {
        return true;
    }

    /**
     * Initialise any JavaScript required by this block.
     */
    public function get_required_javascript() {
        parent::get_required_javascript();

        $this->page->requires->js_call_amd('block_simple_calculator/simple_calculator', 'init', []);

        if (!empty($this->config->displaymode) && $this->config->displaymode == self::DISPLAYMODE_POPUP) {
            $this->page->requires->js_call_amd('block_simple_calculator/calculatorpopup', 'init');
        }
    }

    /**
     * Returns the block contents.
     *
     * @return stdClass The block contents.
     */
    public function get_content() {

        if ($this->content !== null) {
            return $this->content;
        }
        $renderer = $this->page->get_renderer('block_simple_calculator');
        $this->content = new stdClass();
        $this->content->text = '';

        if (empty($this->config->displaymode) || $this->config->displaymode == self::DISPLAYMODE_INLINE) {
            $this->content->text .= $renderer->render_calculator();
        }

        return $this->content;
    }

    /**
     * Is the block empty? In popup mode the block has no content of its own.
     *
     * @return bool
     */
    public function is_empty() {
        return parent::is_empty() && (!empty($this->config->displaymode) && $this->config->displaymode == self::DISPLAYMODE_POPUP);
    }

    /**
     * Defines configuration data.
     *
     * The function is called immediatly after init().
     */
    public function specialization() {

        // Load user defined title and make sure it's never empty.
        if (empty($this->config->title)) {
            $this->title = get_string('pluginname', 'block_simple_calculator');
        } else {
            $this->title = $this->config->title;
        }
    }

    /**
     * Allow multiple instances in a single course?
     *
     * @return bool True if multiple instances are allowed, false otherwise.
     */
    public function instance_allow_multiple() {
        return true;
    }

    /**
     * Sets the applicable formats for the block.
     *
     * @return string[] Array of pages and permissions.
     */
    public function applicable_formats() {
        return ['all' => true];
    }
}
