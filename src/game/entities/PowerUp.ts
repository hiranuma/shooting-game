import { Entity } from './Entity.ts';
import { createPowerUpGraphics } from '../utils/graphics.ts';
import { GAME_HEIGHT, POWERUP_FALL_SPEED } from '../utils/constants.ts';

export class PowerUp extends Entity {
  constructor() {
    super(6, 6); // half of 12x12
    this.container.addChild(createPowerUpGraphics());
    this.active = false;
    this.container.visible = false;
  }

  update(_dt: number): void {
    if (!this.active) return;
    this.y += POWERUP_FALL_SPEED;

    if (this.y > GAME_HEIGHT + 10) {
      this.active = false;
      this.container.visible = false;
    }
  }

  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.active = true;
    this.container.visible = true;
  }
}
