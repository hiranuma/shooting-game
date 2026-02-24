import { Container, Graphics } from 'pixi.js';

interface Particle {
  gfx: Graphics;
  vx: number;
  vy: number;
  life: number;
}

export class ParticleSystem {
  private readonly particles: Particle[] = [];
  private readonly container: Container;

  constructor(parent: Container) {
    this.container = new Container();
    parent.addChild(this.container);
  }

  /** Emit an explosion of small square particles */
  emit(x: number, y: number, count: number, color = 0xffffff): void {
    for (let i = 0; i < count; i++) {
      const gfx = new Graphics();
      gfx.rect(-2, -2, 4, 4);
      gfx.fill(color);
      gfx.x = x;
      gfx.y = y;
      this.container.addChild(gfx);

      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        gfx,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
      });
    }
  }

  update(_dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.gfx.x += p.vx;
      p.gfx.y += p.vy;
      p.life -= 0.02;
      p.gfx.alpha = Math.max(0, p.life);

      if (p.life <= 0) {
        this.container.removeChild(p.gfx);
        p.gfx.destroy();
        this.particles.splice(i, 1);
      }
    }
  }

  clear(): void {
    for (const p of this.particles) {
      this.container.removeChild(p.gfx);
      p.gfx.destroy();
    }
    this.particles.length = 0;
  }

  destroy(): void {
    this.clear();
    this.container.destroy();
  }
}
