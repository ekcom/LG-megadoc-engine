/**
 * Functions tightly coupled to the `activitySheetName` ("People - activity") sheet
 */


function getPeopleActivitySheet() {
  const a = spreadsheet().getSheetByName(activitySheetName);
  if (a === null) throw new Error("Activity sheet not found in sheet!");
  return a;
}

/**
 * Non-data rows at the beginning of the sheet
 */
const peopleActivitySheetNumberOfHeaderRows = 2;

/**
 * .
 */
function getPeopleActivityRange() {
  return getPeopleActivitySheet().getDataRange();
}

const colLastSetup = "Last served (date) - setup";
const colLastSlides = "Last served (date) - slides";
const colLastSound = "Last served (date) - sound";
/**
 * The ID column
 * 
 * If blank, row is invalid/not used
 */
const colId = "Name (first and last)";

/**
 * Writes to @p columnName for every row in people activity sheet
 * based on @p f, a function which takes **id** (name) as an input
 * and must return a string.
 * 
 * @todo optimize by using a range to write all at once
 */
function peopleActivityWriteToColumn(columnName, f) {
  const range = getPeopleActivityRange();
  let rowIdx = peopleActivitySheetNumberOfHeaderRows - 1;
  for (const personRow of range.getValues().slice(peopleActivitySheetNumberOfHeaderRows)) {
    ++rowIdx;
    const id = personRow[personRowIndexOf(colId)];
    if (id === "") {
      // not a valid data row
      continue;
    }

    // can't merely personRow[personRowIndexOf(columnName)] = f(id);
    // https://developers.google.com/apps-script/reference/spreadsheet/range#offsetrowoffset,-columnoffset,-numrows,-numcolumns
    range.offset(rowIdx, personRowIndexOf(columnName), 1, 1).setValue(f(id));
  }
}

/**
 * Returns index of a row for a person activity
 * 
 * @note Currently, matches the column name (row 2 labels)
 */
function personRowIndexOf(indexName) {
  switch (indexName) {
    case "Name (first and last)": return 0;
    case "Notes": return 1;
    case "Take? - setup": return 2;
    case "Target next serve (weeks) - setup": return 3;
    case "Competency - setup": return 4;
    case "Last served (weeks) - setup": return 5;
    case "Last served (date) - setup": return 6;
    case "[Desired serve (weeks)] - setup": return 7;
    case "Take? - slides": return 8;
    case "Target next serve (weeks) - slides": return 9;
    case "Competency - slides": return 10;
    case "Last served (weeks) - slides": return 11;
    case "Last served (date) - slides": return 12;
    case "[Desired serve (weeks)] - slides": return 13;
    case "Take? - sound": return 14;
    case "Target next serve (weeks) - sound": return 15;
    case "Competency - sound": return 16;
    case "Last served (weeks) - sound": return 17;
    case "Last served (date) - sound": return 18;
    case "[Desired serve (weeks)] - sound": return 19;
    default:
      throw new Error("Index name not found");
  }
}