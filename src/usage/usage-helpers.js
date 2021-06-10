const {
  SUNDAY_INTEGER,
  MONDAY_INTEGER
} = require('./days.constants');

const {
    SECONDS_IN_A_DAY,
    NUMBER_OF_DAYS_IN_A_WEEK
} = require('./times.constants');

const MULTIPLE_FOR_UNIX_TIME_TO_EPOCH = 1000;

const getUnixTimeByNumberOfDaysInThePast = (currentUnixTime, numberOfDaysInThePast) => {
    const lastMidnightUnixTime = new Date(currentUnixTime * MULTIPLE_FOR_UNIX_TIME_TO_EPOCH)
        .setUTCHours(0, 0, 0, 0) / MULTIPLE_FOR_UNIX_TIME_TO_EPOCH;

    return lastMidnightUnixTime - numberOfDaysInThePast * SECONDS_IN_A_DAY;
};

const getPastDayUnixTimeGivenReferenceUnixTime = (currentUnixTime, requiredDayInteger) => {
    const currentDayInteger = (new Date(currentUnixTime * MULTIPLE_FOR_UNIX_TIME_TO_EPOCH)).getUTCDay();

    const difference = currentDayInteger - requiredDayInteger;
    const numberOfDaysBetween = difference < 0
        ? (NUMBER_OF_DAYS_IN_A_WEEK + difference) % NUMBER_OF_DAYS_IN_A_WEEK
        : difference % NUMBER_OF_DAYS_IN_A_WEEK;

    return getUnixTimeByNumberOfDaysInThePast(currentUnixTime, numberOfDaysBetween);
};

const isSunday = (unixTime) => {
    return (new Date(unixTime * MULTIPLE_FOR_UNIX_TIME_TO_EPOCH)).getUTCDay() === SUNDAY_INTEGER;
};

const getSundayLastWeek = (currentUnixTime) => {
    if (isSunday(currentUnixTime)) {
        return getUnixTimeByNumberOfDaysInThePast(currentUnixTime, NUMBER_OF_DAYS_IN_A_WEEK);
    }

    return getPastDayUnixTimeGivenReferenceUnixTime(currentUnixTime, SUNDAY_INTEGER);
};

const getDayFromLastWeekUnixTime = (currentUnixTime, requiredDayInt) => {
    const lastSunday = getSundayLastWeek(currentUnixTime);

    return getPastDayUnixTimeGivenReferenceUnixTime(lastSunday, requiredDayInt);
};

const getStartAndEndOfLastWeekUnixTimes = (currentUnixTime) => {
    const endDayUnixTime = getDayFromLastWeekUnixTime(currentUnixTime, SUNDAY_INTEGER);
    const startDayUnixTime = getDayFromLastWeekUnixTime(currentUnixTime, MONDAY_INTEGER);

    return { startDayUnixTime, endDayUnixTime }
};

const isWithinPreviousWeekToGivenReferenceTime = (currentUnixTime, referenceUnixTime) => {
    const { startDayUnixTime, endDayUnixTime } = getStartAndEndOfLastWeekUnixTimes(currentUnixTime);

    return referenceUnixTime >= startDayUnixTime && referenceUnixTime <= endDayUnixTime;
};

module.exports = {
  getPastDayUnixTimeGivenReferenceUnixTime,
  getDayFromLastWeekUnixTime,
  getStartAndEndOfLastWeekUnixTimes,
  isWithinPreviousWeekToGivenReferenceTime
};