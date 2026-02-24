// Game dimensions
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 720;
export const PLAY_AREA_LEFT = 48;
export const PLAY_AREA_RIGHT = GAME_WIDTH - 48;
export const PLAY_AREA_WIDTH = PLAY_AREA_RIGHT - PLAY_AREA_LEFT;

// Colors
export const BG_COLOR = 0x0a0a2e;
export const PLAYER_COLOR = 0x00ffff;
export const ENEMY_DRONE_COLOR = 0xff3333;
export const ENEMY_TANK_COLOR = 0xff8800;
export const ENEMY_SPINNER_COLOR = 0xffff00;
export const BOSS_FILL_COLOR = 0x880000;
export const BOSS_STROKE_COLOR = 0xff0000;
export const PLAYER_BULLET_COLOR = 0xffffff;
export const ENEMY_BULLET_COLOR = 0xff00ff;
export const POWERUP_COLOR = 0x00ff00;

// Player
export const PLAYER_SPEED = 5;
export const PLAYER_SLOW_SPEED = 2;
export const PLAYER_HITBOX = 4;
export const PLAYER_LIVES = 3;
export const PLAYER_INVINCIBLE_FRAMES = 120;
export const PLAYER_FIRE_RATE = 4;

// Player bullet
export const PLAYER_BULLET_SPEED = 12;
export const PLAYER_BULLET_DAMAGE = 1;

// Enemy bullet
export const ENEMY_BULLET_SPEED_AIMED = 4;
export const ENEMY_BULLET_SPEED_RADIAL = 3;

// Power-up
export const POWERUP_DROP_RATE = 0.3;
export const POWERUP_FALL_SPEED = 2;
export const POWER_MAX_LEVEL = 2;

// Boss
export const BOSS_HP = 100;
export const BOSS_SCORE = 5000;
