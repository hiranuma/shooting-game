import { ObjectPool } from './ObjectPool.ts';
import { Enemy } from '../entities/Enemy.ts';
import { EnemyBullet } from '../entities/EnemyBullet.ts';
import { STAGE_1_WAVES, type WaveDefinition } from '../data/stage1.ts';

interface ActiveWave {
  def: WaveDefinition;
  spawned: number;
  spawnTimer: number;
}

export class StageManager {
  private frame = 0;
  private waveIndex = 0;
  private activeWaves: ActiveWave[] = [];
  private bossActive = false;
  private bossDefeated = false;
  private allWavesTriggered = false;
  private readonly hasBossWave: boolean;

  private readonly enemyPool: ObjectPool<Enemy>;
  private readonly bulletPool: ObjectPool<EnemyBullet>;
  private readonly getPlayerPos: () => { x: number; y: number };
  private readonly onBossSpawn: (x: number, y: number) => void;

  constructor(
    enemyPool: ObjectPool<Enemy>,
    bulletPool: ObjectPool<EnemyBullet>,
    getPlayerPos: () => { x: number; y: number },
    onBossSpawn: (x: number, y: number) => void,
  ) {
    this.enemyPool = enemyPool;
    this.bulletPool = bulletPool;
    this.getPlayerPos = getPlayerPos;
    this.onBossSpawn = onBossSpawn;
    this.hasBossWave = STAGE_1_WAVES.some((w) => w.isBoss);
  }

  update(_dt: number): void {
    this.frame++;

    // Trigger new waves that have reached their frameStart
    while (
      this.waveIndex < STAGE_1_WAVES.length &&
      this.frame >= STAGE_1_WAVES[this.waveIndex].frameStart
    ) {
      const waveDef = STAGE_1_WAVES[this.waveIndex];
      this.activeWaves.push({ def: waveDef, spawned: 0, spawnTimer: 0 });
      this.waveIndex++;
      if (this.waveIndex >= STAGE_1_WAVES.length) {
        this.allWavesTriggered = true;
      }
    }

    // Process active waves — spawn enemies at intervals
    for (let i = this.activeWaves.length - 1; i >= 0; i--) {
      const wave = this.activeWaves[i];
      wave.spawnTimer++;

      // Spawn immediately on first tick, then every spawnInterval frames
      if (wave.spawned === 0 || wave.spawnTimer >= wave.def.spawnInterval) {
        wave.spawnTimer = 0;
        this.spawnFromWave(wave);
        wave.spawned++;

        if (wave.spawned >= wave.def.count) {
          this.activeWaves.splice(i, 1);
        }
      }
    }
  }

  private spawnFromWave(wave: ActiveWave): void {
    const { def } = wave;

    if (def.isBoss) {
      this.bossActive = true;
      this.onBossSpawn(def.spawnX, def.spawnY);
      return;
    }

    if (!def.enemyType) return;

    const enemy = this.enemyPool.get();
    const xEnd = def.spawnXEnd ?? def.spawnX;
    const x =
      def.count <= 1
        ? def.spawnX
        : def.spawnX +
          (xEnd - def.spawnX) * (wave.spawned / (def.count - 1));

    enemy.init(
      def.enemyType,
      x,
      def.spawnY,
      this.bulletPool,
      this.getPlayerPos,
    );
  }

  notifyBossDefeated(): void {
    this.bossActive = false;
    this.bossDefeated = true;
  }

  isStageCleared(): boolean {
    if (!this.allWavesTriggered) return false;
    if (this.activeWaves.length > 0) return false;
    if (this.bossActive) return false;
    if (this.hasBossWave && !this.bossDefeated) return false;
    return this.enemyPool.getActive().length === 0;
  }

  get currentFrame(): number {
    return this.frame;
  }
}
