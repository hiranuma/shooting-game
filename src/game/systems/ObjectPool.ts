import { Container } from 'pixi.js';
import type { Entity } from '../entities/Entity.ts';

export class ObjectPool<T extends Entity> {
  private readonly items: T[] = [];
  private readonly factory: () => T;
  private readonly parent: Container | undefined;

  constructor(factory: () => T, initialSize: number, parent?: Container) {
    this.factory = factory;
    this.parent = parent;
    for (let i = 0; i < initialSize; i++) {
      this.items.push(this.createItem());
    }
  }

  private createItem(): T {
    const item = this.factory();
    item.active = false;
    item.container.visible = false;
    this.parent?.addChild(item.container);
    return item;
  }

  get(): T {
    for (const item of this.items) {
      if (!item.active) {
        item.active = true;
        item.container.visible = true;
        return item;
      }
    }
    const item = this.createItem();
    item.active = true;
    item.container.visible = true;
    this.items.push(item);
    return item;
  }

  getActive(): T[] {
    return this.items.filter((i) => i.active);
  }

  releaseAll(): void {
    for (const item of this.items) {
      item.active = false;
      item.container.visible = false;
    }
  }
}
