@block @block_simple_calculator @javascript
Feature: Use the calculator block as a popup
  In order to do quick calculations without the calculator taking up space on the page
  As a teacher or student
  I can add the calculator block in popup mode and open it from a button

  Background:
    Given the following "courses" exist:
      | fullname | shortname |
      | Course 1 | C1        |
    And the following "users" exist:
      | username | firstname | lastname | email                |
      | teacher1 | Teacher   | One      | teacher1@example.com |
      | student1 | Student   | One      | student1@example.com |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | C1     | editingteacher |
      | student1 | C1     | student        |
    And the following "activities" exist:
      | activity | course | idnumber | name      |
      | page     | C1     | page1    | Test page |
    And I log in as "teacher1"
    And I am on "Course 1" course homepage with editing mode on
    And I am on the "Test page" "page activity" page
    And I add the "Calculator" block to the "default" region
    And I configure the "Calculator" block
    And I set the field "Display mode" to "Popup"
    And I press "Save changes"
    And I am on the "Test page" "page activity" page logged in as student1
    And "#data-block-calculator-current-operand" "css_element" should not exist

  Scenario: Open the popup calculator and add two numbers
    When I click on "Open the calculator" "link"
    And I click on "1" "button" in the ".modal-dialog" "css_element"
    And I click on "2" "button" in the ".modal-dialog" "css_element"
    And I click on "+" "button" in the ".modal-dialog" "css_element"
    And I click on "3" "button" in the ".modal-dialog" "css_element"
    And I click on "=" "button" in the ".modal-dialog" "css_element"
    Then I should see "15" in the ".modal-dialog #data-block-calculator-current-operand" "css_element"

  Scenario: Use the keyboard to calculate in the popup calculator
    When I click on "Open the calculator" "link"
    And I type "12*3"
    And I press the enter key
    Then I should see "36" in the ".modal-dialog #data-block-calculator-current-operand" "css_element"
    And I press the backspace key
    And I should not see "36" in the ".modal-dialog #data-block-calculator-current-operand" "css_element"
    And I should see "3" in the ".modal-dialog #data-block-calculator-current-operand" "css_element"
    And I press the delete key
    And I should not see "3" in the ".modal-dialog #data-block-calculator-current-operand" "css_element"
