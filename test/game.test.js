const assert = require('power-assert');
const Game = require('..');

describe('Game', () => {
  it('Run loop', (done) => {
    const game = new Game({
      framesPerSecond: 50,
      maxFrameSkip: 5,
      waitTime: 5
    });

    game.on('start', () => {
      assert(game.framesPerSecond === 50);
      assert(game.maxFrameSkip === 5);
      assert(game.waitTime === 5);
    });

    game.on('update', () => {
      if (game.currentTick === 1) {
        game.stop();
      } else {
        assert(game.isRunning);
        assert(game.currentTick === 0);
      }
    });

    game.on('stop', () => {
      assert(game.updateTicks === 1);
      done();
    });

    game.start();
  });
});
