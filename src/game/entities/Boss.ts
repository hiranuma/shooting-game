import { Entity } from './Entity.ts';
import { ObjectPool } from '../systems/ObjectPool.ts';
import { EnemyBullet } from './EnemyBullet.ts';
import { fireSpread, fireRing } from '../systems/BulletPatterns.ts';
import { createBossGraphics } from '../utils/graphics.ts';
import {
  GAME_WIDTH,
  BOSS_HP,
  BOSS_SCORE,
  BOSS_TARGET_Y,
  BOSS_PHASE2_HP,
  BOSS_PHASE1_INTERVAL,
  BOSS_PHASE2_RADIAL_INTERVAL,
  ENEMY_BULLET_SPEED_AIMED,
  ENEMY_BULLET_SPEED_RADIAL,
} from '../utils/constants.ts';
import { degToRad } from '../utils/math.ts';

export class Boss extends Entity {
  hp = BOSS_HP;
  readonly score = BOSS_SCORE;

  private bulletPool!: ObjectPool<EnemyBullet>;
  getPlayerPos: () => { x: number; y: number } = () => ({ x: 240, y: 600 });

  private frameCount = 0;
  private fireTimer1 = 0;
  private fireTimer2 = 0;
  private entering = true;
  private onDefeat: (() => void) | null = null;

  constructor() {
    super(32, 32); // 64x64 hitbox half-sizes
    this.container.addChild(createBossGraphics());
    this.active = false;
    this.container.visible = false;
  }

  init(
    x: number,
    y: number,
    bulletPool: ObjectPool<EnemyBullet>,
    getPlayerPos: () => { x: number; y: number },
    onDefeat: () => void,
  ): void {
    this.x = x;
    this.y = y;
    this.hp = BOSS_HP;
    this.bulletPool = bulletPool;
    this.getPlayerPos = getPlayerPos;
    this.onDefeat = onDefeat;
    this.frameCount = 0;
    this.fireTimer1 = 0;
    this.fireTimer2 = 0;
    this.entering = true;
    this.active = true;
    this.container.visible = true;
    this.container.alpha = 1;
  }

  private get isPhase2(): boolean {
    return this.hp <= BOSS_PHASE2_HP;
  }

  update(_dt: number): void {
    if (!this.active) return;
    this.frameCount++;

    // Entrance: move down to target Y
    if (this.entering) {
      this.y += 1;
      if (this.y >= BOSS_TARGET_Y) {
        this.y = BOSS_TARGET_Y;
        this.entering = false;
      }
      return;
    }

    // Sway left-right; speed doubles in phase 2
    const swaySpeed = this.isPhase2 ? 0.04 : 0.02;
    const centerX = GAME_WIDTH / 2;
    this.x = centerX + Math.sin(this.frameCount * swaySpeed) * 100;

    // Phase 1: aimed 5way every BOSS_PHASE1_INTERVAL frames
    this.fireTimer1++;
    if (this.fireTimer1 >= BOSS_PHASE1_INTERVAL) {
      this.fireTimer1 = 0;
      const p = this.getPlayerPos();
      fireSpread(
        this.bulletPool,
        this.x,
        this.y,
        p.x,
        p.y,
        ENEMY_BULLET_SPEED_AIMED,
        5,
        degToRad(40),
      );
    }

    // Phase 2: additional 16way ring every BOSS_PHASE2_RADIAL_INTERVAL frames
    if (this.isPhase2) {
      this.fireTimer2++;
      if (this.fireTimer2 >= BOSS_PHASE2_RADIAL_INTERVAL) {
        this.fireTimer2 = 0;
        fireRing(
          this.bulletPool,
          this.x,
          this.y,
          ENEMY_BULLET_SPEED_RADIAL,
          16,
        );
      }
    }
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.active = false;
      this.container.visible = false;
      this.onDefeat?.();
      return true;
    }
    // Flash on hit
    this.container.alpha = 0.5;
    setTimeout(() => {
      if (this.active) this.container.alpha = 1.0;
    }, 50);
    return false;
  }
}
