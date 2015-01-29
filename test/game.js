var Game = require('../lib/game');

describe('Game', function() {
  it('Run loop', function(done) {
    var game = new Game({
      framesPerSecond: 50,
      maxFrameSkip: 5,
      waitTime: 5
    });

    game.on('start', function() {
      this.framesPerSecond.should.eql(50);
      this.maxFrameSkip.should.eql(5);
      this.waitTime.should.eql(5);
    });

    game.on('update', function() {
      if (this.currentTick === 1) {
        game.stop();
      } else {
        this.isRunning.should.be.true;
        this.currentTick.should.eql(0);
      }
    });

    game.on('stop', function() {
      this.updateTicks.should.eql(1);
      done();
    });

    game.start();
  });
});
