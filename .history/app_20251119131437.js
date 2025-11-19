// app.js

// Get references to DOM elements
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

// Initialize calculator state
let firstValue = null;
let operator = null;
let awaitingNextValue = false;
let justCalculated = false;

// Function to perform calculations
function calculate(a, op, b) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

// Handle "key" button clicks
keys.addEventListener("click", (event) => {
  const button = event.target;
  const action = button.dataset.action;
  const value = button.dataset.value;

  // Ignore clicks that aren’t on a button
  if (!button.matches("button")) return;

  // Handle digit buttons
  if (action === "digit") {
    // Handle decimal separately so we don't get multiple dots
    if (value === ".") {
      if (awaitingNextValue || justCalculated) {
        // Start a new number like "0."
        display.textContent = "0.";
        awaitingNextValue = false;
        justCalculated = false;
      } else if (!display.textContent.includes(".")) {
        display.textContent += ".";
      }
      return; // decimal handled, stop here
    }

    if (awaitingNextValue || justCalculated) {
      display.textContent = value;
      awaitingNextValue = false;
      justCalculated = false;
    } else if (display.textContent === "0") {
      display.textContent = value;
    } else {
      display.textContent += value;
    }
  }

  // Handle operator buttons
  if (action === "operator") {
    const inputValue = parseFloat(display.textContent);

    if (firstValue === null) {
      // first operator press after entering the first number
      firstValue = inputValue;
    } else if (!awaitingNextValue) {
      // we have a full pair → compute intermediate result (chaining)
      firstValue = calculate(firstValue, operator, inputValue);
      display.textContent = String(firstValue);
    }
    // in both cases, set/replace the operator and wait for next number
    operator = value; // value is '+', '-', '*', '/'
    awaitingNextValue = true;
    justCalculated = false; // we’re in the middle of a chain
  }

  // Handle equals button
  if (action === "equals") {
    const secondValue = parseFloat(display.textContent);

    if (operator && firstValue !== null && !awaitingNextValue) {
      const result = calculate(firstValue, operator, secondValue);
      display.textContent = String(result);
      firstValue = result;
      operator = null;
      awaitingNextValue = false;
      justCalculated = true;
    }
  }

  // Handle clear button
  if (action === "clear") {
    display.textContent = "0";
    firstValue = null;
    operator = null;
    awaitingNextValue = false;
    justCalculated = false;
  }
});
