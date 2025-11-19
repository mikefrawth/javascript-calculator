// app.js

// Get references to DOM elements
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

// maximum number of digits allowed for display
const MAX_DIGITS = 12;

// Initialize calculator state
let firstValue = null;
let operator = null;
let awaitingNextValue = false;
let justCalculated = false;
let inErrorState = false;

// Helper function for rounding to avoid floating point issues
function roundToPrecision(num) {
  return Math.round(num * 1e12) / 1e12; // 12 decimal places is plenty
}

// Helper function to format number for display
function formatForDisplay(num) {
  let rounded = roundToPrecision(num);
  let text = rounded.toString();

  // If there’s a decimal, strip trailing zeros and an optional trailing dot
  if (text.includes(".")) {
    text = text.replace(/\.?0+$/, "");
  }

  return text;
}

// Helper function to count digits in a string
function countDigits(text) {
  // Count only 0–9, ignore ".", "-", etc.
  return text.replace(/[^0-9]/g, "").length;
}

// Handle backspace key
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

// Keyboard support1
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // DIGITS 0-9
  if (key >= "0" && key <= "9") {
    const btn = keys.querySelector(
      `button[data-action="digit"][data-value="${key}"]`
    );
    if (btn) {
      event.preventDefault();
      btn.click();
    }
    return;
  }

  // DECIMAL POINT
  if (key === ".") {
    const btn = keys.querySelector(
      `button[data-action="digit"][data-value="."]`
    );
    if (btn) {
      event.preventDefault();
      btn.click();
    }
    return;
  }

  // OPERATORS + - * /
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    const btn = keys.querySelector(
      `button[data-action="operator"][data-value="${key}"]`
    );
    if (btn) {
      event.preventDefault();
      btn.click();
    }
    return;
  }

  // ENTER or "=" -> equals
  if (key === "Enter" || key === "=") {
    const btn = keys.querySelector(`button[data-action="equals"]`);
    if (btn) {
      event.preventDefault();
      btn.click();
    }
    return;
  }

  // ESCAPE -> AC (clear)
  if (key === "Escape") {
    const btn = keys.querySelector(`button[data-action="clear"]`);
    if (btn) {
      event.preventDefault();
      btn.click();
    }
    return;
  }

  // BACKSPACE -> delete last digit
  if (key === "Backspace") {
    event.preventDefault();
    handleBackspace();
    return;
  }

  // "%" key -> percent
  if (key === "%") {
    const btn = keys.querySelector(`button[data-action="percent"]`);
    if (btn) {
      event.preventDefault();
      btn.click();
    }
    return;
  }

  // Negate: allow "n"/"N" and F9 as shortcuts
  if (key === "n" || key === "N" || key === "F9") {
    const btn = keys.querySelector(`button[data-action="negate"]`);
    if (btn) {
      event.preventDefault();
      btn.click();
    }
    return;
  }
});

// Function to perform calculations
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
      // APPENDING to an existing number -> enforce digit limit
      const digitCount = countDigits(display.textContent);
      if (digitCount >= MAX_DIGITS) {
        // Too many digits already -> ignore this input
        return;
      }
      display.textContent += value;
    }
  }

  // ---------------------------
  // OPERATORS (+, -, *, /)
  // ---------------------------
  if (action === "operator") {
    const inputValue = parseFloat(display.textContent);

    if (firstValue === null) {
      // first operator press after entering the first number
      firstValue = inputValue;
    } else if (!awaitingNextValue) {
      // we have a full pair → compute intermediate result (chaining)
      firstValue = calculate(firstValue, operator, inputValue);
      display.textContent = formatForDisplay(firstValue);
    }
    // in both cases, set/replace the operator and wait for next number
    operator = value; // value is '+', '-', '*', '/'
    awaitingNextValue = true;
    justCalculated = false; // we’re in the middle of a chain
  }

  // ---------------------------
  // EQUALS
  // ---------------------------
  if (action === "equals") {
    const secondValue = parseFloat(display.textContent);

    if (operator && firstValue !== null && !awaitingNextValue) {
      const result = calculate(firstValue, operator, secondValue);
      display.textContent = formatForDisplay(result);
      firstValue = result;
      operator = null;
      awaitingNextValue = false;
      justCalculated = true;
    }
  }

  // ---------------------------
  // CLEAR (AC)
  // ---------------------------
  if (action === "clear") {
    display.textContent = "0";
    firstValue = null;
    operator = null;
    awaitingNextValue = false;
    justCalculated = false;
  }

  // ---------------------------
  // NEGATE (+/-)
  // ---------------------------
  if (action === "negate") {
    // Don't bother if it's zero or not a number
    if (display.textContent === "0") return;

    if (display.textContent.startsWith("-")) {
      display.textContent = display.textContent.slice(1);
    } else {
      display.textContent = "-" + display.textContent;
    }
  }

  // ---------------------------
  // PERCENT (%)
  // ---------------------------
  if (action === "percent") {
    const currentValue = parseFloat(display.textContent);
    if (isNaN(currentValue)) return;

    let result;

    // Common behavior: if we're in a binary op context,
    // treat percent as "firstValue * current / 100"
    if (firstValue !== null && operator && !awaitingNextValue) {
      result = (firstValue * currentValue) / 100;
    } else {
      // Otherwise, just divide the current number by 100
      result = currentValue / 100;
    }

    display.textContent = formatForDisplay(result);
    // After percent, we consider it a "finished" input
    awaitingNextValue = false;
    justCalculated = true;
  }
});
