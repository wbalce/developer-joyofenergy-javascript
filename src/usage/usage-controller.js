const { meterPricePlanMap } = require("../meters/meters");
const { calculateUsageCostForPreviousWeek } = require("./usage");

const getUsageCostForPreviousWeek = (getReadings, req) => {
    const meterId = req.params.smartMeterId;
    const pricePlan = meterPricePlanMap[meterId];

    if (!pricePlan) throw new Error("The given meter does not have a price plan.");

    const usageCostForPreviousWeek = calculateUsageCostForPreviousWeek(
	getReadings(meterId), pricePlan.rate, ((new Date()).getTime() / 1000));

    return { usageCostForPreviousWeek }
};

module.exports = {
    getUsageCostForPreviousWeek
};