import LayerManager from './layer-manager';
import TextComponent from '../components/text';
import Vector2 from '../vector2';
import RoundedRectangleComponent from '../components/rounded-rectangle';
import Component from '../components/component';
import GameManager from '../game-manager';

export default class BackgroundLayer extends LayerManager {
  constructor(layer: HTMLCanvasElement) {
    super('BG_LAYER', layer);
    this.setListeners();
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

    this.layer.style.backgroundColor = '#e7e7e7';

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

    this.layer.style.backgroundColor = '#545454';
    this.components = [];
    this.render = true;
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
}
