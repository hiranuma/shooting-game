import {
  DRONE_HP,
  DRONE_SPEED,
  DRONE_SCORE,
  DRONE_FIRE_INTERVAL,
  TANK_HP,
  TANK_SPEED,
  TANK_SCORE,
  TANK_FIRE_INTERVAL,
  SPINNER_HP,
  SPINNER_SPEED,
  SPINNER_SCORE,
  SPINNER_FIRE_INTERVAL,
} from '../utils/constants.ts';

export type EnemyType = 'drone' | 'tank' | 'spinner';

export interface EnemyConfig {
  hp: number;
  speed: number;
  width: number;
  height: number;
  score: number;
  fireRate: number;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  drone: {
    hp: DRONE_HP,
    speed: DRONE_SPEED,
    width: 24,
    height: 24,
    score: DRONE_SCORE,
    fireRate: DRONE_FIRE_INTERVAL,
  },
  tank: {
    hp: TANK_HP,
    speed: TANK_SPEED,
    width: 24,
    height: 24,
    score: TANK_SCORE,
    fireRate: TANK_FIRE_INTERVAL,
  },
  spinner: {
    hp: SPINNER_HP,
    speed: SPINNER_SPEED,
    width: 16,
    height: 16,
    score: SPINNER_SCORE,
    fireRate: SPINNER_FIRE_INTERVAL,
  },
};
