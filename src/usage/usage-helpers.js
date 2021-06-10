const {
  SUNDAY_INTEGER,
  MONDAY_INTEGER
} = require('./days.constants');

const {
    SECONDS_IN_A_DAY,
    NUMBER_OF_DAYS_IN_A_WEEK
} = require('./times.constants');

const MULTIPLE_FOR_UNIX_TIME_TO_EPOCH = 1000;

const getUnixTimeByNumberOfDaysInThePast = (currentUnixTime, numberOfDaysInThePast, hourFineTuner) => {
    let referenceDate = new Date(currentUnixTime * MULTIPLE_FOR_UNIX_TIME_TO_EPOCH);
    let referenceUnixTime = hourFineTuner(referenceDate) / MULTIPLE_FOR_UNIX_TIME_TO_EPOCH;

    return referenceUnixTime - numberOfDaysInThePast * SECONDS_IN_A_DAY;
};

const getPastDayUnixTimeGivenReferenceUnixTime = (currentUnixTime, requiredDayInteger, hourFineTuner) => {
    const currentDayInteger = (new Date(currentUnixTime * MULTIPLE_FOR_UNIX_TIME_TO_EPOCH)).getUTCDay();

    const difference = currentDayInteger - requiredDayInteger;
    const numberOfDaysBetween = difference < 0
        ? (NUMBER_OF_DAYS_IN_A_WEEK + difference) % NUMBER_OF_DAYS_IN_A_WEEK
        : difference % NUMBER_OF_DAYS_IN_A_WEEK;

    return getUnixTimeByNumberOfDaysInThePast(currentUnixTime, numberOfDaysBetween, hourFineTuner);
};

const isSunday = (unixTime) => {
    return (new Date(unixTime * MULTIPLE_FOR_UNIX_TIME_TO_EPOCH)).getUTCDay() === SUNDAY_INTEGER;
};

const fineTuneHourToZero = (dateObject) => {
    return dateObject.setUTCHours(0, 0, 0, 0);
};

const fineTuneHourToOneSecondBeforeTheNextDay = (dateObject) => {
    return dateObject.setUTCHours(23, 59, 59, 0);
};

const getSundayLastWeek = (currentUnixTime) => {
    if (isSunday(currentUnixTime)) {
        return getUnixTimeByNumberOfDaysInThePast(currentUnixTime, NUMBER_OF_DAYS_IN_A_WEEK, fineTuneHourToOneSecondBeforeTheNextDay);
    }

    return getPastDayUnixTimeGivenReferenceUnixTime(currentUnixTime, SUNDAY_INTEGER, fineTuneHourToOneSecondBeforeTheNextDay);
};

const getDayFromLastWeekUnixTime = (currentUnixTime, requiredDayInt, hourFineTuner) => {
    const lastSunday = getSundayLastWeek(currentUnixTime);

    return getPastDayUnixTimeGivenReferenceUnixTime(lastSunday, requiredDayInt, hourFineTuner);
};

const getStartAndEndOfLastWeekUnixTimes = (currentUnixTime) => {
    const endDayUnixTime = getDayFromLastWeekUnixTime(currentUnixTime, SUNDAY_INTEGER, fineTuneHourToOneSecondBeforeTheNextDay);
    const startDayUnixTime = getDayFromLastWeekUnixTime(currentUnixTime, MONDAY_INTEGER, fineTuneHourToZero);

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
  isWithinPreviousWeekToGivenReferenceTime,
  fineTuneHourToZero
};