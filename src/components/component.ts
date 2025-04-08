import GameEngine from '../game-engine';

export default class Component {
  tag: string;
  gameEngine: GameEngine;

  constructor(tag?: string) {
    this.tag = tag || crypto.randomUUID();
    this.gameEngine = GameEngine.instance;
  }

  /**
   * Update the component
   * @param elapsed
   */
  update(elapsed: number) {}

  /**
   * Destroy the component
   */
  destroy() {}
}
