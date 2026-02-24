import type { EnemyType } from './enemyConfig.ts';

export interface WaveDefinition {
  /** Frame at which this wave begins spawning */
  frameStart: number;
  /** Enemy type to spawn (ignored if isBoss) */
  enemyType?: EnemyType;
  /** Number of enemies in this wave */
  count: number;
  /** Frames between each enemy spawn in the wave */
  spawnInterval: number;
  /** X position for single enemy, or left bound for distributing multiple */
  spawnX: number;
  /** Y spawn position */
  spawnY: number;
  /** X right bound for distributing multiple enemies (defaults to spawnX) */
  spawnXEnd?: number;
  /** If true, spawn boss instead of regular enemy */
  isBoss?: boolean;
}

// Play-area reference points
const PL = 80; // left with margin
const PR = 400; // right with margin
const PC = 240; // center
const TOP = -20; // above screen

/**
 * Stage 1 wave timeline (60 fps)
 *
 * 0:00  = frame 0      0:15 = 900     0:30 = 1800
 * 0:50  = frame 3000   1:10 = 4200    1:30 = 5400
 * 1:50  = frame 6600   2:00 = 7200
 */
export const STAGE_1_WAVES: WaveDefinition[] = [
  // === 0:00–0:15 (frame 0–900): Drone 3 waves × 5 — Introduction ===
  { frameStart: 0, enemyType: 'drone', count: 5, spawnInterval: 20, spawnX: PL, spawnXEnd: PR, spawnY: TOP },
  { frameStart: 300, enemyType: 'drone', count: 5, spawnInterval: 20, spawnX: PL, spawnXEnd: PR, spawnY: TOP },
  { frameStart: 600, enemyType: 'drone', count: 5, spawnInterval: 20, spawnX: PL, spawnXEnd: PR, spawnY: TOP },

  // === 0:15–0:30 (frame 900–1800): Tank 2 + Drone 8 ===
  { frameStart: 900, enemyType: 'tank', count: 2, spawnInterval: 60, spawnX: 160, spawnXEnd: 320, spawnY: TOP },
  { frameStart: 1000, enemyType: 'drone', count: 8, spawnInterval: 25, spawnX: PL, spawnXEnd: PR, spawnY: TOP },

  // === 0:30–0:50 (frame 1800–3000): Spinner from left & right, 3 each ===
  { frameStart: 1800, enemyType: 'spinner', count: 3, spawnInterval: 60, spawnX: PL, spawnXEnd: 140, spawnY: TOP },
  { frameStart: 1900, enemyType: 'spinner', count: 3, spawnInterval: 60, spawnX: 340, spawnXEnd: PR, spawnY: TOP },

  // === 0:50–1:10 (frame 3000–4200): Tank center + Drone flanks ===
  { frameStart: 3000, enemyType: 'tank', count: 1, spawnInterval: 1, spawnX: PC, spawnY: TOP },
  { frameStart: 3100, enemyType: 'drone', count: 5, spawnInterval: 20, spawnX: PL, spawnXEnd: 160, spawnY: TOP },
  { frameStart: 3100, enemyType: 'drone', count: 5, spawnInterval: 20, spawnX: 320, spawnXEnd: PR, spawnY: TOP },

  // === 1:10–1:30 (frame 4200–5400): Drone swarm 15 + Spinner 2 ===
  { frameStart: 4200, enemyType: 'drone', count: 15, spawnInterval: 15, spawnX: PL, spawnXEnd: PR, spawnY: TOP },
  { frameStart: 4500, enemyType: 'spinner', count: 2, spawnInterval: 90, spawnX: PL, spawnXEnd: PR, spawnY: TOP },

  // === 1:30–1:50 (frame 5400–6600): Tank 3 formation + Spinner ===
  { frameStart: 5400, enemyType: 'tank', count: 3, spawnInterval: 60, spawnX: 140, spawnXEnd: 340, spawnY: TOP },
  { frameStart: 5600, enemyType: 'spinner', count: 1, spawnInterval: 1, spawnX: PC, spawnY: TOP },

  // === 1:50–2:00 (frame 6600–7200): Rest (Drone 3) ===
  { frameStart: 6600, enemyType: 'drone', count: 3, spawnInterval: 40, spawnX: 120, spawnXEnd: 360, spawnY: TOP },

  // === 2:00 (frame 7200): Boss "Guardian" ===
  { frameStart: 7200, isBoss: true, count: 1, spawnInterval: 1, spawnX: PC, spawnY: -80 },
];
