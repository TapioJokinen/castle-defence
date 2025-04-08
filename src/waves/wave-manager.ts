import TextComponent from '../components/text';
import Vector2 from '../vector2';
import RoundedRectangleComponent from '../components/rounded-rectangle';
import GameManager from '../game-manager';
import GameEngine from '../game-engine';
import BackgroundLayer from '../layers/background-layer';

export default class WaveManager {
  private gameEngine: GameEngine;
  private waveIdleTimerS: number;
  private readonly gameManager: GameManager;
  private readonly backgroundLayer: BackgroundLayer;

  constructor(gameManager: GameManager) {
    this.waveIdleTimerS = -1;

    this.gameManager = gameManager;
    this.gameEngine = gameManager.gameEngine;

    const backgroundLayer = this.gameEngine.backgroundLayer;
    if (backgroundLayer) {
      this.backgroundLayer = backgroundLayer;
    } else {
      throw new Error('Unknown background layer');
    }
  }

  checkForWaveIdleTimer() {
    if (!this.gameManager) return;

    if (this.waveIdleTimerS > 0) {
      this.createWaveIdleTimerIfNotExist();
      this.setWaveIdleTimerText();
      this.backgroundLayer.render = true;
    } else {
      this.removeWaveIdleTimer();
    }
  }

  /**
   * Reduce wave idle timer value by given amount
   * @param elapsed
   */
  reduceWaveIdleTimer(elapsed: number) {
    this.waveIdleTimerS -= elapsed;
  }

  /**
   * Set wave idle timer value (seconds)
   * @param seconds
   */
  setWaveIdleTimer(seconds: number) {
    this.waveIdleTimerS = seconds;
  }

  /**
   * Skip wave idle timer by setting the value to -1
   */
  skipWaveIdleTimer() {
    this.setWaveIdleTimer(-1);
  }

  /**
   * Create wave idle timer component, if it does not exist
   * @private
   */
  private createWaveIdleTimerIfNotExist() {
    const ctx = this.backgroundLayer.getContext();
    if (!ctx) return;

    const components = this.backgroundLayer.components;

    const c1 = components.get('WAVE_IDLE_TIMER');
    if (!c1) {
      const text = new TextComponent(
        'WAVE_IDLE_TIMER',
        ctx,
        'Next wave starts in:',
        '#000000',
        20,
        'bold',
        'MedievalSharp',
        new Vector2(5, 30)
      );

      components.set(text.tag, text);
      this.backgroundLayer.render = true;
    }

    const c2 = components.get('WAVE_IDLE_TIMER_BUTTON');
    if (!c2) {
      const button = new RoundedRectangleComponent(
        'WAVE_IDLE_TIMER_BUTTON',
        ctx,
        100,
        25,
        [8],
        new Vector2(240, 10),
        '#000000',
        '#ffffff',
        (self: RoundedRectangleComponent) => {
          self.setFillStyle('#56795e');
          document.body.style.cursor = 'pointer';
        }
      );
      const buttonText = new TextComponent(
        'WAVE_IDLE_TIMER_BUTTON_TEXT',
        ctx,
        'Skip',
        '#000000',
        16,
        'bold',
        'MedievalSharp',
        new Vector2(270, 28)
      );

      components.set(button.tag, button);
      components.set(buttonText.tag, buttonText);
      this.backgroundLayer.render = true;
    }
  }

  /**
   * Set wave idle timer's text
   * @private
   */
  private setWaveIdleTimerText() {
    const components = this.backgroundLayer.components;
    const c = components.get('WAVE_IDLE_TIMER') as TextComponent;

    const timeLeft = Math.floor(this.waveIdleTimerS);
    const textString = `Next wave starts in: ${timeLeft}s`;
    c.setText(textString);

    this.backgroundLayer.render = true;
  }

  /**
   * Remove wave idle timer component
   * @private
   */
  private removeWaveIdleTimer() {
    const components = this.backgroundLayer.components;
    const toRemove = [
      components.get('WAVE_IDLE_TIMER'),
      components.get('WAVE_IDLE_TIMER_BUTTON'),
      components.get('WAVE_IDLE_TIMER_BUTTON_TEXT'),
    ];

    for (const toRemoveElement of toRemove) {
      if (!toRemoveElement) continue;

      this.backgroundLayer.removeComponent(toRemoveElement.tag);
      this.backgroundLayer.render = true;
    }
  }
}
