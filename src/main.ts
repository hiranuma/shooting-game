import { Application } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR } from './game/utils/constants.ts';
import { Game } from './game/Game.ts';

async function main(): Promise<void> {
  const app = new Application();

  await app.init({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: BG_COLOR,
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.body.appendChild(app.canvas);

  const game = new Game(app);
  game.start();
}

main();
