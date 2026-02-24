import type { Application } from 'pixi.js';
import { SceneManager } from './SceneManager.ts';
import { KeyboardManager } from './systems/KeyboardManager.ts';
import { TitleScene } from './scenes/TitleScene.ts';
import { GameScene } from './scenes/GameScene.ts';

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
    const scene = new GameScene(
      this.keyboard,
      (_score) => this.showTitle(), // GameOverScene will replace this in Task 12
      (_score) => this.showTitle(), // GameOverScene will replace this in Task 12
    );
    this.scenes.switchTo(scene);
  }
}
