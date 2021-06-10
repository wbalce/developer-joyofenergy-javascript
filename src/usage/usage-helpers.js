const getUnixTimeByNumberOfDaysInThePast = (currentUnixTime, numberOfDaysInThePast) => {
    const secondsIn24Hours = 60 * 60 * 24;
    const lastMidnightUnixTime = new Date(currentUnixTime * 1000).setUTCHours(0, 0, 0, 0) / 1000;

    return lastMidnightUnixTime - numberOfDaysInThePast * secondsIn24Hours;
};

const getLastGivenDayUnixTime = (currentUnixTime, requiredDayInteger) => {
    const currentDayInteger = (new Date(currentUnixTime * 1000)).getUTCDay();

    const difference = currentDayInteger - requiredDayInteger;
    const numberOfDaysBetween = difference < 0
        ? (7 + difference) % 7
        : difference % 7;

    return getUnixTimeByNumberOfDaysInThePast(currentUnixTime, numberOfDaysBetween);
};

const isSunday = (unixTime) => {
    return (new Date(unixTime * 1000)).getUTCDay() === 0;
};

const getSundayLastWeek = (currentUnixTime) => {
    if (isSunday(currentUnixTime)) {
        return getUnixTimeByNumberOfDaysInThePast(currentUnixTime, 7);
    }

    return getLastGivenDayUnixTime(currentUnixTime, 0);
};

const getDayFromLastWeekUnixTime = (currentUnixTime, requiredDayInt) => {
    const lastSunday = getSundayLastWeek(currentUnixTime);

    return getLastGivenDayUnixTime(lastSunday, requiredDayInt);
};

const getStartAndEndOfLastWeekUnixTimes = (currentUnixTime) => {
    const endDayUnixTime = getDayFromLastWeekUnixTime(currentUnixTime, 0);
    const startDayUnixTime = getDayFromLastWeekUnixTime(currentUnixTime, 1);

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