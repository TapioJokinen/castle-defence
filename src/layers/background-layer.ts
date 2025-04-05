import LayerManager from './layer-manager';
import TextComponent from '../components/text';
import Vector2 from '../vector2';
import RoundedRectangleComponent from '../components/rounded-rectangle';
import Component from '../components/component';
import GameManager from '../game-manager';
import MapManager from '../maps/map-manager';

const BG_COLOR = '#e7e7e7';

export default class BackgroundLayer extends LayerManager {
  private mapManager: MapManager;

  constructor(layer: HTMLCanvasElement) {
    super('BG_LAYER', layer);
    this.mapManager = new MapManager(this);
    this.setListeners();
  }

  update(elapsed: number) {
    this.checkForWaveIdleTimer();
    super.update(elapsed);
  }

  destroy() {
    super.destroy();
    const stage = this.gameEngine.getStage();
    if (!stage) return;

    stage.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }

  /**
   * Load main menu background and elements
   */
  loadMainMenu() {
    if (!this.ctx) return;

    this.layer.style.backgroundColor = BG_COLOR;

    this.components.push(
      new TextComponent(
        'TITLE',
        this.ctx,
        'Castle Defence',
        '#000000',
        50,
        'normal',
        'MedievalSharp',
        new Vector2(470, 200)
      ),
      new RoundedRectangleComponent(
        'START_BUTTON',
        this.ctx,
        150,
        35,
        [8],
        new Vector2(560, 250),
        '#000000',
        '#ffffff',
        (self: RoundedRectangleComponent) => {
          self.setFillStyle('#56795e');
          document.body.style.cursor = 'pointer';
        }
      ),
      new TextComponent(
        'START_BUTTON_TEXT',
        this.ctx,
        'Start Game',
        '#000000',
        20,
        'bold',
        'MedievalSharp',
        new Vector2(580, 275)
      )
    );

    this.render = true;
  }

  loadGame() {
    if (!this.ctx) return;

    this.components = [];
    this.mapManager.loadMap(1);
    this.render = true;
  }

  getContext() {
    return this.ctx;
  }

  /**
   * Handle component action when mouse moves
   * @param component
   * @param mousePosition
   * @private
   */
  private handleMouseMove<T extends Component>(
    component: T,
    mousePosition: Vector2
  ) {
    if (component instanceof RoundedRectangleComponent) {
      switch (component.tag) {
        case 'START_BUTTON': {
          const text =
            this.gameEngine.findComponentByTag<TextComponent>(
              'START_BUTTON_TEXT'
            );
          if (!text) return;

          if (component.isMouseInside(mousePosition)) {
            text.setFillStyle('#ffffff');
            component.onHover?.();
          } else {
            component.restore();
            text.restore();
          }

          this.render = true;
          break;
        }
      }
    }
  }

  /**
   * Install event listeners
   * @private
   */
  private setListeners() {
    const stage = this.gameEngine.getStage();
    if (!stage) return;

    stage.addEventListener('mousemove', this.onMouseMove.bind(this));
    stage.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  /**
   * Callback for 'mousemove' listener
   * @param event
   * @private
   */
  private onMouseMove(event: MouseEvent) {
    const mousePosition = new Vector2(event.offsetX, event.offsetY);
    this.components.forEach((c) => this.handleMouseMove(c, mousePosition));
  }

  /**
   * Callback for 'mousedown' listener
   * @param event
   * @private
   */
  private onMouseDown(event: MouseEvent) {
    const mousePosition = new Vector2(event.offsetX, event.offsetY);
    const hitComponents = this.components.filter(
      (c) =>
        c instanceof RoundedRectangleComponent && c.isMouseInside(mousePosition)
    );

    hitComponents.forEach((c) => {
      if (c.tag === 'START_BUTTON') {
        const gameManager =
          this.gameEngine.findComponentByTag<GameManager>('GAME_MANAGER');
        if (gameManager) {
          gameManager.changeState(gameManager.gameStates.InGame);
        }
      }
    });
  }

  private checkForWaveIdleTimer() {
    if (!this.gameManager) return;

    if (this.gameManager.waveIdleTimerS > 0) {
      this.createWaveIdleTimerIfNotExist();
      this.setWaveIdleTimerText();
      this.render = true;
    } else {
      this.removeWaveIdleTimer();
    }
  }

  /**
   * Create wave idle timer component, if it does not exist
   * @private
   */
  private createWaveIdleTimerIfNotExist() {
    if (!this.ctx) return;

    const c = this.components.find((c) => c.tag === 'WAVE_IDLE_TIMER');
    if (c) return;

    this.components.push(
      new TextComponent(
        'WAVE_IDLE_TIMER',
        this.ctx,
        'Next wave starts in:',
        '#000000',
        20,
        'bold',
        'MedievalSharp',
        new Vector2(5, 30)
      )
    );
  }

  /**
   * Set wave idle timer's text
   * @private
   */
  private setWaveIdleTimerText() {
    const c = this.components.find(
      (c) => c.tag === 'WAVE_IDLE_TIMER'
    ) as TextComponent;
    if (!c || !this.gameManager) return;

    const textString = `Next wave starts in: ${Math.floor(this.gameManager.waveIdleTimerS)}s`;
    c.setText(textString);
  }

  /**
   * Remove wave idle timer component
   * @private
   */
  private removeWaveIdleTimer() {
    const c = this.components.find((c) => c.tag === 'WAVE_IDLE_TIMER');
    if (!c) return;

    this.removeComponent(c);
    this.render = true;
  }
}
