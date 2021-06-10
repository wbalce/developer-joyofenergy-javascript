const {
  SUNDAY_INTEGER,
  MONDAY_INTEGER
} = require('./days.constants');

const NUMBER_OF_DAYS_IN_A_WEEK = 7;
const NUMBER_OF_SECONDS_IN_A_MINUTE = 60;
const NUMBER_OF_MINUTES_IN_AN_HOUR = 60;
const NUMBER_OF_HOURS_IN_A_DAY = 24;
const MULTIPLE_FOR_UNIX_TIME_TO_EPOCH = 1000;

const getUnixTimeByNumberOfDaysInThePast = (currentUnixTime, numberOfDaysInThePast) => {
    const secondsIn24Hours = NUMBER_OF_SECONDS_IN_A_MINUTE * NUMBER_OF_MINUTES_IN_AN_HOUR * NUMBER_OF_HOURS_IN_A_DAY;
    const lastMidnightUnixTime = new Date(currentUnixTime * MULTIPLE_FOR_UNIX_TIME_TO_EPOCH)
        .setUTCHours(0, 0, 0, 0) / MULTIPLE_FOR_UNIX_TIME_TO_EPOCH;

    return lastMidnightUnixTime - numberOfDaysInThePast * secondsIn24Hours;
};

const getLastGivenDayUnixTime = (currentUnixTime, requiredDayInteger) => {
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

    return getLastGivenDayUnixTime(currentUnixTime, SUNDAY_INTEGER);
};

const getDayFromLastWeekUnixTime = (currentUnixTime, requiredDayInt) => {
    const lastSunday = getSundayLastWeek(currentUnixTime);

    return getLastGivenDayUnixTime(lastSunday, requiredDayInt);
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
  getLastGivenDayUnixTime,
  getDayFromLastWeekUnixTime,
  getStartAndEndOfLastWeekUnixTimes,
  isWithinPreviousWeekToGivenReferenceTime
};