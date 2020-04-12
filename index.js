class Planner {
    /**
     * Constructor
     * @param {number} delay Minimal delay before function runs, ms.
     * @param {number} threshold If delay is more than the value - it speeds up <speedup> times. If 0 - no speedup.
     * @param {number} speedup Delay between runs divides by the value after <threshold> ms.
     */
    constructor (delay = 300, threshold = 0, speedup = 10) {
        this.delay = parseInt(delay);
        this.threshold = parseInt(threshold);
        this.speedup = parseFloat(speedup);
        if (this.threshold !== 0 && this.speedup === 0) {
            throw new Error('Speedup can\'t be 0 if threshold isn\'t');
        }
        this.timestamp = 0;
    }

    /**
     * Promise, which resolves when the function can proceed
     * @returns {Promise}
     */
    async hold() {
        const now = +new Date;
        if (now < this.timestamp + this.delay) {
            this.timestamp += this.delay;
            let delay = this.timestamp - now;
            if (this.threshold && delay > this.threshold) {
                // speedup
                delay = (delay - this.threshold) / this.speedup + this.threshold;
            }
            await new Promise(rs => setTimeout(rs, delay));
        } else {
            this.timestamp = now;
        }
    }
};

module.exports = Planner;
