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

const {
    MOCK_UNIX_TIME_FRIDAY, 
    MOCK_UNIX_TIMES_PREVIOUS_WEEK_SUNDAY_MIDNIGHT
} = require('./unix-times.constants');

const { SECONDS_IN_A_DAY } = require('./times.constants');

MOCK_METER_PARAMS_RATE = 1;
MOCK_METER_PARAMS_READING = 0.1;

const getMockData = (numberOfDaysInThePast, referenceUnixTime) => {
    const numberOfDaysAgoArray = (new Array(numberOfDaysInThePast)).fill(0).map((_, index) => index);

    return numberOfDaysAgoArray.map(numberOfDaysAgo => ({
        time: referenceUnixTime - SECONDS_IN_A_DAY * numberOfDaysAgo,
        reading: MOCK_METER_PARAMS_READING
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
        const precision = 100000;
        const numberOfDaysPassedInMockReadings = 6;
        const numberOfHoursPassedInMockReadings = numberOfDaysPassedInMockReadings * 24;
        const numberOfDaysInThePast = 7;

        const mockReadingsArray = getMockData(numberOfDaysInThePast, MOCK_UNIX_TIMES_PREVIOUS_WEEK_SUNDAY_MIDNIGHT);
        const usageCostForPreviousWeek = calculateUsageCostForPreviousWeek(
            mockReadingsArray,
            MOCK_METER_PARAMS_RATE,
            MOCK_UNIX_TIME_FRIDAY
        );
        const usageCostForPreviousWeekRounded = roundToGivenPrecision(usageCostForPreviousWeek, precision);

        const expectedOutput = MOCK_METER_PARAMS_READING / numberOfHoursPassedInMockReadings * MOCK_METER_PARAMS_RATE;
        const expectedOutputRounded = roundToGivenPrecision(expectedOutput, precision);

        expect(usageCostForPreviousWeekRounded).toBe(expectedOutputRounded);
    });
});
