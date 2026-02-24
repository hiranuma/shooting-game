import { Container, Text, TextStyle } from 'pixi.js';
import type { Scene } from './Scene.ts';
import type { KeyboardManager } from '../systems/KeyboardManager.ts';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.ts';

export class TitleScene implements Scene {
  readonly container = new Container();
  private keyboard: KeyboardManager;
  private onStart: () => void;

  constructor(keyboard: KeyboardManager, onStart: () => void) {
    this.keyboard = keyboard;
    this.onStart = onStart;

    const title = new Text({
      text: 'SHOOTING GAME',
      style: new TextStyle({
        fontFamily: 'monospace',
        fontSize: 36,
        fontWeight: 'bold',
        fill: 0xffffff,
      }),
    });
    title.anchor.set(0.5);
    title.x = GAME_WIDTH / 2;
    title.y = GAME_HEIGHT / 2 - 40;

    const prompt = new Text({
      text: 'Press SPACE to Start',
      style: new TextStyle({
        fontFamily: 'monospace',
        fontSize: 20,
        fill: 0x888888,
      }),
    });
    prompt.anchor.set(0.5);
    prompt.x = GAME_WIDTH / 2;
    prompt.y = GAME_HEIGHT / 2 + 30;

    this.container.addChild(title, prompt);
  }

  enter(): void {
    // No-op
  }

  update(_dt: number): void {
    if (this.keyboard.isPressed('Space')) {
      this.onStart();
    }
  }

  exit(): void {
    this.container.removeChildren();
  }
}
