import { Entity } from './Entity.ts';
import { ObjectPool } from '../systems/ObjectPool.ts';
import { EnemyBullet } from './EnemyBullet.ts';
import { fireAimed, fireSpread, fireRing } from '../systems/BulletPatterns.ts';
import { type EnemyType, ENEMY_CONFIGS } from '../data/enemyConfig.ts';
import {
  createDroneGraphics,
  createTankGraphics,
  createSpinnerGraphics,
} from '../utils/graphics.ts';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  TANK_STOP_Y,
  TANK_STOP_DURATION,
  ENEMY_BULLET_SPEED_AIMED,
  ENEMY_BULLET_SPEED_RADIAL,
} from '../utils/constants.ts';
import { degToRad } from '../utils/math.ts';

type TankPhase = 'descending' | 'stopped' | 'exiting';

export class Enemy extends Entity {
  enemyType: EnemyType = 'drone';
  hp = 1;
  speed = 0;
  score = 0;
  fireRate = 0;

  /** Reference to get player position for aimed shots */
  getPlayerPos: () => { x: number; y: number } = () => ({ x: 240, y: 600 });

  private bulletPool!: ObjectPool<EnemyBullet>;
  private frameCount = 0;
  private fireTimer = 0;

  // Drone: sine wave
  private spawnX = 0;

  // Tank: stop-and-go
  private tankPhase: TankPhase = 'descending';
  private tankStopTimer = 0;

  // Spinner: circular movement
  private spinnerCenterX = 0;
  private spinnerCenterY = 0;
  private spinnerAngle = 0;
  private spinnerRadius = 60;

  constructor() {
    super(12, 12);
    this.active = false;
    this.container.visible = false;
  }

  init(
    type: EnemyType,
    x: number,
    y: number,
    bulletPool: ObjectPool<EnemyBullet>,
    getPlayerPos: () => { x: number; y: number },
  ): void {
    const cfg = ENEMY_CONFIGS[type];
    this.enemyType = type;
    this.hp = cfg.hp;
    this.speed = cfg.speed;
    this.score = cfg.score;
    this.fireRate = cfg.fireRate;
    this.hitboxW = cfg.width / 2;
    this.hitboxH = cfg.height / 2;
    this.bulletPool = bulletPool;
    this.getPlayerPos = getPlayerPos;

    this.x = x;
    this.y = y;
    this.frameCount = 0;
    this.fireTimer = 0;
    this.active = true;
    this.container.visible = true;

    // Clear previous graphics and create new ones
    this.container.removeChildren();
    switch (type) {
      case 'drone':
        this.container.addChild(createDroneGraphics());
        this.spawnX = x;
        break;
      case 'tank':
        this.container.addChild(createTankGraphics());
        this.tankPhase = 'descending';
        this.tankStopTimer = 0;
        break;
      case 'spinner':
        this.container.addChild(createSpinnerGraphics());
        this.spinnerCenterX = x;
        this.spinnerCenterY = y + 100;
        this.spinnerAngle = Math.atan2(y - this.spinnerCenterY, x - this.spinnerCenterX);
        this.spinnerRadius = 60;
        break;
    }
  }

  update(_dt: number): void {
    if (!this.active) return;

    this.frameCount++;
    this.updateMovement();
    this.updateFiring();
    this.checkBounds();

    // Spinner rotation visual
    if (this.enemyType === 'spinner') {
      this.container.rotation += 0.05;
    }
  }

  private updateMovement(): void {
    switch (this.enemyType) {
      case 'drone':
        this.moveDrone();
        break;
      case 'tank':
        this.moveTank();
        break;
      case 'spinner':
        this.moveSpinner();
        break;
    }
  }

  /** Drone: descend with sine-wave horizontal motion */
  private moveDrone(): void {
    this.y += this.speed;
    this.x = this.spawnX + Math.sin(this.frameCount * 0.05) * 40;
  }

  /** Tank: descend → stop at y=150 for 120 frames → exit downward */
  private moveTank(): void {
    switch (this.tankPhase) {
      case 'descending':
        this.y += this.speed;
        if (this.y >= TANK_STOP_Y) {
          this.y = TANK_STOP_Y;
          this.tankPhase = 'stopped';
          this.tankStopTimer = 0;
        }
        break;
      case 'stopped':
        this.tankStopTimer++;
        if (this.tankStopTimer >= TANK_STOP_DURATION) {
          this.tankPhase = 'exiting';
        }
        break;
      case 'exiting':
        this.y += this.speed;
        break;
    }
  }

  /** Spinner: circular/spiral movement */
  private moveSpinner(): void {
    this.spinnerAngle += this.speed * 0.03;
    this.x = this.spinnerCenterX + Math.cos(this.spinnerAngle) * this.spinnerRadius;
    this.y = this.spinnerCenterY + Math.sin(this.spinnerAngle) * this.spinnerRadius;
    // Slowly drift downward
    this.spinnerCenterY += 0.3;
  }

  private updateFiring(): void {
    this.fireTimer++;
    if (this.fireTimer < this.fireRate) return;
    this.fireTimer = 0;

    // Tank only fires while stopped
    if (this.enemyType === 'tank' && this.tankPhase !== 'stopped') return;

    const player = this.getPlayerPos();
    switch (this.enemyType) {
      case 'drone':
        fireAimed(this.bulletPool, this.x, this.y, player.x, player.y, ENEMY_BULLET_SPEED_AIMED);
        break;
      case 'tank':
        fireSpread(
          this.bulletPool,
          this.x,
          this.y,
          player.x,
          player.y,
          ENEMY_BULLET_SPEED_AIMED,
          3,
          degToRad(30),
        );
        break;
      case 'spinner':
        fireRing(this.bulletPool, this.x, this.y, ENEMY_BULLET_SPEED_RADIAL, 8);
        break;
    }
  }

  private checkBounds(): void {
    const margin = 50;
    if (
      this.y > GAME_HEIGHT + margin ||
      this.y < -margin ||
      this.x < -margin ||
      this.x > GAME_WIDTH + margin
    ) {
      this.active = false;
      this.container.visible = false;
    }
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.active = false;
      this.container.visible = false;
      return true; // destroyed
    }
    // Flash white briefly
    this.container.alpha = 0.5;
    setTimeout(() => {
      if (this.active) this.container.alpha = 1.0;
    }, 50);
    return false;
  }
}
