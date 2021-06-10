const {
  getLastGivenDayUnixTime,
  getDayFromLastWeekUnixTime
} = require('./usage-helpers');

describe("usage-helpers", () => {
  it("should get last given day", () => {
    const referenceUnixTime = 1607686125; // Friday, 11 December 2020 11:28:45 GMT+00:00
    const lastSundayUnixTime = 1607212800; // Sunday, 06 December 2020 00:00:00 GMT+00:00

    const result = getLastGivenDayUnixTime(referenceUnixTime, 0);

    expect(result).toBe(lastSundayUnixTime);
  });

  it("should get given day from last week", () => {
    const referenceUnixTime = 1607686125; // Friday, 11 December 2020 11:28:45 GMT+00:00
    const lastMondayUnixTime = 1606694400; // Monday, 30 November 2020 00:00:00 GMT+00:00
    
    const result = getDayFromLastWeekUnixTime(referenceUnixTime, 1);

    expect(result).toBe(lastMondayUnixTime);
  });
});