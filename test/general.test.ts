import { expect } from 'chai';
import Planner from '../src';

const INTERVAL = 50;
const RUN_COUNT = 100;
const INSUFFICIENT_TIME = 100; // for slow processors

describe('General Test', () => {
  it('check return types', () => {
    const planner = new Planner(INTERVAL);
    const holder = planner.hold();
    expect(typeof holder).to.be.equal('object');
    expect(holder.then).to.be.not.undefined;
  });

  it('No threshold. Time marks should be over or equal to theoretical', (done) => {
    const BEGIN_TIME = +new Date;
    const planner = new Planner(INTERVAL);

    console.log('      Waiting for a series of delays...');
    for (let i = 0; i < RUN_COUNT; i++) {
      (async () => {
        await planner.hold();
        // we expect here that .hold() waited correct time
        const timeLast = +new Date - BEGIN_TIME;
        expect(timeLast).to.be.gte(i * INTERVAL - 2);
        expect(timeLast).to.be.lte((i + 1) * INTERVAL);
        if (i + 1 === RUN_COUNT) {
          done();
        }
      })();
    }
  }).timeout(0);

  it('Threshold. Time marks should be over or equal to theoretical', (done) => {
    const BEGIN_TIME = +new Date;
    const planner = new Planner(INTERVAL, INTERVAL * RUN_COUNT / 2);

    const runs = {
      successful: 0,
      errors: 0,
    };

    console.log('      Waiting for a series of delays...');
    for (let i = 0; i < RUN_COUNT; i++) {
      (async () => {
        planner.hold()
        .then(() => {
          runs.successful++;
          // we expect here that .hold() waited correct time
          const timeLast = +new Date - BEGIN_TIME;
          
          expect(timeLast).to.be.gte(i * INTERVAL - 2);
          expect(timeLast).to.be.lte((i + 1) * INTERVAL);
        })
        .catch(() => {
          runs.errors++;
          const timeLast = +new Date - BEGIN_TIME;
          expect(timeLast).to.be.lte(INSUFFICIENT_TIME);
        })
        .finally(async () => {
          if (i + 1 === RUN_COUNT) {
            await new Promise(rs => setTimeout(rs, INTERVAL * RUN_COUNT));
            expect(runs.successful).to.be.gte(RUN_COUNT / 2 - 1);
            expect(runs.successful).to.be.lte(RUN_COUNT / 2 + 1);
            expect(runs.errors).to.be.gte(RUN_COUNT / 2 - 1);
            expect(runs.errors).to.be.lte(RUN_COUNT / 2 + 1);
            done();
          }
        });
      })();
    }
  }).timeout(0);
});
