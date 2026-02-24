import { Entity } from './Entity.ts';
import { createPlayerBulletGraphics } from '../utils/graphics.ts';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.ts';

export class Bullet extends Entity {
  vx = 0;
  vy = 0;

  constructor() {
    super(2, 6); // half of 4x12
    this.container.addChild(createPlayerBulletGraphics());
    this.active = false;
    this.container.visible = false;
  }

  update(_dt: number): void {
    if (!this.active) return;
    this.x += this.vx;
    this.y += this.vy;

    if (
      this.y < -12 ||
      this.y > GAME_HEIGHT + 12 ||
      this.x < -12 ||
      this.x > GAME_WIDTH + 12
    ) {
      this.active = false;
      this.container.visible = false;
    }
  }

  reset(x: number, y: number, vx: number, vy: number): void {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.active = true;
    this.container.visible = true;
  }
}
