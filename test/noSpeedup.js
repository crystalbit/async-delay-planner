const expect = require("chai").expect;
const Planner = require('../');

const INTERVAL = 50;
const RUN_COUNT = 100;

describe("No Speedup Test", () => {
    it(`time marks should be over or equal to theoretical`, done => {
        const BEGIN_TIME = +new Date;
        const planner = new Planner(INTERVAL, 0, 0);

        console.log('Please wait');
        for (let i = 0; i < RUN_COUNT + 1; i++) {
            (async () => {
                await planner.hold();
                // we expect here that .hold() waited correct time
                const timeLast = +new Date - BEGIN_TIME;
                expect(timeLast).to.be.gte(i * INTERVAL - 2);
                expect(timeLast).to.be.lte((i + 1) * INTERVAL);
                if (i === RUN_COUNT) done();
            })();
        }
    }).timeout(0);
});
