/**
 * Helper functions
 * (specific to this app)
 */


/**
 * Returns an array of dates expected
 * to have had LGs from $ValStartDate to the current date (inclusive),
 * based on $ValLGDayOfWeekNumerical
 * 
 * @todo handle invalid $ValLGDayOfWeekNumerical
 */
function getExpectedLGDates() {
  // not necessarily first date of LG, but first date in range
  const startDate = new Date(getNamedValue("ValStartDate"));
  const endDate = new Date();
  const dayOfWeek = Number(getNamedValue("ValLGDayOfWeekNumerical"));

  // normalize times
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let currentDate = startDate;
  // init to first occurrence
  const offsetToFirstLG = (dayOfWeek - currentDate.getDay() + 7) % 7;
  currentDate.setDate(currentDate.getDate() + offsetToFirstLG);

  const out = [];
  while (currentDate <= endDate) {
    out.push(new Date(currentDate));
    // jump one week
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return out;
}

/**
 * Returns a set of dates that were expected to have LGs
 * but do not have associated sheets.
 * 
 * Does not include the upcoming week.
 */
function getMissingLGDates() {
  const expectedDates = getExpectedLGDates();
  const actualDates = getVolunteerSheetDates();
  const skipDates = ifDateToMMDDYYYY(getNamedValue("ValSkipDates")) // in case Date
    .split(",").map(s => s.trim())
    .map(s => addYearToStringIfNotPresent(s))
    .map(s => new Date(s));
  
  // assume that all dates are normalized to 0:0:0 because they only have dates, not times
  // note that sets do not work here
  // expectedDates - actualDates - skipDates
  return expectedDates.filter(d =>
    !actualDates.some(d2 => d.getTime() === d2.getTime())
    && !skipDates.some(d2 => d.getTime() === d2.getTime())
  );
}

/**
 * Returns a list of all of the volunteer sheets
 * which match in name
 * 
 * @see mapVolunteerSheets
 */
function getVolunteerSheets() {
  const regex = getVolunteerSheetNameRegex();
  const volunteerSheets = [];
  for (sheet of spreadsheet().getSheets()) {
    const match = sheet.getName().match(regex);
    if (match) {
      volunteerSheets.push(sheet);
    }
  }
  return volunteerSheets;
}

/**
 * Returns the an array of the output of @p f
 * applied to every sheet
 * with the input variables `(sheet, titleRegexMatch)`
 * 
 * @see getVolunteerSheets
 */
function mapVolunteerSheets(f) {
  const out = [];
  const regex = getVolunteerSheetNameRegex();
  for (sheet of spreadsheet().getSheets()) {
    const match = sheet.getName().match(regex);
    if (!match) {
      // not a valid sheet
      continue;
    }
    out.push(f(sheet, match));
  }
  return out;
}

/**
 * Returns an array of all of the dates
 * of valid volunteer sheets
 * 
 * @remark Not necessarily sorted.
 */
function getVolunteerSheetDates() {
  return mapVolunteerSheets((sheet, regex) => getDateFromSheetNameRegex(regex));
}
/**
 * @todo TODO
 */
function getVolunteerSheetForDate(dateObj) {
  throw new Error("Not implemented.");
}

/**
 * @internal
 * Gets the regex to match volunteer sheets.
 * 
 * Mathces `mM/dD(/yyYY) Volunteers.*`
 */
function getVolunteerSheetNameRegex() {
  return /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))? Volunteers/i;
}

/**
 * Returns a parsed @link Date object
 * from the regex matching the name of a sheet.
 * 
 * Assumes the passed regexMatch is valid.
 * 
 * Tightly coupled with @link getVolunteerSheetNameRegex
 */
function getDateFromSheetNameRegex(regexMatch) {
  const month = parseInt(regexMatch[1], 10);
  const day = parseInt(regexMatch[2], 10);
  const year = (() => {
    if (regexMatch.length > 3 && regexMatch[3] !== undefined) {
      const yyYY = parseInt(regexMatch[3], 10);
      if (yyYY < 100) {
        // assume a two-digit year is in the 2000s.
        return 2000 + yyYY;
      } else {
        return yyYY;
      }
    } else {
      // assume current year
      return new Date().getFullYear();
    }
  })();

  return new Date(year, month - 1, day);
}

/**
 * Converts mM/dD(/yyYY) to mM/dD/yyYY
 * with a default yyYY of the current year
 */
function addYearToStringIfNotPresent(dateStr) {
  const chunks = dateStr.split("/");
  if (chunks.length === 3) {
    return dateStr;
  }
  // assert chunks.length == 2 (mM/dD)
  return `${chunks[0]}/${chunks[1]}/${new Date().getFullYear()}`;
}

/**
 * Returns a user-displayable date
 * in the standard format for this sheet,
 * MM/DD/YY
 * 
 * @todo use closure to cache formatter object
 */
function getDisplayDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).format(date);
}