const { getUsageCostForPreviousWeek } = require('./usage-controller');

describe("usage-controller", () => {
    it("should return an error if given meter has no price plan", () => {	
        expect(() => getUsageCostForPreviousWeek(
	    ()=>{}, { params: "mock-meter" }
	)).toThrow("The given meter does not have a price plan.");
    });
});