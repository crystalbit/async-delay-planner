class Planner {
  private timestamp = 0;

  /**
   * Constructor
   * @param {number} delay Minimal delay before function runs, ms.
   * @param {number} threshold If delay is more than the value - function hold rejects
   */
  constructor (
    private delay: number,
    private threshold: number = Infinity
  ) { }

  /**
   * Promise, which resolves when the function can proceed
   * @throws if overall waiting time is more than threshold
   */
  async hold(): Promise<void> {
    const now = +new Date();
    if (now < this.timestamp + this.delay) {
      this.timestamp += this.delay;
      const delay = this.timestamp - now;
      if (delay >= this.threshold) {
        throw new Error();
      }
      await new Promise(rs => setTimeout(rs, delay));
    } else {
      this.timestamp = now;
    }
  }
};

export default Planner;
