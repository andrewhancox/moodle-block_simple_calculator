@block @block_simple_calculator @javascript
Feature: Use the calculator block inline in the sidebar of an activity
  In order to do quick calculations while working on an activity
  As a teacher or student
  I can add the calculator block to an activity's sidebar and use it

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
    And I add the "Calculator" block
    And I configure the "Calculator" block
    And I set the field "Display mode" to "Inline"
    And I press "Save changes"
    And I am on the "Test page" "page activity" page logged in as student1

  Scenario: Perform each mathematical operation in the inline calculator
    # Addition.
    When I click on "1" "button" in the "Calculator" "block"
    And I click on "2" "button" in the "Calculator" "block"
    And I click on "+" "button" in the "Calculator" "block"
    And I click on "3" "button" in the "Calculator" "block"
    And I click on "=" "button" in the "Calculator" "block"
    Then I should see "15" in the "#data-block-calculator-current-operand" "css_element"
    # Subtraction.
    And I click on "AC" "button" in the "Calculator" "block"
    And I click on "9" "button" in the "Calculator" "block"
    And I click on "-" "button" in the "Calculator" "block"
    And I click on "4" "button" in the "Calculator" "block"
    And I click on "=" "button" in the "Calculator" "block"
    And I should see "5" in the "#data-block-calculator-current-operand" "css_element"
    # Multiplication.
    And I click on "AC" "button" in the "Calculator" "block"
    And I click on "6" "button" in the "Calculator" "block"
    And I click on "*" "button" in the "Calculator" "block"
    And I click on "7" "button" in the "Calculator" "block"
    And I click on "=" "button" in the "Calculator" "block"
    And I should see "42" in the "#data-block-calculator-current-operand" "css_element"
    # Division, with a decimal result.
    And I click on "AC" "button" in the "Calculator" "block"
    And I click on "9" "button" in the "Calculator" "block"
    And I click on "÷" "button" in the "Calculator" "block"
    And I click on "2" "button" in the "Calculator" "block"
    And I click on "=" "button" in the "Calculator" "block"
    And I should see "4.5" in the "#data-block-calculator-current-operand" "css_element"
    # Decimal input.
    And I click on "AC" "button" in the "Calculator" "block"
    And I click on "1" "button" in the "Calculator" "block"
    And I click on "." "button" in the "Calculator" "block"
    And I click on "5" "button" in the "Calculator" "block"
    And I click on "+" "button" in the "Calculator" "block"
    And I click on "1" "button" in the "Calculator" "block"
    And I click on "=" "button" in the "Calculator" "block"
    And I should see "2.5" in the "#data-block-calculator-current-operand" "css_element"

  Scenario: Chain operations and correct input in the inline calculator
    # Operations are evaluated left to right as each operator is pressed: (2 + 3) * 4.
    When I click on "2" "button" in the "Calculator" "block"
    And I click on "+" "button" in the "Calculator" "block"
    And I click on "3" "button" in the "Calculator" "block"
    And I click on "*" "button" in the "Calculator" "block"
    Then I should see "5*" in the "#data-block-calculator-previous-operand" "css_element"
    And I click on "4" "button" in the "Calculator" "block"
    And I click on "=" "button" in the "Calculator" "block"
    And I should see "20" in the "#data-block-calculator-current-operand" "css_element"
    # DEL removes the last digit entered.
    And I click on "AC" "button" in the "Calculator" "block"
    And I click on "1" "button" in the "Calculator" "block"
    And I click on "2" "button" in the "Calculator" "block"
    And I click on "3" "button" in the "Calculator" "block"
    And I click on "DEL" "button" in the "Calculator" "block"
    And I should see "12" in the "#data-block-calculator-current-operand" "css_element"
    And I should not see "123" in the "#data-block-calculator-current-operand" "css_element"
    # AC clears both the current entry and the pending operation.
    And I click on "+" "button" in the "Calculator" "block"
    And I click on "7" "button" in the "Calculator" "block"
    And I should see "12+" in the "#data-block-calculator-previous-operand" "css_element"
    And I click on "AC" "button" in the "Calculator" "block"
    And I should not see "12" in the "#data-block-calculator-previous-operand" "css_element"
    And I should not see "7" in the "#data-block-calculator-current-operand" "css_element"
    # A sum after AC is not affected by the cleared values.
    And I click on "8" "button" in the "Calculator" "block"
    And I click on "=" "button" in the "Calculator" "block"
    And I should see "8" in the "#data-block-calculator-current-operand" "css_element"
    And I should not see "20" in the "#data-block-calculator-current-operand" "css_element"
