/**
 * LG MEGADOC 2 ENGINE
 * 
 * Created by Elijah Mock
 * - 4/21/2025 Initial Engine work
 * 
 * @internal
 * - @see https://developers.google.com/apps-script/reference/spreadsheet
 * - $VAL refers to cells with named range VAL.
 *  Typically, it refers to a single-valued range.
 *   - @see getNamedValue
 * 
 * TODO
 * - finish `refreshDatesLastVolunteered`
 * - create clear takes button
 * - create blank template for this week button
 * - create bake button (with current selected into new template filled in)
 */
//import * from "sheetUtils.gs"; // all *.gs files here are auto-imported

/**
 * Adds menu to sheet
 * 
 * Contains various buttons to run scipts
 */
function onOpen() {
  /*
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const entries = [{
    name : "Refresh",
    functionName : "refreshLastUpdate"
  }];
  sheet.addMenu("Refresh", entries);
  */
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Engine")
    .addItem("Refresh activity", "refreshSheetActivity")
    .addSeparator()
    .addSubMenu(ui.createMenu("debug")
      .addItem("curr", "debugAlert")
    )
    .addToUi();
}

function debugAlert() {
  alert(
    //getVolunteerSheetDates().join(";")
    "-"
  );
}

/**
 * Updates the Activity tab
 * with actual data in sheet
 */
function refreshSheetActivity() {
  setWarningIfMissingWeek();

  refreshDatesLastVolunteered();
}

/**
 * Adds note to Stats page
 * if there is a week between $ValStartDate and the current date
 * which does not have a "MM/DD(/YY) Volunteers" sheet
 * and is not exempt from $ValSkipDates
 */
function setWarningIfMissingWeek() {
  const missingDatesSet = getMissingLGDates();
  const missingDatesArr = Array.from(missingDatesSet);
  // sort descending (newest to oldest)
  const datesSorted = missingDatesArr.sort((a, b) => b - a);
  const missingDatesText = datesSorted.map(d => getDisplayDate(d)).join(", ");

  getNamedRange("ScriptMissingWeeks").setValue(missingDatesText);
}

/**
 * Updates the Stats tabs' "Last served (date)" for each category
 * (setup, slides, sound)
 * 
 * @todo TODO
 * 
 * @note
 * Previously: `=IF(ISBLANK($A2), "-", C_GET_LATEST_SERVED_SHEET_DATE($A2, '_utils'!$B$1))`
 */
function refreshDatesLastVolunteered() {
  const namesToLastSetupDate = new Map();
  mapVolunteerSheets((sheet, titleRegexMatch) => {
    // todo
  })
  peopleActivityWriteToColumn(colLastSetup, name => "TODO");
}
