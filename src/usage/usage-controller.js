const { meterPricePlanMap } = require("../meters/meters");
const { calculateUsageCostForPreviousWeek } = require("./usage");

const getUsageCostForPreviousWeek = (getReadings, req) => {
    const meterId = req.params.smartMeterId;
    const pricePlan = meterPricePlanMap[meterId];

    if (!pricePlan) throw new Error("The given meter does not have a price plan.");

    const allReadingsForMeter = getReadings(meterId);
    const rate = pricePlan.rate;
    const currentUnixTime = ((new Date()).getTime() / 1000);

    const usageCostForPreviousWeek = calculateUsageCostForPreviousWeek(
	allReadingsForMeter, rate, currentUnixTime);

    return { usageCostForPreviousWeek }
};

module.exports = {
    getUsageCostForPreviousWeek
};