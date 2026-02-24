import { Container, Text, TextStyle } from 'pixi.js';
import { GAME_WIDTH } from '../utils/constants.ts';

const STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 14,
  fill: 0xffffff,
});

const PADDING = 8;

export class HUD {
  readonly container = new Container();
  private scoreText: Text;
  private livesText: Text;
  private powerText: Text;

  constructor() {
    this.scoreText = new Text({ text: 'SCORE: 0', style: STYLE });
    this.scoreText.anchor.set(1, 0);
    this.scoreText.x = GAME_WIDTH - PADDING;
    this.scoreText.y = PADDING;

    this.livesText = new Text({ text: 'LIFE: 3', style: STYLE });
    this.livesText.x = PADDING;
    this.livesText.y = PADDING;

    this.powerText = new Text({ text: 'POW: 0', style: STYLE });
    this.powerText.x = PADDING;
    this.powerText.y = PADDING + 20;

    this.container.addChild(this.scoreText, this.livesText, this.powerText);
  }

  updateScore(score: number): void {
    this.scoreText.text = `SCORE: ${score}`;
  }

  updateLives(lives: number): void {
    this.livesText.text = `LIFE: ${lives}`;
  }

  updatePower(power: number): void {
    this.powerText.text = `POW: ${power}`;
  }
}
