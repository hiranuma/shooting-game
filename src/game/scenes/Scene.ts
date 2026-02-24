import { Container } from 'pixi.js';

export interface Scene {
  readonly container: Container;

  /** Called once when the scene becomes active */
  enter(): void;

  /** Called every frame while the scene is active */
  update(dt: number): void;

  /** Called once when the scene is about to be replaced */
  exit(): void;
}
