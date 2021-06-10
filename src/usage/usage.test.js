const { meters, meterPricePlanMap } = require("../meters/meters");
const { pricePlanNames, pricePlans } = require("../price-plans/price-plans");
const { readings } = require("../readings/readings");
const {
    average,
    timeElapsedInHours,
    usage,
    usageCost,
    usageForAllPricePlans,
    calculateUsageCostForPreviousWeek,
} = require("./usage");

const mockUnixTimes = {
    reference: 1607686125, // Friday, 11 December 2020 11:28:45 GMT+00:00
    previousSunday: 1607212800, // Sunday, 06 December 2020 00:00:00 GMT+00:00
};

const mockMeterParameters = {
    rate: 1,
    reading: 0.1
};

const timeConstants = {
    secondsIn24Hours: (60 * 60 * 24)
};

const getMockData = (numberOfDaysInThePast, referenceUnixTime) => {
    const numberOfDaysAgoArray = (new Array(numberOfDaysInThePast)).fill(0).map((_, index) => index);

    return numberOfDaysAgoArray.map(numberOfDaysAgo => ({
        time: referenceUnixTime - timeConstants.secondsIn24Hours * numberOfDaysAgo,
        reading: mockMeterParameters.reading
    }));
};

const roundToGivenPrecision = (number, precision) => {
    return Math.round((number + Number.EPSILON) * precision) / precision;
};

describe("usage", () => {
    it("should average all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 923874692387, reading: 0.26785 },
                { time: 923874692387, reading: 0.26785 },
                { time: 923874692387, reading: 0.26785 },
            ],
        });

        const averageMeter0 = average(getReadings(meters.METER0));

        expect(averageMeter0).toBe(0.26785);
    });

    it("should get time elapsed in hours for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686135, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607512024, reading: 0.26785 },
            ],
        });

        const timeElapsedMeter0 = timeElapsedInHours(
            getReadings(meters.METER0)
        );

        expect(timeElapsedMeter0).toBe(48);
    });

    it("should get usage for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const usageMeter0 = usage(getReadings(meters.METER0));

        expect(usageMeter0).toBe(0.26785 / 48);
    });

    it("should get usage cost for all readings for a meter", () => {
        const { getReadings } = readings({
            [meters.METER2]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const rate = meterPricePlanMap[meters.METER2].rate;
        const usageCostForMeter = usageCost(getReadings(meters.METER2), rate);

        expect(usageCostForMeter).toBe(0.26785 / 48 * 1);
    });

    it("should get usage cost for all readings for all price plans", () => {
        const { getReadings } = readings({
            [meters.METER2]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const expected = [
            {
                [pricePlanNames.PRICEPLAN0]: 0.26785 / 48 * 10,
            },
            {
                [pricePlanNames.PRICEPLAN1]: 0.26785 / 48 * 2,
            },
            {
                [pricePlanNames.PRICEPLAN2]: 0.26785 / 48 * 1,
            },
        ];

        const usageForAllPricePlansArray = usageForAllPricePlans(
            pricePlans,
            getReadings(meters.METER2)
        );

        expect(usageForAllPricePlansArray).toEqual(expected);
    });

    it("should get usage cost for all readings in previous week for given a price plan and stored usage data", () => {
        const mockReadingsArray = getMockData(7, mockUnixTimes.previousSunday);
        const precision = 100000;
        const numberOfDaysPassedInMockReadings = 6;
        const numberOfHoursPassedInMockReadings = numberOfDaysPassedInMockReadings * 24;

        const usageCostForPreviousWeek = calculateUsageCostForPreviousWeek(
            mockReadingsArray,
            mockMeterParameters.rate,
            mockUnixTimes.reference
        );
        const usageCostForPreviousWeekRounded = roundToGivenPrecision(usageCostForPreviousWeek, precision);

        const expectedOutput = mockMeterParameters.reading / numberOfHoursPassedInMockReadings * mockMeterParameters.rate;
        const expectedOutputRounded = roundToGivenPrecision(expectedOutput, precision);

        expect(usageCostForPreviousWeekRounded).toBe(expectedOutputRounded);
    });
});
