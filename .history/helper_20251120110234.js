// helper.js

// maximum number of digits allowed for display
const MAX_DIGITS = 12;

// ---------- Number / formatting helpers ----------

// round num to avoid floating point issues
function roundToPrecision(num) {
  return Math.round(num * 1e12) / 1e12; // 12 decimal places is plenty
}

// format number for display
function formatForDisplay(num) {
  let rounded = roundToPrecision(num);
  let text = rounded.toString();

  // If there’s a decimal, strip trailing zeros and an optional trailing dot
  if (text.includes(".")) {
    text = text.replace(/\.?0+$/, "");
  }

  return text;
}

// count digits in a string
// for making sure we don’t exceed MAX_DIGITS
function countDigits(text) {
  // Count only 0–9, ignore ".", "-", etc.
  return text.replace(/[^0-9]/g, "").length;
}

// ---------- UI Helpers (button state / animation) ----------

let activeOperatorButton = null;

// set active operator button styling
function setActiveOperator(button) {
  // Clear previous
  if (activeOperatorButton) {
    activeOperatorButton.classList.remove("active");
  }

  activeOperatorButton = button;

  // Set new
  if (button) {
    button.classList.add("active");
  }
}

// flash a button (for keyboard support)
function flashButton(button) {
  if (!button) return;
  button.classList.add("pressed");
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 100);
}
