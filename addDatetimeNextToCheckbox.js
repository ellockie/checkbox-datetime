// --- CONFIG ---
const SHEET_NAME = "AWS Certified Developer - Associate - UDEMY";
const RULES = [
    { CHECK_COL: 10, TIME_COL: 12 }, // J → L
];
const HEADER_ROWS = 3; // number of header rows before data starts
const TIME_FORMAT = "yyyy-mm-dd hh:mm";

function onEdit(e) {
    if (!e || !e.range) return;
    const sh = e.range.getSheet();

    // Apply only on the configured sheet (leave SHEET_NAME empty "" to allow any sheet)
    if (SHEET_NAME && sh.getName() !== SHEET_NAME) return;

    const edited = e.range;
    const editColStart = edited.getColumn();
    const editColEnd = edited.getLastColumn();
    const editRowStart = edited.getRow();
    const editRowEnd = edited.getLastRow();

    for (const R of RULES) {
        // Only proceed if the edit intersects the checkbox column for this rule
        if (R.CHECK_COL < editColStart || R.CHECK_COL > editColEnd) continue;

        // Skip header rows
        const rowStart = Math.max(editRowStart, HEADER_ROWS + 1);
        const numRows = editRowEnd - rowStart + 1;
        if (numRows < 1) continue;

        // Read checkbox states and existing timestamps in bulk
        const checks = sh
            .getRange(rowStart, R.CHECK_COL, numRows, 1)
            .getValues(); // TRUE/FALSE
        const times = sh.getRange(rowStart, R.TIME_COL, numRows, 1).getValues(); // Date or ''

        // Prepare output while keeping timestamps sticky (only set if empty)
        const out = new Array(numRows);
        let anyChange = false;

        for (let i = 0; i < numRows; i++) {
            const isChecked = checks[i][0] === true;
            const hasTime = times[i][0] !== "" && times[i][0] != null;

            if (isChecked && !hasTime) {
                out[i] = [new Date()]; // set once
                anyChange = true;
            } else {
                out[i] = [times[i][0]]; // keep existing (including when unchecked)
            }
        }

        if (anyChange) {
            const timeRange = sh.getRange(rowStart, R.TIME_COL, numRows, 1);
            timeRange.setValues(out);
            timeRange.setNumberFormat(TIME_FORMAT);
        }
    }
}
