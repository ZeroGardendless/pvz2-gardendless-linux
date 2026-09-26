class FrameHistory {
  constructor(capacity) {
    this.capacity = capacity;
    this.samples = [];
    this.cursor = 0;
  }
  push(sample) {
    this.samples[this.cursor] = sample;
    this.cursor = (this.cursor + 1) % this.capacity;
  }
  toArray() {
    if (this.samples.length < this.capacity) return this.samples.slice();
    return this.samples.slice(this.cursor).concat(this.samples.slice(0, this.cursor));
  }
}
export {
  FrameHistory
};
