import type { Application } from 'pixi.js';
import { SceneManager } from './SceneManager.ts';
import { KeyboardManager } from './systems/KeyboardManager.ts';
import { TitleScene } from './scenes/TitleScene.ts';

export class Game {
  readonly app: Application;
  readonly scenes: SceneManager;
  readonly keyboard: KeyboardManager;

  constructor(app: Application) {
    this.app = app;
    this.scenes = new SceneManager(app.stage);
    this.keyboard = new KeyboardManager();
  }

  start(): void {
    this.app.ticker.add(() => {
      const dt = this.app.ticker.deltaTime;
      this.scenes.update(dt);
      this.keyboard.update();
    });

    this.showTitle();
  }

  showTitle(): void {
    const title = new TitleScene(this.keyboard, () => {
      this.startGame();
    });
    this.scenes.switchTo(title);
  }

  private startGame(): void {
    // Will be wired to GameScene in Task 11
    console.log('Start game — GameScene not yet implemented');
  }
}
