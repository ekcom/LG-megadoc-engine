/**
 * Generic utilities for Google Sheets
 * in Google Apps Script
 */


/**
 * Display a pop-up dialog
 */
function alert(message) {
  SpreadsheetApp.getUi().alert(message);
}

/**
 * Gets the value for a single-celled range @p namedRange,
 * or @throws an error if the range DNE or contains multiple cells
 * 
 * @todo Write a runnable test which validates that all possible getNamedValue()s exist and are valid
 */
function getNamedValue(namedRange) {
  const namedRangeObj = getNamedRange(namedRange);
  
  const vals = namedRangeObj.getValues();
  if (vals.length != 1 || vals[0].length != 1) {
    throw new Error("Named range does not contain exactly 1 value");
  }

  // return first (and only) value
  return namedRangeObj.getValue()
}

/**
 * Returns a @link NamedRange
 * or @throws and error if not found
 * 
 * @param string namedRangeLabel
 * 
 * @see https://developers.google.com/apps-script/reference/spreadsheet/named-range#getRange()
 */
function getNamedRange(namedRangeLabel) {
  const namedRange = spreadsheet().getRangeByName(namedRangeLabel);
  if (namedRange === null) {
    throw new Error("Named range not found");
  }
  return namedRange;
}

/**
 * Returns the current Spreadsheet
 * or @throws an error if not attached to a sheet
 * 
 * @see https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
 */
function spreadsheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (spreadsheet === null) {
    throw new Error("Spreadsheet is not attached");
  }
  return spreadsheet;
}