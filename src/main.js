// Entry point. Wires the canvas to the engine and starts the loop.

import { Game } from './engine/game.js';
import { StartScene } from './scenes/StartScene.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);
game.setScene(new StartScene());
game.start();
