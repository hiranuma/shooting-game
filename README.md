# Shooting Game

A 2D vertical scrolling shooting game (STG) built with TypeScript and PixiJS, running in the browser.

## How to Play

### Controls

| Key | Action |
|---|---|
| Arrow Keys | Move (8-directional) |
| Z | Shoot (hold for autofire) |
| Shift | Focus mode (slower movement for precise dodging) |
| Space | Start game / Return to title |

### Rules

- Destroy enemies to earn points
- Collect green power-up items (diamond shape) dropped by enemies to increase your shot power (max level 2)
- Avoid enemy bullets and enemy contact — getting hit costs a life and resets your power level to 0
- You have 3 lives. When all lives are lost, the game is over
- After being hit, you get 2 seconds of invincibility (indicated by blinking)
- Survive through enemy waves and defeat the boss "Guardian" to clear the stage

### Scoring

| Enemy | Points |
|---|---|
| Drone (red circle) | 100 |
| Tank (orange square) | 300 |
| Spinner (yellow triangle) | 500 |
| Boss "Guardian" | 5,000 |

### Game Flow

```
Title Screen → [SPACE] → Gameplay (~2.5 min) → Game Over / Stage Clear → [SPACE] → Title Screen
```

## Technology Stack

| Technology | Purpose |
|---|---|
| [TypeScript](https://www.typescriptlang.org/) ~5.9 | Language (strict mode) |
| [PixiJS](https://pixijs.com/) v8 | 2D rendering engine (WebGL/Canvas) |
| [Vite](https://vite.dev/) v7 | Build tool & dev server (HMR) |
| [ESLint](https://eslint.org/) v9 | Code linting |

All graphics are rendered as geometric shapes (circles, rectangles, triangles) using the PixiJS Graphics API — no external image assets required.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

### Installation

```bash
git clone <repository-url>
cd shooting-game
npm install
```

### Development

```bash
npm run dev
```

Opens a local dev server at `http://localhost:5173` with hot module replacement.

### Build for Production

```bash
npm run build
```

Output is generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
  main.ts                          # Entry point — initializes PixiJS Application
  game/
    Game.ts                        # Top-level game controller (ticker, scene management)
    SceneManager.ts                # Scene transition manager
    scenes/
      Scene.ts                     # Scene interface
      TitleScene.ts                # Title screen
      GameScene.ts                 # Main gameplay (orchestrates all systems)
      GameOverScene.ts             # Game over / stage clear screen
    entities/
      Entity.ts                    # Abstract base entity class
      Player.ts                    # Player ship (movement, shooting, lives, power)
      Enemy.ts                     # Enemy (configurable type: drone/tank/spinner)
      Bullet.ts                    # Player bullet
      EnemyBullet.ts               # Enemy bullet
      PowerUp.ts                   # Power-up item drop
      Boss.ts                      # Stage boss with two attack phases
    systems/
      KeyboardManager.ts           # Keyboard input polling
      CollisionSystem.ts           # AABB collision detection
      ObjectPool.ts                # Generic object pool for entity recycling
      BulletPatterns.ts            # Bullet pattern generators (aimed, spread, ring)
      StageManager.ts              # Wave timeline & enemy spawning
      ParticleSystem.ts            # Explosion particle effects
    data/
      stage1.ts                    # Stage 1 wave definitions
      enemyConfig.ts               # Enemy type configurations
    ui/
      HUD.ts                       # Score, lives, power display
    utils/
      math.ts                      # Math helpers (angle, clamp, distance, lerp)
      constants.ts                 # Game constants (dimensions, colors, speeds)
      graphics.ts                  # Shape factory functions (PixiJS Graphics)
```

## System Architecture

### Game Loop

The game runs at 60fps using PixiJS's built-in `Ticker`. Each frame executes:

1. Poll keyboard input
2. Update player (movement, shooting)
3. Update stage manager (spawn enemies per wave timeline)
4. Update all enemies (movement, firing patterns)
5. Update all bullets (player & enemy)
6. Run collision detection (AABB)
7. Update HUD (score, lives, power)
8. Update particle effects
9. PixiJS auto-renders the scene graph

### Key Design Decisions

- **No React** — PixiJS manages its own scene graph; DOM framework adds no value for a canvas game
- **Class-based entities** — simple inheritance over ECS; appropriate for prototype scope
- **Object pooling** — bullets and enemies are recycled to avoid garbage collection pauses
- **AABB collision** — sufficient for geometric shapes with ~300 entities max
- **Declarative stage data** — wave definitions stored as data arrays for easy tuning

### Screen Layout

- Game resolution: 480 x 720 px (portrait)
- Play area: 384 x 720 px (centered)
- UI margins: 48px on each side for score/lives/power display

## How This Project Was Built

This game was developed using an AI-assisted autonomous workflow called **Ralph Loop**:

1. **Requirements definition** — Game specifications were defined in `PRD.md` covering gameplay mechanics, enemy types, bullet patterns, stage design, and technical architecture
2. **Task breakdown** — The PRD was broken into 12 sequential implementation tasks with detailed instructions for each
3. **Autonomous implementation** — The `ralph.sh` script ran Claude Code in a loop, implementing one task per iteration:
   - Read `PRD.md` and `progress.txt` to find the next uncompleted task
   - Implement the task (create/modify files)
   - Mark the task as complete (`[x]`) and log progress
   - Auto-commit changes via git
   - Repeat until all tasks were done
4. **Incremental build** — Each phase produced a runnable result (title screen first, then player, then enemies, etc.)
