const expect = require("chai").expect;
const Planner = require('../');

/*
 * First runs will be planned 100 ms after each other.
 * After summed time to be 500 ms the interval will become 100 / 2 = 50 ms
 */
const INTERVAL = 100;
const THRESHOLD = 500;
const SPEEDUP = 2;
const RUN_COUNT = 100;

describe("Speedup Test", () => {
    it(`time marks should be over or equal to theoretical`, done => {
        const BEGIN_TIME = +new Date;
        const planner = new Planner(INTERVAL, THRESHOLD, SPEEDUP);

        console.log('Please wait');
        for (let i = 0; i < RUN_COUNT + 1; i++) {
            (async () => {
                await planner.hold();
                // we expect here that .hold() waited correct time
                const timeLast = +new Date - BEGIN_TIME;
                let expectedMin = i * INTERVAL;
                if (expectedMin > THRESHOLD) expectedMin = (expectedMin - THRESHOLD) / SPEEDUP + THRESHOLD;
                let expectedMax = (i + 1) * INTERVAL;
                if (expectedMax > THRESHOLD) expectedMax = (expectedMax - THRESHOLD) / SPEEDUP + THRESHOLD;

                expect(timeLast).to.be.gte(expectedMin);
                expect(timeLast).to.be.lte(expectedMax);
                if (i === RUN_COUNT) done();
            })();
        }
    }).timeout(0);
});
