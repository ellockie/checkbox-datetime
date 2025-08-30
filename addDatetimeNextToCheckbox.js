function onEdit(e) {
    // --- CONFIG ---
    const SHEET_NAME = "AWS Certified Developer - Associate - UDEMY";
    const CHECK_COL = 10; // A
    const TIME_COL = 12; // B
    const HEADER_ROWS = 3; // number of header rows before data starts
    const TIME_FORMAT = "yyyy-mm-dd hh:mm";

    // Safety checks
    if (!e || !e.range) return;
    const sh = e.range.getSheet();
    if (SHEET_NAME && sh.getName() !== SHEET_NAME) return;

    // Only act if the edit intersects the checkbox column
    const edited = e.range;
    const colStart = edited.getColumn();
    const colEnd = edited.getLastColumn();
    if (CHECK_COL < colStart || CHECK_COL > colEnd) return;

    // Compute the rows we should handle (skip headers)
    const rowStart = Math.max(edited.getRow(), HEADER_ROWS + 1);
    const rowEnd = edited.getLastRow();
    const numRows = rowEnd - rowStart + 1;
    if (numRows < 1) return;

    // Read current checkbox states and existing timestamps in one go
    const checkRange = sh.getRange(rowStart, CHECK_COL, numRows, 1);
    const timeRange = sh.getRange(rowStart, TIME_COL, numRows, 1);
    const checks = checkRange.getValues(); // TRUE/FALSE (booleans)
    const times = timeRange.getValues(); // existing timestamps (or '')

    // Prepare output
    const out = new Array(numRows);
    let anyChange = false;

    for (let i = 0; i < numRows; i++) {
        const isChecked = checks[i][0] === true; // checkbox checked?
        const hasTime = times[i][0] !== "" && times[i][0] != null;

        if (isChecked && !hasTime) {
            out[i] = [new Date()]; // set timestamp once
            anyChange = true;
        } else {
            // Keep whatever is there (sticky timestamp; don’t clear or update)
            out[i] = [times[i][0]];
        }
    }

    if (anyChange) {
        timeRange.setValues(out);
        timeRange.setNumberFormat(TIME_FORMAT);
    }
}
