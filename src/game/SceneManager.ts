import { Container } from 'pixi.js';
import type { Scene } from './scenes/Scene.ts';

export class SceneManager {
  readonly stage: Container;
  private current: Scene | null = null;

  constructor(stage: Container) {
    this.stage = stage;
  }

  /** Switch to a new scene, calling exit on the old and enter on the new */
  switchTo(scene: Scene): void {
    if (this.current) {
      this.current.exit();
      this.stage.removeChild(this.current.container);
    }
    this.current = scene;
    this.stage.addChild(scene.container);
    scene.enter();
  }

  /** Delegate the per-frame update to the current scene */
  update(dt: number): void {
    this.current?.update(dt);
  }
}
