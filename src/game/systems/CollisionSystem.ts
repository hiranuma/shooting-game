import { Player } from '../entities/Player.ts';
import { Enemy } from '../entities/Enemy.ts';
import { Bullet } from '../entities/Bullet.ts';
import { EnemyBullet } from '../entities/EnemyBullet.ts';
import { PowerUp } from '../entities/PowerUp.ts';
import { ObjectPool } from './ObjectPool.ts';
import { POWERUP_DROP_RATE } from '../utils/constants.ts';

export class CollisionSystem {
  private readonly player: Player;
  private readonly bulletPool: ObjectPool<Bullet>;
  private readonly enemyBulletPool: ObjectPool<EnemyBullet>;
  private readonly enemyPool: ObjectPool<Enemy>;
  private readonly powerUpPool: ObjectPool<PowerUp>;

  constructor(
    player: Player,
    bulletPool: ObjectPool<Bullet>,
    enemyBulletPool: ObjectPool<EnemyBullet>,
    enemyPool: ObjectPool<Enemy>,
    powerUpPool: ObjectPool<PowerUp>,
  ) {
    this.player = player;
    this.bulletPool = bulletPool;
    this.enemyBulletPool = enemyBulletPool;
    this.enemyPool = enemyPool;
    this.powerUpPool = powerUpPool;
  }

  update(): void {
    if (!this.player.active) return;

    this.checkPlayerBulletsVsEnemies();
    this.checkEnemyBulletsVsPlayer();
    this.checkEnemiesVsPlayer();
    this.checkPowerUpsVsPlayer();
  }

  /** Player bullets vs enemies — damage enemy, deactivate bullet, drop PowerUp on kill */
  private checkPlayerBulletsVsEnemies(): void {
    const bullets = this.bulletPool.getActive();
    const enemies = this.enemyPool.getActive();

    for (const bullet of bullets) {
      for (const enemy of enemies) {
        if (bullet.collidesWith(enemy)) {
          // Deactivate bullet
          bullet.active = false;
          bullet.container.visible = false;

          // Damage enemy
          const destroyed = enemy.takeDamage(1);
          if (destroyed) {
            this.player.score += enemy.score;

            // 30% chance to drop PowerUp
            if (Math.random() < POWERUP_DROP_RATE) {
              const pu = this.powerUpPool.get();
              pu.reset(enemy.x, enemy.y);
            }
          }
          break; // This bullet is consumed; move to next bullet
        }
      }
    }
  }

  /** Enemy bullets vs player — skip if invincible */
  private checkEnemyBulletsVsPlayer(): void {
    if (this.player.isInvincible) return;

    const bullets = this.enemyBulletPool.getActive();
    for (const bullet of bullets) {
      if (bullet.collidesWith(this.player)) {
        bullet.active = false;
        bullet.container.visible = false;
        this.player.hit();
        return; // Only one hit per frame
      }
    }
  }

  /** Enemy bodies vs player — skip if invincible */
  private checkEnemiesVsPlayer(): void {
    if (this.player.isInvincible) return;

    const enemies = this.enemyPool.getActive();
    for (const enemy of enemies) {
      if (enemy.collidesWith(this.player)) {
        this.player.hit();
        return; // Only one hit per frame
      }
    }
  }

  /** PowerUp items vs player — increase power level */
  private checkPowerUpsVsPlayer(): void {
    const items = this.powerUpPool.getActive();
    for (const pu of items) {
      if (pu.collidesWith(this.player)) {
        pu.active = false;
        pu.container.visible = false;
        this.player.powerUp();
      }
    }
  }
}
