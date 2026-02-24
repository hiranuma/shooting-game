import { Entity } from './Entity.ts';
import { createPlayerGraphics } from '../utils/graphics.ts';
import { KeyboardManager } from '../systems/KeyboardManager.ts';
import { ObjectPool } from '../systems/ObjectPool.ts';
import { Bullet } from './Bullet.ts';
import { clamp, degToRad } from '../utils/math.ts';
import {
  PLAYER_SPEED,
  PLAYER_SLOW_SPEED,
  PLAYER_HITBOX,
  PLAYER_LIVES,
  PLAYER_INVINCIBLE_FRAMES,
  PLAYER_FIRE_RATE,
  PLAYER_BULLET_SPEED,
  PLAY_AREA_LEFT,
  PLAY_AREA_RIGHT,
  GAME_HEIGHT,
  POWER_MAX_LEVEL,
} from '../utils/constants.ts';

export class Player extends Entity {
  private readonly keyboard: KeyboardManager;
  private readonly bulletPool: ObjectPool<Bullet>;

  lives = PLAYER_LIVES;
  power = 0;
  score = 0;

  private fireTimer = 0;
  private invincibleTimer = 0;

  constructor(keyboard: KeyboardManager, bulletPool: ObjectPool<Bullet>) {
    super(PLAYER_HITBOX / 2, PLAYER_HITBOX / 2);
    this.keyboard = keyboard;
    this.bulletPool = bulletPool;
    this.container.addChild(createPlayerGraphics());
  }

  get isInvincible(): boolean {
    return this.invincibleTimer > 0;
  }

  update(_dt: number): void {
    if (!this.active) return;
    this.handleMovement();
    this.handleShooting();
    this.updateInvincibility();
  }

  private handleMovement(): void {
    const speed =
      this.keyboard.isDown('ShiftLeft') || this.keyboard.isDown('ShiftRight')
        ? PLAYER_SLOW_SPEED
        : PLAYER_SPEED;

    let dx = 0;
    let dy = 0;
    if (this.keyboard.isDown('ArrowLeft')) dx -= 1;
    if (this.keyboard.isDown('ArrowRight')) dx += 1;
    if (this.keyboard.isDown('ArrowUp')) dy -= 1;
    if (this.keyboard.isDown('ArrowDown')) dy += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.SQRT2;
      dx *= inv;
      dy *= inv;
    }

    this.x = clamp(this.x + dx * speed, PLAY_AREA_LEFT + 8, PLAY_AREA_RIGHT - 8);
    this.y = clamp(this.y + dy * speed, 10, GAME_HEIGHT - 10);
  }

  private handleShooting(): void {
    if (this.fireTimer > 0) {
      this.fireTimer--;
    }
    if (this.keyboard.isDown('KeyZ') && this.fireTimer <= 0) {
      this.fire();
      this.fireTimer = PLAYER_FIRE_RATE;
    }
  }

  private fire(): void {
    const spd = PLAYER_BULLET_SPEED;
    const bx = this.x;
    const by = this.y - 10;

    if (this.power === 0) {
      this.spawnBullet(bx, by, 0, -spd);
    } else if (this.power === 1) {
      const a = degToRad(5);
      const sx = Math.sin(a) * spd;
      const sy = -Math.cos(a) * spd;
      this.spawnBullet(bx, by, -sx, sy);
      this.spawnBullet(bx, by, sx, sy);
    } else {
      const a = degToRad(10);
      const sx = Math.sin(a) * spd;
      const sy = -Math.cos(a) * spd;
      this.spawnBullet(bx, by, 0, -spd);
      this.spawnBullet(bx, by, -sx, sy);
      this.spawnBullet(bx, by, sx, sy);
    }
  }

  private spawnBullet(x: number, y: number, vx: number, vy: number): void {
    const bullet = this.bulletPool.get();
    bullet.reset(x, y, vx, vy);
  }

  private updateInvincibility(): void {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
      this.container.alpha = Math.floor(this.invincibleTimer / 4) % 2 === 0 ? 0.3 : 1.0;
    } else {
      this.container.alpha = 1.0;
    }
  }

  hit(): void {
    if (this.isInvincible) return;
    this.lives--;
    this.power = 0;
    this.invincibleTimer = PLAYER_INVINCIBLE_FRAMES;
    if (this.lives <= 0) {
      this.active = false;
      this.container.visible = false;
    }
  }

  powerUp(): void {
    if (this.power < POWER_MAX_LEVEL) {
      this.power++;
    }
  }

  reset(): void {
    this.lives = PLAYER_LIVES;
    this.power = 0;
    this.score = 0;
    this.fireTimer = 0;
    this.invincibleTimer = 0;
    this.active = true;
    this.container.visible = true;
    this.container.alpha = 1.0;
    this.x = (PLAY_AREA_LEFT + PLAY_AREA_RIGHT) / 2;
    this.y = GAME_HEIGHT - 60;
  }
}
