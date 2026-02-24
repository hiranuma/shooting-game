import { Container } from 'pixi.js';
import type { Scene } from './Scene.ts';
import type { KeyboardManager } from '../systems/KeyboardManager.ts';
import { Player } from '../entities/Player.ts';
import { Bullet } from '../entities/Bullet.ts';
import { EnemyBullet } from '../entities/EnemyBullet.ts';
import { Enemy } from '../entities/Enemy.ts';
import { PowerUp } from '../entities/PowerUp.ts';
import { Boss } from '../entities/Boss.ts';
import { ObjectPool } from '../systems/ObjectPool.ts';
import { CollisionSystem } from '../systems/CollisionSystem.ts';
import { StageManager } from '../systems/StageManager.ts';
import { ParticleSystem } from '../systems/ParticleSystem.ts';
import { HUD } from '../ui/HUD.ts';

/** Transition delay in frames after game-over or stage-clear (2 seconds at 60fps) */
const END_DELAY_FRAMES = 120;

export class GameScene implements Scene {
  readonly container = new Container();

  private readonly keyboard: KeyboardManager;
  private readonly onGameOver: (score: number) => void;
  private readonly onStageClear: (score: number) => void;

  private player!: Player;
  private boss!: Boss;

  private bulletPool!: ObjectPool<Bullet>;
  private enemyBulletPool!: ObjectPool<EnemyBullet>;
  private enemyPool!: ObjectPool<Enemy>;
  private powerUpPool!: ObjectPool<PowerUp>;

  private collisionSystem!: CollisionSystem;
  private stageManager!: StageManager;
  private particleSystem!: ParticleSystem;
  private hud!: HUD;

  private ended = false;
  private endTimer = -1;
  private pendingEnd: (() => void) | null = null;

  constructor(
    keyboard: KeyboardManager,
    onGameOver: (score: number) => void,
    onStageClear: (score: number) => void,
  ) {
    this.keyboard = keyboard;
    this.onGameOver = onGameOver;
    this.onStageClear = onStageClear;
  }

  enter(): void {
    this.ended = false;
    this.endTimer = -1;
    this.pendingEnd = null;

    // Main entity layer
    const gameLayer = new Container();
    this.container.addChild(gameLayer);

    // Object pools (add order = base render order: enemies behind bullets)
    this.enemyPool = new ObjectPool(() => new Enemy(), 30, gameLayer);
    this.powerUpPool = new ObjectPool(() => new PowerUp(), 10, gameLayer);
    this.enemyBulletPool = new ObjectPool(() => new EnemyBullet(), 300, gameLayer);
    this.bulletPool = new ObjectPool(() => new Bullet(), 100, gameLayer);

    // Player
    this.player = new Player(this.keyboard, this.bulletPool);
    this.player.reset();
    gameLayer.addChild(this.player.container);

    // Boss (hidden until StageManager triggers spawn)
    this.boss = new Boss();
    gameLayer.addChild(this.boss.container);

    // Particle system (renders on top of entities)
    this.particleSystem = new ParticleSystem(this.container);

    // HUD (topmost layer)
    this.hud = new HUD();
    this.container.addChild(this.hud.container);

    // Collision system
    this.collisionSystem = new CollisionSystem(
      this.player,
      this.bulletPool,
      this.enemyBulletPool,
      this.enemyPool,
      this.powerUpPool,
    );

    // Stage manager
    this.stageManager = new StageManager(
      this.enemyPool,
      this.enemyBulletPool,
      () => ({ x: this.player.x, y: this.player.y }),
      (x, y) => this.spawnBoss(x, y),
    );
  }

  update(dt: number): void {
    if (this.ended) return;

    // End-game transition: keep particles running, then fire callback
    if (this.endTimer >= 0) {
      this.endTimer++;
      this.particleSystem.update(dt);
      if (this.endTimer >= END_DELAY_FRAMES) {
        this.ended = true;
        this.pendingEnd?.();
      }
      return;
    }

    // --- Main game loop ---

    // 1. Player
    this.player.update(dt);

    // 2. Stage manager (spawns enemies / boss)
    this.stageManager.update(dt);

    // 3. Enemies
    for (const enemy of this.enemyPool.getActive()) {
      enemy.update(dt);
    }

    // 4. Boss
    if (this.boss.active) {
      this.boss.update(dt);
    }

    // 5. Bullets
    for (const b of this.bulletPool.getActive()) {
      b.update(dt);
    }
    for (const b of this.enemyBulletPool.getActive()) {
      b.update(dt);
    }

    // 6. Power-ups
    for (const pu of this.powerUpPool.getActive()) {
      pu.update(dt);
    }

    // 7. Collision: regular enemies & items
    this.collisionSystem.update();

    // 8. Collision: Boss (separate from enemy pool)
    this.checkBossCollisions();

    // 9. Particles
    this.particleSystem.update(dt);

    // 10. HUD
    this.hud.updateScore(this.player.score);
    this.hud.updateLives(this.player.lives);
    this.hud.updatePower(this.player.power);

    // 11. Game over check
    if (this.player.lives <= 0) {
      this.endTimer = 0;
      this.pendingEnd = () => this.onGameOver(this.player.score);
      return;
    }

    // 12. Stage clear check
    if (this.stageManager.isStageCleared()) {
      this.endTimer = 0;
      this.pendingEnd = () => this.onStageClear(this.player.score);
    }
  }

  exit(): void {
    this.particleSystem.destroy();
    this.container.removeChildren();
  }

  // --- Private helpers ---

  private spawnBoss(x: number, y: number): void {
    this.boss.init(
      x,
      y,
      this.enemyBulletPool,
      () => ({ x: this.player.x, y: this.player.y }),
      () => this.onBossDefeated(),
    );
  }

  private onBossDefeated(): void {
    // White flash + red explosion particles
    this.particleSystem.emit(this.boss.x, this.boss.y, 60, 0xffffff);
    this.particleSystem.emit(this.boss.x, this.boss.y, 40, 0xff0000);
    this.stageManager.notifyBossDefeated();
    // Clear all enemy bullets as a reward
    this.enemyBulletPool.releaseAll();
  }

  private checkBossCollisions(): void {
    if (!this.boss.active) return;

    // Player bullets vs Boss
    for (const bullet of this.bulletPool.getActive()) {
      if (bullet.collidesWith(this.boss)) {
        bullet.active = false;
        bullet.container.visible = false;
        const destroyed = this.boss.takeDamage(1);
        if (destroyed) {
          this.player.score += this.boss.score;
        }
      }
    }

    // Boss body vs player
    if (this.player.active && !this.player.isInvincible && this.boss.collidesWith(this.player)) {
      this.player.hit();
    }
  }
}
