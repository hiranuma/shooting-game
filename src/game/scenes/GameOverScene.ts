import { Container, Text, TextStyle } from 'pixi.js';
import type { Scene } from './Scene.ts';
import type { KeyboardManager } from '../systems/KeyboardManager.ts';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.ts';

export class GameOverScene implements Scene {
  readonly container = new Container();
  private keyboard: KeyboardManager;
  private onReturn: () => void;

  constructor(
    keyboard: KeyboardManager,
    score: number,
    isClear: boolean,
    onReturn: () => void,
  ) {
    this.keyboard = keyboard;
    this.onReturn = onReturn;

    // Heading: "STAGE CLEAR!" or "GAME OVER"
    const heading = new Text({
      text: isClear ? 'STAGE CLEAR!' : 'GAME OVER',
      style: new TextStyle({
        fontFamily: 'monospace',
        fontSize: 36,
        fontWeight: 'bold',
        fill: isClear ? 0x00ff00 : 0xff3333,
      }),
    });
    heading.anchor.set(0.5);
    heading.x = GAME_WIDTH / 2;
    heading.y = GAME_HEIGHT / 2 - 60;

    // Score display
    const scoreText = new Text({
      text: `SCORE: ${score}`,
      style: new TextStyle({
        fontFamily: 'monospace',
        fontSize: 24,
        fill: 0xffffff,
      }),
    });
    scoreText.anchor.set(0.5);
    scoreText.x = GAME_WIDTH / 2;
    scoreText.y = GAME_HEIGHT / 2;

    // Prompt
    const prompt = new Text({
      text: 'Press SPACE to Return',
      style: new TextStyle({
        fontFamily: 'monospace',
        fontSize: 20,
        fill: 0x888888,
      }),
    });
    prompt.anchor.set(0.5);
    prompt.x = GAME_WIDTH / 2;
    prompt.y = GAME_HEIGHT / 2 + 60;

    this.container.addChild(heading, scoreText, prompt);
  }

  enter(): void {
    // No-op
  }

  update(_dt: number): void {
    if (this.keyboard.isPressed('Space')) {
      this.onReturn();
    }
  }

  exit(): void {
    this.container.removeChildren();
  }
}
