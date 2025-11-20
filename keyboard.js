// keyboard.js

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
