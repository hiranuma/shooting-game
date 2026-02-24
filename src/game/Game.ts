import type { Application } from 'pixi.js';
import { SceneManager } from './SceneManager.ts';
import { KeyboardManager } from './systems/KeyboardManager.ts';
import { TitleScene } from './scenes/TitleScene.ts';
import { GameScene } from './scenes/GameScene.ts';
import { GameOverScene } from './scenes/GameOverScene.ts';

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
      (score) => this.showGameOver(score, false),
      (score) => this.showGameOver(score, true),
    );
    this.scenes.switchTo(scene);
  }

  private showGameOver(score: number, isClear: boolean): void {
    const scene = new GameOverScene(this.keyboard, score, isClear, () => {
      this.showTitle();
    });
    this.scenes.switchTo(scene);
  }
}
