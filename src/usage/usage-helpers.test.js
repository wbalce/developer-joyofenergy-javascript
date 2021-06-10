const {
  getLastGivenDayUnixTime,
  getDayFromLastWeekUnixTime,
  getStartAndEndOfLastWeekUnixTimes,
  isWithinPreviousWeekToGivenReferenceTime
} = require('./usage-helpers');

const mockUnixTimes = {
  reference: 1607686125, // Friday, 11 December 2020 11:28:45 GMT+00:00
  previousSunday: 1607212800, // Sunday, 06 December 2020 00:00:00 GMT+00:00
  previousWeekMonday: 1606694400, // Monday, 30 November 2020 00:00:00 GMT+00:00
  twoPreviousWeeksSunday: 1606608000 // Sunday, 29 November 2020 00:00:00 GMT+00:00
};

describe("usage-helpers", () => {
  it("should get last given day", () => {
    const result = getLastGivenDayUnixTime(mockUnixTimes.reference, 0);

    expect(result).toBe(mockUnixTimes.previousSunday);
  });

  it("should get given day from last week", () => {
    const result = getDayFromLastWeekUnixTime(mockUnixTimes.reference, 1);

    expect(result).toBe(mockUnixTimes.previousWeekMonday);
  });

  it("should get start and end of last week", () => {
    const result = getStartAndEndOfLastWeekUnixTimes(mockUnixTimes.reference);

    expect(result).toMatchObject({
      startDayUnixTime: mockUnixTimes.previousWeekMonday,
      endDayUnixTime: mockUnixTimes.previousSunday
    });
  });

  it("should return true if given unix time is from previous week", () => {
    const result = isWithinPreviousWeekToGivenReferenceTime(mockUnixTimes.reference, mockUnixTimes.previousSunday);

    expect(result).toBe(true);
  });

  it("should return false if given unix time not from previous week", () => {
    const result = isWithinPreviousWeekToGivenReferenceTime(mockUnixTimes.reference, mockUnixTimes.reference);

    expect(result).toBe(false);
  });

  it("should return false if given unix time from two weeks ago", () => {
    const result = isWithinPreviousWeekToGivenReferenceTime(mockUnixTimes.reference, mockUnixTimes.twoPreviousWeeksSunday);

    expect(result).toBe(false);
  });
});