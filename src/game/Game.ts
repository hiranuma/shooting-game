import type { Application } from 'pixi.js';

export class Game {
  private _app: Application;

  constructor(app: Application) {
    this._app = app;
  }

  start(): void {
    // Will be wired up with SceneManager in Task 4
    console.log('Game started', this._app.screen.width, 'x', this._app.screen.height);
  }
}
