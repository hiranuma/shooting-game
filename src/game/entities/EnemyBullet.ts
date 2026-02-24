import { Entity } from './Entity.ts';
import { createEnemyBulletGraphics } from '../utils/graphics.ts';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.ts';

export class EnemyBullet extends Entity {
  vx = 0;
  vy = 0;

  constructor() {
    super(3, 3); // radius 3px
    this.container.addChild(createEnemyBulletGraphics());
    this.active = false;
    this.container.visible = false;
  }

  update(_dt: number): void {
    if (!this.active) return;
    this.x += this.vx;
    this.y += this.vy;

    if (
      this.y < -10 ||
      this.y > GAME_HEIGHT + 10 ||
      this.x < -10 ||
      this.x > GAME_WIDTH + 10
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
