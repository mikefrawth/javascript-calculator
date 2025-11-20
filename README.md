# Mike’s JavaScript Calculator

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](#)
[![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)](#)
[![Built%20With](https://img.shields.io/badge/built_with-HTML%20%7C%20CSS%20%7C%20JavaScript-orange.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](#)

A clean, responsive, and fully keyboard-accessible calculator built with vanilla JavaScript, HTML, and CSS.  
This project focuses on correctness, usability, and clear architecture.

---

## Features

- **Basic Arithmetic:** `+`, `−`, `×`, `÷`  
- **Chained Calculations:** Continue operations without pressing `=`  
- **Floating-Point Error Handling:** All results rounded safely to avoid JS decimal issues  
- **Formatted Output:** Removes trailing zeros for clean display (`5.2000 → 5.2`)  
- **Digit Limit:** User input capped at 12 digits  
- **Percent Operator:** Supports standalone `%` and operation-context percent (`50 + 10% = 55`)  
- **Negation:** `+/-` toggles sign  
- **Divide-By-Zero Handling:** Shows `"Error"` and locks input until next digit or AC  
- **Full Keyboard Support:** Animations included  
- **Operator Highlighting:** Active operator visually indicated  
- **Button Press Animation:** Mouse + keyboard

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| `0–9` | Enter digit |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` or `=` | Equals |
| `%` | Percent |
| `n`, `N`, or `F9` | Negate (`+/-`) |
| `Escape` | Clear (AC) |
| `Backspace` | Delete last digit |

---

## Project Structure

```text
/ (root)
│
├── index.html
├── style.css
│
├── helpers.js      # Pure helpers: formatting, rounding, animation, UI helpers
├── app.js          # Core calculator state and logic
├── keyboard.js     # Keyboard bindings and keydown handler
└── clicks.js       # Click handler for all calculator buttons
```

---

## Technical Notes

- **Rounding:** All results passed through `roundToPrecision()` to mitigate floating-point errors.  
- **Formatting:** Output cleaned by `formatForDisplay()` to prevent unnecessary decimals or zeros.  
- **Input Guard:** `countDigits()` ensures user input never exceeds 12 digits.  
- **State Machine:**  
  - `firstValue`  
  - `operator`  
  - `awaitingNextValue`  
  - `justCalculated`  
  - `inErrorState`

  This separation keeps logic predictable and allows chained operations.

- **UI State:**  
  `setActiveOperator()` controls operator highlighting.  
  `flashButton()` animates button presses (keyboard + mouse).

- **Architecture Philosophy:**  
  - Strict separation of concerns  
  - No external libraries  
  - Modular JavaScript files  
  - Readable, testable functions

---

## Setup / Installation

No build process or dependencies required.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/javascript-calculator.git
   ```
2. Open `index.html` in any modern browser.

That’s it.

---

## Roadmap (Future Versions)

- Scientific functions (`√`, `x²`, `1/x`, `x^y`)  
- Memory functions (`MC`, `MR`, `M+`, `M−`)  
- Calculation history panel  
- Responsive redesign for mobile  
- Theme system (light/dark mode)  
- Automated test suite  
- ES module conversion  
- Full accessibility audit (ARIA roles + screen reader support)

---

## License

MIT License.
