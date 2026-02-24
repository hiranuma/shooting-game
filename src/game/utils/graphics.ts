import { Graphics } from 'pixi.js';
import {
  PLAYER_COLOR,
  ENEMY_DRONE_COLOR,
  ENEMY_TANK_COLOR,
  ENEMY_SPINNER_COLOR,
  BOSS_FILL_COLOR,
  BOSS_STROKE_COLOR,
  PLAYER_BULLET_COLOR,
  ENEMY_BULLET_COLOR,
  POWERUP_COLOR,
} from './constants.ts';

/** Player ship — upward-pointing triangle 16x20px */
export function createPlayerGraphics(): Graphics {
  const g = new Graphics();
  g.poly([0, -10, -8, 10, 8, 10]);
  g.fill(PLAYER_COLOR);
  return g;
}

/** Drone enemy — red circle radius 12px */
export function createDroneGraphics(): Graphics {
  const g = new Graphics();
  g.circle(0, 0, 12);
  g.fill(ENEMY_DRONE_COLOR);
  return g;
}

/** Tank enemy — orange rectangle 24x24px */
export function createTankGraphics(): Graphics {
  const g = new Graphics();
  g.rect(-12, -12, 24, 24);
  g.fill(ENEMY_TANK_COLOR);
  return g;
}

/** Spinner enemy — yellow triangle 16x16px */
export function createSpinnerGraphics(): Graphics {
  const g = new Graphics();
  g.poly([0, -8, -8, 8, 8, 8]);
  g.fill(ENEMY_SPINNER_COLOR);
  return g;
}

/** Boss "Guardian" — hexagon 64x64px with stroke */
export function createBossGraphics(): Graphics {
  const g = new Graphics();
  const r = 32;
  const pts: number[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  g.poly(pts);
  g.fill(BOSS_FILL_COLOR);
  g.stroke({ color: BOSS_STROKE_COLOR, width: 3 });
  return g;
}

/** Player bullet — white rectangle 4x12px */
export function createPlayerBulletGraphics(): Graphics {
  const g = new Graphics();
  g.rect(-2, -6, 4, 12);
  g.fill(PLAYER_BULLET_COLOR);
  return g;
}

/** Enemy bullet — small magenta circle radius 3px */
export function createEnemyBulletGraphics(): Graphics {
  const g = new Graphics();
  g.circle(0, 0, 3);
  g.fill(ENEMY_BULLET_COLOR);
  return g;
}

/** Power-up item — green diamond 12x12px */
export function createPowerUpGraphics(): Graphics {
  const g = new Graphics();
  g.poly([0, -6, 6, 0, 0, 6, -6, 0]);
  g.fill(POWERUP_COLOR);
  return g;
}
