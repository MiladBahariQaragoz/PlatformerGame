// Entry point. Wires the canvas to the engine and starts the loop.

import { Game } from './engine/game.js';
import { WorldScene } from './scenes/WorldScene.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);
game.setScene(new WorldScene());
game.start();
