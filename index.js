const {EventEmitter} = require('events');

module.exports = class Game extends EventEmitter {
  constructor(options = {}) {
    super();

    this.framesPerSecond = options.framesPerSecond || 60;
    this.maxFrameSkip = options.maxFrameSkip || 10;
    this.waitTime = options.waitTime || 0;

    this._nextTick = Date.now();
    this._lastTick = 0;
    this._updateTicks = 0;
    this._running = false;
  }

  get isRunning() {
    return this._running;
  }

  get updateTicks() {
    return this._updateTicks;
  }

  get currentTick() {
    return this._updateTicks % this._framesPerSecond;
  }

  set framesPerSecond(framesPerSecond) {
    this._framesPerSecond = framesPerSecond;
    this._skipTicks = Math.floor(1000 / framesPerSecond);
  }

  get framesPerSecond() {
    return this._framesPerSecond;
  }

  set maxFrameSkip(maxFrameSkip) {
    this._maxFrameSkip = maxFrameSkip;
  }

  get maxFrameSkip() {
    return this._maxFrameSkip;
  }

  set waitTime(waitTime) {
    this._waitTime = waitTime;
  }

  get waitTime() {
    return this._waitTime;
  }

  start() {
    this.emit('start');
    this._running = true;
    this._lastTick = this._nextTick;
    this._run();
  }

  stop() {
    this._running = false;
    this.emit('stop');
  }

  _run() {
    const next = this._nextTick = Date.now();
    const max = this._updateTicks + this._maxFrameSkip;
    const skip = this._skipTicks;

    while (this._lastTick <= next && this._updateTicks < max) {
      this.emit('update');
      this._lastTick += skip;
      this._updateTicks++;
    }

    this._running && setTimeout(() => this._run(), this._waitTime);
  }
};
