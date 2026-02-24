import { Container } from 'pixi.js';

export abstract class Entity {
  readonly container: Container;
  active = true;

  /** Half-width and half-height for AABB collision */
  hitboxW: number;
  hitboxH: number;

  constructor(hitboxW: number, hitboxH: number) {
    this.container = new Container();
    this.hitboxW = hitboxW;
    this.hitboxH = hitboxH;
  }

  get x(): number {
    return this.container.x;
  }
  set x(v: number) {
    this.container.x = v;
  }

  get y(): number {
    return this.container.y;
  }
  set y(v: number) {
    this.container.y = v;
  }

  abstract update(dt: number): void;

  /** AABB overlap check (half-size based) */
  collidesWith(other: Entity): boolean {
    return (
      Math.abs(this.x - other.x) < this.hitboxW + other.hitboxW &&
      Math.abs(this.y - other.y) < this.hitboxH + other.hitboxH
    );
  }

  destroy(): void {
    this.active = false;
    this.container.destroy({ children: true });
  }
}
