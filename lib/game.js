/**
 * @fileoverview Game loop library for Node.js.
 * @author Masaki Tojo <masaki.tojo@skooler.jp>
 */


/**
 * Module dependencies.
 */
var util = require('util'),
    events = require('events');


/**
 * Game loop class.
 *
 * Example:
 * <pre>
 * var game = new Game;
 * game.on('init', function() { ... });
 * game.on('start', function() { ... });
 * game.on('update', function() { ... });
 * game.on('stop', function() { ... });
 * game.start();
 * </pre>
 *
 * Options:
 * <pre>{
 *     {number} framesPerSecond: Frames per second.
 *   , {number} maxFrameSkip: Max number for frame skip.
 *   , {number} waitTime: Milliseconds for loop wait.
 * }</pre>
 *
 * @param {Object=} opt_options An object of the options.
 * @constructor
 */
var Game = function(opt_options) {
  var options = opt_options || {};

  this.framesPerSecond = options.framesPerSecond || 60;

  this.maxFrameSkip = options.maxFrameSkip || 10;

  this.waitTime = options.waitTime || 0;

  /**
   * @private
   */
  this.nextTick_ = Date.now();

  /**
   * @private
   */
  this.lastTick_ = 0;

  /**
   * @private
   */
  this.updateTicks_ = 0;

  /**
   * @private
   */
  this.running_ = false;

  /**
   * @private
   */
  this.run_ = (function() {
    var next = this.nextTick_ = Date.now(),
        max = this.updateTicks_ + this.maxFrameSkip_,
        skip = this.skipTicks_;

    while (this.lastTick_ <= next && this.updateTicks_ < max) {
      this.emit('update');
      this.lastTick_ += skip;
      this.updateTicks_++;
    }

    this.running_ && setTimeout(this.run_, this.waitTime_);
  }).bind(this);

  events.EventEmitter.call(this);
};

util.inherits(Game, events.EventEmitter);


/**
 * Starts the game loop.
 */
Game.prototype.start = function() {
  this.emit('start');
  this.running_ = true;
  this.lastTick_ = this.nextTick_;
  this.run_();
};


/**
 * Stops the game loop.
 */
Game.prototype.stop = function() {
  this.running_ = false;
  this.emit('stop');
};


/**
 * Returns whether the game loop is running.
 *
 * @type {boolean}
 */
Object.defineProperty(Game.prototype, 'isRunning', {
  enumerable: false,
  configurable: false,
  get: function() {
    return this.running_;
  }
});


/**
 * Returns the number of the updated.
 *
 * @type {number}
 */
Object.defineProperty(Game.prototype, 'updateTicks', {
  enumerable: false,
  configurable: false,
  get: function() {
    return this.updateTicks_;
  }
});


/**
 * Returns the number of the updated on current second.
 *
 * @type {number}
 */
Object.defineProperty(Game.prototype, 'currentTick', {
  enumerable: false,
  configurable: false,
  get: function() {
    return this.updateTicks_ % this.framesPerSecond_;
  }
});


/**
 * Gets/Sets the frames per second.
 *
 * @type {number}
 */
Object.defineProperty(Game.prototype, 'framesPerSecond', {
  get: function() {
    return this.framesPerSecond_;
  },
  set: function(framesPerSecond) {
    this.framesPerSecond_ = framesPerSecond;
    this.skipTicks_ = Math.floor(1000 / framesPerSecond);
  }
});


/**
 * Gets/Sets the max number for frame skip.
 *
 * @type {number}
 */
Object.defineProperty(Game.prototype, 'maxFrameSkip', {
  get: function() {
    return this.maxFrameSkip_;
  },
  set: function(maxFrameSkip) {
    this.maxFrameSkip_ = maxFrameSkip;
  }
});


/**
 * Gets/Sets the milliseconds for loop wait.
 *
 * @type {number}
 */
Object.defineProperty(Game.prototype, 'waitTime', {
  get: function() {
    return this.waitTime_;
  },
  set: function(waitTime) {
    this.waitTime_ = waitTime;
  }
});


/** @export */
module.exports = exports = Game;
