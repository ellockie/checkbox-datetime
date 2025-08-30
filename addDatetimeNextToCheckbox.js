/* ---------------------- Config ---------------------- */
const SHEET_NAME = "AWS Certified Developer - Associate - UDEMY";
const RULES = [
    { CHECK_COL: 10, TIME_COL: 12 }, // J → L
];
const HEADER_ROWS = 3; // number of header rows before data starts
const TIME_FORMAT = "yyyy-mm-dd hh:mm";

function onEdit(e) {
    if (!isValidEditEvent(e)) return;

    const sh = e.range.getSheet();
    if (!sheetMatchesConfig(sh, SHEET_NAME)) return;

    for (const rule of RULES) {
        handleRuleEdit(sh, e.range, rule, HEADER_ROWS, TIME_FORMAT);
    }
}

/* ---------- Single-responsibility helpers ---------- */

/** Ensure event has essentials */
function isValidEditEvent(e) {
    return e && e.range && e.range.getSheet;
}

/** Limit execution to a specific sheet if configured */
function sheetMatchesConfig(sh, sheetName) {
    return !sheetName || sh.getName() === sheetName;
}

/** Check whether the edited range intersects a specific column */
function editIntersectsColumn(editedRange, col) {
    const cStart = editedRange.getColumn();
    const cEnd = editedRange.getLastColumn();
    return col >= cStart && col <= cEnd;
}

/** Compute the effective data window (skip headers) for the edited rows */
function computeRowWindow(editedRange, headerRows) {
    const start = Math.max(editedRange.getRow(), headerRows + 1);
    const end = editedRange.getLastRow();
    const num = end - start + 1;
    return { rowStart: start, numRows: num > 0 ? num : 0 };
}

/** Read checkbox states and timestamps in bulk */
function readColumns(sh, rowStart, numRows, checkCol, timeCol) {
    const checks = sh.getRange(rowStart, checkCol, numRows, 1).getValues();
    const times = sh.getRange(rowStart, timeCol, numRows, 1).getValues();
    return { checks, times };
}

/**
 * Decide per-row output for timestamps:
 * - If checked and no timestamp -> set now
 * - If unchecked and had timestamp -> clear
 * - Else -> keep as-is
 */
function buildTimestampOutputs(checks, times) {
    const out = new Array(checks.length);
    let anyChange = false;
    let anySetDate = false;

    for (let i = 0; i < checks.length; i++) {
        const isChecked = checks[i][0] === true;
        const curTime = times[i][0];
        const hasTime = curTime !== "" && curTime != null;

        if (isChecked && !hasTime) {
            out[i] = [new Date()];
            anyChange = true;
            anySetDate = true;
        } else if (!isChecked && hasTime) {
            out[i] = [""]; // clear on uncheck
            anyChange = true;
        } else {
            out[i] = [curTime]; // keep as-is
        }
    }
    return { out, anyChange, anySetDate };
}

/** Write outputs and (optionally) format cells when new dates were set */
function applyOutputs(
    sh,
    rowStart,
    numRows,
    timeCol,
    out,
    timeFormat,
    anySetDate
) {
    const range = sh.getRange(rowStart, timeCol, numRows, 1);
    range.setValues(out);
    if (anySetDate) range.setNumberFormat(timeFormat);
}

/** Orchestrate one rule end-to-end */
function handleRuleEdit(sh, editedRange, rule, headerRows, timeFormat) {
    if (!editIntersectsColumn(editedRange, rule.CHECK_COL)) return;

    const { rowStart, numRows } = computeRowWindow(editedRange, headerRows);
    if (numRows < 1) return;

    const { checks, times } = readColumns(
        sh,
        rowStart,
        numRows,
        rule.CHECK_COL,
        rule.TIME_COL
    );
    const { out, anyChange, anySetDate } = buildTimestampOutputs(checks, times);

    if (anyChange)
        applyOutputs(
            sh,
            rowStart,
            numRows,
            rule.TIME_COL,
            out,
            timeFormat,
            anySetDate
        );
}
