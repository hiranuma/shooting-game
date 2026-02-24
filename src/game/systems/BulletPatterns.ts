import { ObjectPool } from './ObjectPool.ts';
import { EnemyBullet } from '../entities/EnemyBullet.ts';
import { angleBetween } from '../utils/math.ts';

/** Fire a single aimed bullet toward the target */
export function fireAimed(
  pool: ObjectPool<EnemyBullet>,
  fromX: number,
  fromY: number,
  targetX: number,
  targetY: number,
  speed: number,
): void {
  const angle = angleBetween(fromX, fromY, targetX, targetY);
  const b = pool.get();
  b.reset(fromX, fromY, Math.cos(angle) * speed, Math.sin(angle) * speed);
}

/** Fire spread bullets (fan shape) toward the target */
export function fireSpread(
  pool: ObjectPool<EnemyBullet>,
  fromX: number,
  fromY: number,
  targetX: number,
  targetY: number,
  speed: number,
  count: number,
  angleSpread: number,
): void {
  const baseAngle = angleBetween(fromX, fromY, targetX, targetY);
  const step = count > 1 ? angleSpread / (count - 1) : 0;
  const startAngle = baseAngle - angleSpread / 2;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + step * i;
    const b = pool.get();
    b.reset(fromX, fromY, Math.cos(angle) * speed, Math.sin(angle) * speed);
  }
}

/** Fire bullets in all directions (ring pattern) */
export function fireRing(
  pool: ObjectPool<EnemyBullet>,
  fromX: number,
  fromY: number,
  speed: number,
  count: number,
): void {
  const step = (Math.PI * 2) / count;
  for (let i = 0; i < count; i++) {
    const angle = step * i;
    const b = pool.get();
    b.reset(fromX, fromY, Math.cos(angle) * speed, Math.sin(angle) * speed);
  }
}
