export class KeyboardManager {
  private keysDown = new Set<string>();
  private keysPressed = new Set<string>();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.keysDown.has(e.code)) {
      this.keysPressed.add(e.code);
    }
    this.keysDown.add(e.code);
    e.preventDefault();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keysDown.delete(e.code);
    e.preventDefault();
  };

  /** True while the key is held down */
  isDown(code: string): boolean {
    return this.keysDown.has(code);
  }

  /** True only on the first frame the key is pressed */
  isPressed(code: string): boolean {
    return this.keysPressed.has(code);
  }

  /** Call at the end of each frame to clear single-frame pressed state */
  update(): void {
    this.keysPressed.clear();
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.keysDown.clear();
    this.keysPressed.clear();
  }
}
