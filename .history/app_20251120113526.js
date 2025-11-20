// app.js

// ---------- DOM references ----------
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

// ---------- Calculator state ----------
let firstValue = null;
let operator = null;
let awaitingNextValue = false;
let justCalculated = false;
let inErrorState = false;

// ---------- Core logic ----------

// perform calculations
function calculate(a, op, b) {
  let result;

  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = b === 0 ? NaN : a / b;
      break;
    default:
      result = b;
  }

  // Fix floating point errors
  result = roundToPrecision(result);

  if (!isFinite(result) || isNaN(result)) {
    inErrorState = true;
    return "Error";
  }

  return result;
}

function handleBackspace() {
  // If we're waiting for the next value (just pressed an operator),
  // don't backspace the operator – do nothing.
  if (awaitingNextValue) return;

  // If we just finished a calculation, allow editing that result
  if (justCalculated) {
    justCalculated = false;
  }

  let text = display.textContent;

  // If we're down to a single digit (or "-x" becoming just "-"), reset to 0
  if (text.length <= 1 || (text.length === 2 && text.startsWith("-"))) {
    display.textContent = "0";
    return;
  }

  // Otherwise, remove last character
  text = text.slice(0, -1);
  display.textContent = text;
}
