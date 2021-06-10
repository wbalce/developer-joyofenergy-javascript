const getLastGivenDayUnixTime = (currentUnixTime, requiredDayInt) => {
    const secondsIn24Hours = 60 * 60 * 24;

    const currentDate = new Date(currentUnixTime * 1000);
    const currentDay = currentDate.getDay();

    const lastMidnightUnixTime = currentDate.setUTCHours(0, 0, 0, 0) / 1000;
    const difference = currentDay - requiredDayInt;
    const numberOfDaysBetween = difference < 0
        ? (7 + difference) % 7
        : difference % 7;
 
    return lastMidnightUnixTime - numberOfDaysBetween * secondsIn24Hours;
};


const getSundayLastWeek = (currentUnixTime) => {
    return getLastGivenDayUnixTime(currentUnixTime, 0);
};

const getDayFromLastWeekUnixTime = (currentUnixTime, requiredDayInt) => {
    const lastSunday = getSundayLastWeek(currentUnixTime);

    return getLastGivenDayUnixTime(lastSunday, requiredDayInt);
};

module.exports = {
  getLastGivenDayUnixTime,
  getDayFromLastWeekUnixTime
};