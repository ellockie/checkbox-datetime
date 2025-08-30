# Google Sheets Checkbox Timestamp Automation

This Apps Script automatically inserts or clears a timestamp in a Google Sheet
based on checkboxes in a specific column.

## Features

- ✅ Works across multiple rows (bulk edits supported)
- ✅ Restricts behavior to a single sheet (`SHEET_NAME`)
- ✅ Supports non-adjacent target columns (e.g. J → L)
- ✅ Respects header rows (doesn’t act on them)
- ✅ Sets timestamp only once (no overwrite)
- ✅ Clears timestamp when checkbox is unchecked

## Configuration

Adjust the constants at the top of the script:

```javascript
// --- CONFIG ---
const SHEET_NAME  = "AWS Certified Developer - Associate - UDEMY"; // sheet name
const RULES = [
  { CHECK_COL: 10, TIME_COL: 12 }, // example: J → L
];
const HEADER_ROWS = 3;                        // number of header rows
const TIME_FORMAT = "yyyy-mm-dd hh:mm";       // timestamp format
````

* **SHEET\_NAME**: Name of the sheet to run on (leave `""` to allow any sheet).
* **RULES**: List of `{ CHECK_COL, TIME_COL }` pairs to define which columns contain checkboxes and which columns should receive timestamps.
* **HEADER\_ROWS**: Number of header rows before data begins (script ignores these).
* **TIME\_FORMAT**: Date/time format applied to new timestamps.

## Behavior

* When a checkbox is **checked**, a timestamp is added to the target cell **only if empty**.
* When a checkbox is **unchecked**, the timestamp is **cleared**.
* If a timestamp already exists, checking again will **not overwrite it**.

## Installation

1. Open your Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Paste the full script (`Code.gs`) into the editor.
4. Save the project.
5. Reload the sheet — the script will run automatically on edits (`onEdit`).

## Example

If you configure:

```javascript
const RULES = [
  { CHECK_COL: 10, TIME_COL: 12 }, // Column J → Column L
];
```

* Checking a box in **Column J** will add a timestamp to **Column L** (same row).
* Unchecking it will clear the timestamp.

## Notes

* The script clears values on uncheck. If you want timestamps to remain permanent (“sticky”), adjust the logic in `buildTimestampOutputs`.
* Timestamps overwrite any existing **formula** in the target cell when cleared. If you need to preserve formulas, adapt the script.
* For multiple checkbox/timestamp pairs, add more entries in the `RULES` array.

---
