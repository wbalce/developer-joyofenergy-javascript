const {
  getLastGivenDayUnixTime,
  getDayFromLastWeekUnixTime,
  getStartAndEndOfLastWeekUnixTimes
} = require('./usage-helpers');

const mockUnixTimes = {
  reference: 1607686125, // Friday, 11 December 2020 11:28:45 GMT+00:00
  previousSunday: 1607212800, // Sunday, 06 December 2020 00:00:00 GMT+00:00
  previousWeekMonday: 1606694400, // Monday, 30 November 2020 00:00:00 GMT+00:00
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
});