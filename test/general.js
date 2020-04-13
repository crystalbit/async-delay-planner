const expect = require("chai").expect;
const Planner = require('../');

const INTERVAL = 50;
const SPEEDUP_ERROR_MESSAGE = 'Speedup can\'t be 0 if threshold isn\'t';

describe("General Test", () => {
    it(`throws error if threshold over 0 and speedup is 0`, () => {
        expect(() => new Planner(INTERVAL, 1000, 0)).to.throw(SPEEDUP_ERROR_MESSAGE);
    });

    it(`no error if threshold is 0 and speedup is 0`, () => {
        expect(() => new Planner(INTERVAL, 0, 0)).not.to.throw(SPEEDUP_ERROR_MESSAGE);
    });

    it(`no error if threshold is 0 and speedup isn't 0`, () => {
        expect(() => new Planner(INTERVAL, 0, 2)).not.to.throw(SPEEDUP_ERROR_MESSAGE);
    });

    it(`no error if threshold isn't 0 and speedup isn't 0`, () => {
        expect(() => new Planner(INTERVAL, 3000, 2)).not.to.throw(SPEEDUP_ERROR_MESSAGE);
    });

    it(`check return types`, () => {
        const planner = new Planner(INTERVAL, 0, 0);
        expect(planner).to.be.instanceOf(Planner);
        const holder = planner.hold();
        expect(typeof holder).to.be.equal('object');
        expect(holder.then).to.be.not.undefined;
    });
});
