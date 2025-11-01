// app.js

// Get references to DOM elements
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

// Initialize calculator state
let firstValue = null;
let operator = null;
let awaitingNextValue = false;
let justCalculated = false;

// Handle "key" button clicks
keys.addEventListener("click", (event) => {
  const button = event.target;
  const action = button.dataset.action;
  const value = button.dataset.value;

  // Ignore clicks that aren’t on a button
  if (!button.matches("button")) return;

  // Handle digit buttons
  if (action === "digit") {
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
    operator = value;
    firstValue = parseFloat(display.textContent);
    awaitingNextValue = true;
  }

  // Handle equals button
  if (action === "equals") {
    const secondValue = parseFloat(display.textContent);

    if (operator && firstValue !== null) {
      let result = 0;

      switch (operator) {
        case "+":
          result = firstValue + secondValue;
          break;
        case "-":
          result = firstValue - secondValue;
          break;
        case "*":
          result = firstValue * secondValue;
          break;
        case "/":
          result = firstValue / secondValue;
          break;
      }

      display.textContent = result;
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
  }
});
