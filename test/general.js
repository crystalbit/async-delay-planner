const expect = require("chai").expect;
const Planner = require('../');

const INTERVAL = 50;

describe("General Test", () => {
    it(`throws error if threshold over 0 and speed up eq to 0`, () => {
        expect(() => new Planner(INTERVAL, 1000, 0)).to.throw('Speedup can\'t be 0 if threshold isn\'t');
    });

    it(`check return types`, () => {
        const planner = new Planner(INTERVAL, 0, 0);
        expect(planner).to.be.instanceOf(Planner);
        const holder = planner.hold();
        expect(typeof holder).to.be.equal('object');
        expect(holder.then).to.be.not.undefined;
    });
});
