# node-game

Game loop library for Node.js.

## Installation

```bash
$ npm install --save https://github.com/mtojo/node-game.git
```

## Usage

```js
const Game = require('game');

const game = new Game({
  framesPerSecond: 60,
  maxFrameSkip: 10,
  waitTime: 0
});

game.on('init', () => {
  // This function is called when the Game object is initialized.
});

game.on('start', () => {
  // This function is called when the game loop is started.
});

game.on('update', () => {
  // This function is called every frame.
});

game.on('stop', () => {
  // This function is called when the game loop is stopped.
});

game.start();
```

## API

### Game

#### constructor(options = {})

##### options

| Name | Description | Default |
| ---- | ----------- | ------- |
| `framesPerSecond` | Frames per second. | `60` |
| `maxFrameSkip` | Max number for frame skip. | `10` |
| `waitTime` | Milliseconds for loop wait. | `0` |

#### get isRunning

type: `boolean`

Returns whether the game loop is running.

#### get updateTicks

type: `number`

Returns the number of the updated.

#### get currentTick

type: `number`

Returns the number of the updated on current second.

#### set framesPerSecond

type: `number`

Sets the frames per second.

#### get framesPerSecond

type: `number`

Returns the frames per second.

#### set maxFrameSkip

type: `number`

Sets the max number for frame skip.

#### get maxFrameSkip

type: `number`

Returns the max number for frame skip.

#### set waitTime

type: `number`

Sets the milliseconds for loop wait.

#### get waitTime

type: `number`

Returns the milliseconds for loop wait.

#### start()

Starts the game loop.

#### stop()

Stops the game loop.

## License

MIT
