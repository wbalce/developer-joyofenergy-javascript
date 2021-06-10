const {
  getLastGivenDayUnixTime,
  getDayFromLastWeekUnixTime,
  getStartAndEndOfLastWeekUnixTimes,
  isWithinPreviousWeekToGivenReferenceTime
} = require('./usage-helpers');

const MOCK_UNIX_TIME_FRIDAY = 1607686125; // Friday, 11 December 2020 11:28:45 GMT+00:00
const MOCK_UNIX_TIMES_PREVIOUS_SUNDAY_MIDNIGHT = 1607212800;
const MOCK_UNIX_TIMES_PREVIOUS_WEEK_MONDAY_MIDNIGHT = 1606694400;
const MOCK_UNIX_TIMES_TWO_PREVIOUS_WEEKS_SUNDAY_MIDNIGHT = 1606608000;

const MONDAY_INTEGER = 1;
const SUNDAY_INTEGER = 0;

describe("usage-helpers", () => {
  it("should get last given day", () => {
    const result = getLastGivenDayUnixTime(MOCK_UNIX_TIME_FRIDAY, SUNDAY_INTEGER);

    expect(result).toBe(MOCK_UNIX_TIMES_PREVIOUS_SUNDAY_MIDNIGHT);
  });

  it("should get given day from last week", () => {
    const result = getDayFromLastWeekUnixTime(MOCK_UNIX_TIME_FRIDAY, MONDAY_INTEGER);

    expect(result).toBe(MOCK_UNIX_TIMES_PREVIOUS_WEEK_MONDAY_MIDNIGHT);
  });

  it("should get start and end of last week", () => {
    const result = getStartAndEndOfLastWeekUnixTimes(MOCK_UNIX_TIME_FRIDAY);

    expect(result).toMatchObject({
      startDayUnixTime: MOCK_UNIX_TIMES_PREVIOUS_WEEK_MONDAY_MIDNIGHT,
      endDayUnixTime: MOCK_UNIX_TIMES_PREVIOUS_SUNDAY_MIDNIGHT
    });
  });

  it("should return true if given unix time is from previous week", () => {
    const result = isWithinPreviousWeekToGivenReferenceTime(MOCK_UNIX_TIME_FRIDAY, MOCK_UNIX_TIMES_PREVIOUS_SUNDAY_MIDNIGHT);

    expect(result).toBe(true);
  });

  it("should return false if given unix time not from previous week", () => {
    const result = isWithinPreviousWeekToGivenReferenceTime(MOCK_UNIX_TIME_FRIDAY, MOCK_UNIX_TIME_FRIDAY);

    expect(result).toBe(false);
  });

  it("should return false if given unix time from two weeks ago", () => {
    const result = isWithinPreviousWeekToGivenReferenceTime(MOCK_UNIX_TIME_FRIDAY, MOCK_UNIX_TIMES_TWO_PREVIOUS_WEEKS_SUNDAY_MIDNIGHT);

    expect(result).toBe(false);
  });
});