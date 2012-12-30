/**
 * @fileOverview Game loop library
 * @module Game
 * @author Masaki Nagasaki <masaki.nagasaki@skooler.jp>
 */

/*
 * Module dependencies.
 */
var util = require('util')
  , EventEmitter = require('events').EventEmitter;

/**
 * Game loop class.
 *
 * @class Game loop class
 * @param {Object} options Options
 * <pre>{
 *     {Number} framesPerSecond: Frames per second (optional)
 *   , {Number} maxFrameSkip: Max number for frame skip (optional)
 *   , {Number} waitTime: Milliseconds for loop wait (optional)
 * }</pre>
 * @example
 * var game = new Game;
 * game.on('init', function () { ... });
 * game.on('start', function () { ... });
 * game.on('update', function () { ... });
 * game.on('stop', function () { ... });
 * game.start();
 */
var Game = function (options) {
  options = options || {};

  /** @default 60 */
  this.framesPerSecond = options.framesPerSecond || 60;

  /** @default 10 */
  this.maxFrameSkip = options.maxFrameSkip || 10;

  /** @default 0 */
  this.waitTime = options.waitTime || 0;

  /** @private */
  this._nextTick = Date.now();

  /** @private */
  this._lastTick = 0;

  /** @private */
  this._updateTicks = 0;

  /** @private */
  this._running = false;

  /** @ignore */
  this._run = function () {
    var next = this._nextTick = Date.now()
      , last = this._lastTick
      , max = this._updateTicks + this._maxFrameSkip
      , skip = this._skipTicks;

    while (next >= last && this._updateTicks < max) {
      this.emit('update');
      last += skip;
      this._updateTicks++;
    }

    this._lastTick = last;

    this._running && setTimeout(this._run, this._waitTime);
  }.bind(this);
};

/*
 * Inherits from EventEmitter prototype.
 */
util.inherits(Game, EventEmitter);

/**
 * Starts the game loop.
 */
Game.prototype.start = function () {
  this.emit('start');
  this._running = true;
  this._lastTick = this._nextTick;
  this._run();
};

/**
 * Stops the game loop.
 */
Game.prototype.stop = function () {
  this._running = false;
  this.emit('stop');
};

/**
 * Returns whether the game loop is running.
 *
 * @lends Game.prototype
 * @property {Boolean} isRunning Whether the game loop is running
 */
Object.defineProperty(Game.prototype, 'isRunning', {
  enumerable: false,
  configurable: false,
  /** @ignore */ get: function () {
    return this._running;
  },
});

/**
 * Returns the number of the updated.
 *
 * @lends Game.prototype
 * @property {Number} updateTicks The number of the updated
 */
Object.defineProperty(Game.prototype, 'updateTicks', {
  enumerable: false,
  configurable: false,
  /** @ignore */ get: function () {
    return this._updateTicks;
  },
});

/**
 * Returns the number of the updated on current second.
 *
 * @lends Game.prototype
 * @property {Number} currentTick The number of the updated on current second
 */
Object.defineProperty(Game.prototype, 'currentTick', {
  enumerable: false,
  configurable: false,
  /** @ignore */ get: function () {
    return this._updateTicks % this._framesPerSecond;
  },
});

/**
 * Gets/Sets the frames per second.
 *
 * @lends Game.prototype
 * @property {Number} framesPerSecond The frames per second
 */
Object.defineProperty(Game.prototype, 'framesPerSecond', {
  /** @ignore */ get: function () {
    return this._framesPerSecond;
  },
  /** @ignore */ set: function (framesPerSecond) {
    this._framesPerSecond = framesPerSecond;
    this._skipTicks = Math.floor(1000 / framesPerSecond);
  },
});

/**
 * Gets/Sets the max number for frame skip.
 *
 * @lends Game.prototype
 * @property {Number} maxFrameSkip The max number for frame skip
 */
Object.defineProperty(Game.prototype, 'maxFrameSkip', {
  /** @ignore */ get: function () {
    return this._maxFrameSkip;
  },
  /** @ignore */ set: function (maxFrameSkip) {
    this._maxFrameSkip = maxFrameSkip;
  },
});

/**
 * Gets/Sets the milliseconds for loop wait.
 *
 * @lends Game.prototype
 * @property {Number} waitTime The milliseconds for loop wait
 */
Object.defineProperty(Game.prototype, 'waitTime', {
  /** @ignore */ get: function () {
    return this._waitTime;
  },
  /** @ignore */ set: function (waitTime) {
    this._waitTime = waitTime;
  },
});

module.exports = exports = Game;
