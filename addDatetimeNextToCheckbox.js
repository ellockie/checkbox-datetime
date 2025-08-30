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
    const edited = e.range;

    for (const R of RULES) {
        if (
            R.CHECK_COL < edited.getColumn() ||
            R.CHECK_COL > edited.getLastColumn()
        )
            continue;

        const HEADER_ROWS = 1;
        const rowStart = Math.max(edited.getRow(), HEADER_ROWS + 1);
        const rowEnd = edited.getLastRow();
        const numRows = rowEnd - rowStart + 1;
        if (numRows < 1) continue;

        const checks = sh
            .getRange(rowStart, R.CHECK_COL, numRows, 1)
            .getValues();
        const times = sh.getRange(rowStart, R.TIME_COL, numRows, 1).getValues();
        const out = new Array(numRows);
        let anyChange = false;

        for (let i = 0; i < numRows; i++) {
            const isChecked = checks[i][0] === true;
            const hasTime = times[i][0] !== "" && times[i][0] != null;
            if (isChecked && !hasTime) {
                out[i] = [new Date()];
                anyChange = true;
            } else {
                out[i] = [times[i][0]];
            }
        }
        if (anyChange) {
            const timeRange = sh.getRange(rowStart, R.TIME_COL, numRows, 1);
            timeRange.setValues(out).setNumberFormat(TIME_FORMAT);
        }
    }
}
