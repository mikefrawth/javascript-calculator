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

// ---------- Keyboard bindings ----------
const keyBindings = {
  // Digits
  0: {
    type: "button",
    selector: `button[data-action="digit"][data-value="0"]`,
  },
  1: {
    type: "button",
    selector: `button[data-action="digit"][data-value="1"]`,
  },
  2: {
    type: "button",
    selector: `button[data-action="digit"][data-value="2"]`,
  },
  3: {
    type: "button",
    selector: `button[data-action="digit"][data-value="3"]`,
  },
  4: {
    type: "button",
    selector: `button[data-action="digit"][data-value="4"]`,
  },
  5: {
    type: "button",
    selector: `button[data-action="digit"][data-value="5"]`,
  },
  6: {
    type: "button",
    selector: `button[data-action="digit"][data-value="6"]`,
  },
  7: {
    type: "button",
    selector: `button[data-action="digit"][data-value="7"]`,
  },
  8: {
    type: "button",
    selector: `button[data-action="digit"][data-value="8"]`,
  },
  9: {
    type: "button",
    selector: `button[data-action="digit"][data-value="9"]`,
  },

  // Decimal
  ".": {
    type: "button",
    selector: `button[data-action="digit"][data-value="."]`,
  },

  // Operators
  "+": {
    type: "button",
    selector: `button[data-action="operator"][data-value="+"]`,
  },
  "-": {
    type: "button",
    selector: `button[data-action="operator"][data-value="-"]`,
  },
  "*": {
    type: "button",
    selector: `button[data-action="operator"][data-value="*"]`,
  },
  "/": {
    type: "button",
    selector: `button[data-action="operator"][data-value="/"]`,
  },

  // Equals
  Enter: { type: "button", selector: `button[data-action="equals"]` },
  "=": { type: "button", selector: `button[data-action="equals"]` },

  // Clear
  Escape: { type: "button", selector: `button[data-action="clear"]` },

  // Percent
  "%": { type: "button", selector: `button[data-action="percent"]` },

  // Negate shortcuts
  n: { type: "button", selector: `button[data-action="negate"]` },
  N: { type: "button", selector: `button[data-action="negate"]` },
  F9: { type: "button", selector: `button[data-action="negate"]` },

  // Special (non-button) actions
  Backspace: { type: "backspace" },
};

// ---------- Keyboard support ----------

document.addEventListener("keydown", (event) => {
  const key = event.key;

  // ---------- Error state guard ----------
  if (inErrorState) {
    // AC
    if (key === "Escape") {
      const btn = keys.querySelector(`button[data-action="clear"]`);
      activateButtonFromKey(event, btn);
      return;
    }

    // DIGITS (start fresh)
    if (key >= "0" && key <= "9") {
      const btn = keys.querySelector(
        `button[data-action="digit"][data-value="${key}"]`
      );
      activateButtonFromKey(event, btn);
      return;
    }

    // Everything else ignored while in error
    event.preventDefault();
    return;
  }

  // ---------- Normal mode: use keyBindings map ----------
  const binding = keyBindings[key];
  if (!binding) {
    return; // key not mapped → ignore
  }

  if (binding.type === "button") {
    const btn = keys.querySelector(binding.selector);
    activateButtonFromKey(event, btn);
    return;
  }

  if (binding.type === "backspace") {
    event.preventDefault();
    handleBackspace();
    return;
  }
});

// ---------- Click events ----------

keys.addEventListener("click", (event) => {
  const button = event.target;
  const action = button.dataset.action;
  const value = button.dataset.value;

  // Ignore clicks that aren’t on a button
  if (!button.matches("button")) return;

  // Animate press
  flashButton(button);

  // If we're in error state:
  // - Only AC clears it
  // - Only digits start a fresh new number
  if (inErrorState) {
    if (action === "clear") {
      // Reset everything normally
      display.textContent = "0";
      firstValue = null;
      operator = null;
      awaitingNextValue = false;
      justCalculated = false;
      inErrorState = false;
      return;
    }

    if (action === "digit") {
      // Reset display and start fresh with this digit
      display.textContent = value;
      firstValue = null;
      operator = null;
      awaitingNextValue = false;
      justCalculated = false;
      inErrorState = false;
      return;
    }

    // Anything else -> ignore
    return;
  }

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
      // we have a full pair -> compute intermediate result (chaining)
      firstValue = calculate(firstValue, operator, inputValue);
      display.textContent =
        firstValue === "Error" ? "Error" : formatForDisplay(firstValue);
    }
    // in both cases, set/replace the operator and wait for next number
    operator = value; // value is '+', '-', '*', '/'
    awaitingNextValue = true;
    justCalculated = false; // we’re in the middle of a chain

    // Update active operator button styling
    setActiveOperator(button);
  }

  // ---------------------------
  // EQUALS
  // ---------------------------
  if (action === "equals") {
    const secondValue = parseFloat(display.textContent);

    if (operator && firstValue !== null && !awaitingNextValue) {
      const result = calculate(firstValue, operator, secondValue);
      display.textContent =
        result === "Error" ? "Error" : formatForDisplay(result);
      firstValue = result;
      operator = null;
      awaitingNextValue = false;
      justCalculated = true;
      // Clear active operator button styling
      setActiveOperator(null);
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
    inErrorState = false;
    // Clear active operator button styling
    setActiveOperator(null);
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

    display.textContent =
      result === "Error" ? "Error" : formatForDisplay(result);
    // After percent, we consider it a "finished" input
    awaitingNextValue = false;
    justCalculated = true;
  }
});
