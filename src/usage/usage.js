const {
    isWithinPreviousWeekToGivenReferenceTime
} = require('./usage-helpers');

const average = (readings) => {
    return (
        readings.reduce((prev, next) => prev + next.reading, 0) /
        readings.length
    );
};

const timeElapsedInHours = (readings) => {
    readings.sort((a, b) => a.time - b.time);
    const seconds = readings[readings.length - 1].time - readings[0].time;
    const hours = Math.floor(seconds / 3600);
    return hours;
};

const usage = (readings) => {
    return average(readings) / timeElapsedInHours(readings);
};

const usageCost = (readings, rate) => {
    return usage(readings) * rate;
};

const usageForAllPricePlans = (pricePlans, readings) => {
    return Object.entries(pricePlans).map(([key, value]) => {
        return {
            [key]: usageCost(readings, value.rate),
        };
    });
};

const calculateUsageCostForPreviousWeek = (readings, rate, referenceUnixtime) => {
    if (!rate) throw new Error("Meter rate was not supplied.");
    if (!readings || !readings.length) throw new Error("Readings were not supplied.");

    const readingsFromPreviousWeek = readings.filter(reading =>
        isWithinPreviousWeekToGivenReferenceTime(referenceUnixtime, reading.time)
    );

    return readingsFromPreviousWeek.length
        ? usageCost(readingsFromPreviousWeek, rate)
        : 0;
};

module.exports = {
    average,
    timeElapsedInHours,
    usage,
    usageCost,
    usageForAllPricePlans,
    calculateUsageCostForPreviousWeek,
};
