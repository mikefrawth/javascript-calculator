// app.js

// Get references to DOM elements
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

// Initialize calculator state
let firstValue = null;
let operator = null;
let awaitingNextValue = false;

// Handle "key" button clicks
keys.addEventListener("click", (event) => {
  const button = event.target;
  const action = button.dataset.action;
  const value = button.dataset.value;

  // Ignore clicks that aren’t on a button
  if (!button.matches("button")) return;

  // Handle digit buttons
  if (action === "digit") {
    if (waitingForSecondValue) {
      display.textContent = value;
      waitingForSecondValue = false;
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
    waitingForSecondValue = true;
  }
});
