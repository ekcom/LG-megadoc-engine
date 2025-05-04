/**
 * @remark for intents here, d1 === d2 would probably suffice
 */
function datesAreSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

/**
 * Converts an array to a string
 * with nice separation
 */
function arrayToStringPretty(arr) {
  return new Intl.ListFormat("en", {
    style: "short",
    type: "conjunction",
  })
}

/**
 * Converts to MM/DD/YYYY string
 * if is a date
 */
function ifDateToMMDDYYYY(a) {
  if (a instanceof Date) {
    return `${(1 + a.getMonth()).toString().padStart(2, '0')}/${a.getDate().toString().padStart(2, '0')}/${a.getFullYear()}`
  }
  return a;
}