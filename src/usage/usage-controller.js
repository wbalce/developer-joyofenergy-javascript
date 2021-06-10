const { meterPricePlanMap } = require("../meters/meters");
const { calculateUsageCostForPreviousWeek } = require("./usage");

const getUsageCostForPreviousWeek = (getReadings, req) => {
    const meterId = req.params.smartMeterId;
    const pricePlan = meterPricePlanMap[meterId];

    if (!pricePlan) throw new Error("The given meter does not have a price plan.");

    return calculateUsageCostForPreviousWeek(
	getReadings(meterId), pricePlan.rate, (new Date()).getTime());
};

module.exports = {
    getUsageCostForPreviousWeek
};