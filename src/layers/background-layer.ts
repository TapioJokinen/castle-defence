import LayerManager from './layer-manager';
import TextComponent from '../components/text';
import Vector2 from '../vector2';
import RoundedRectangleComponent from '../components/rounded-rectangle';
import Component from '../components/component';
import GameManager from '../game-manager';
import MapManager from '../maps/map-manager';
import WaveManager from '../waves/wave-manager';

const BG_COLOR = '#e7e7e7';

export default class BackgroundLayer extends LayerManager {
  private readonly mapManager: MapManager;

  constructor(layer: HTMLCanvasElement) {
    super('BG_LAYER', layer);
    this.mapManager = new MapManager(this);
    this.setListeners();
  }

  update(elapsed: number) {
    this.gameManager?.waveManager.checkForWaveIdleTimer();
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

    const title = new TextComponent(
      'TITLE',
      this.ctx,
      'Castle Defence',
      '#000000',
      50,
      'normal',
      'MedievalSharp',
      new Vector2(470, 200)
    );
    const startButton = new RoundedRectangleComponent(
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
    );
    const startButtonText = new TextComponent(
      'START_BUTTON_TEXT',
      this.ctx,
      'Start Game',
      '#000000',
      20,
      'bold',
      'MedievalSharp',
      new Vector2(580, 275)
    );

    this.components.set(title.tag, title);
    this.components.set(startButton.tag, startButton);
    this.components.set(startButtonText.tag, startButtonText);

    this.render = true;
  }

  loadGame() {
    if (!this.ctx) return;

    this.components.clear();
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
        case 'START_BUTTON':
        case 'WAVE_IDLE_TIMER_BUTTON': {
          let textId = '';
          switch (component.tag) {
            case 'START_BUTTON':
              textId = 'START_BUTTON_TEXT';
              break;
            case 'WAVE_IDLE_TIMER_BUTTON':
              textId = 'WAVE_IDLE_TIMER_BUTTON_TEXT';
              break;
          }

          const text = this.components.get(textId) as TextComponent;
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

    const hitComponents: Component[] = [];
    this.components.forEach((c) => {
      if (
        c instanceof RoundedRectangleComponent &&
        c.isMouseInside(mousePosition)
      ) {
        hitComponents.push(c);
      }
    });

    hitComponents.forEach((c) => {
      if (c.tag === 'START_BUTTON') {
        this.gameManager?.changeState(this.gameManager?.gameStates.InGame);
      }
      if (c.tag === 'WAVE_IDLE_TIMER_BUTTON') {
        this.gameManager?.waveManager.skipWaveIdleTimer();
      }
    });
  }
}
