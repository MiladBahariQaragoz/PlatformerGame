// Entry point. Wires the canvas to the engine and starts the loop.

import { Game } from './engine/game.js';
import { BootScene } from './scenes/BootScene.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);
game.setScene(new BootScene());
game.start();
