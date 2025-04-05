import Component from '../components/component';
import GameManager from '../game-manager';
import TextComponent from '../components/text';

export default class LayerManager extends Component {
  components: Component[];
  render: boolean;
  protected layer: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D | null;
  protected gameManager: GameManager | undefined;

  constructor(tag: string, layer: HTMLCanvasElement) {
    super(tag);
    this.render = false;
    this.layer = layer;
    this.ctx = this.layer.getContext('2d');
    this.components = [];
  }

  update(elapsed: number) {
    super.update(elapsed);
    if (!this.render) return;
    this.ctx?.clearRect(0, 0, this.gameEngine.width, this.gameEngine.height);
    this.components.forEach((c) => c.update(elapsed));
    this.render = false;
  }

  /**
   * Remove component from layer's component-list
   * @param component
   */
  removeComponent(component: Component) {
    const c = this.components.find((c) => c.tag === component.tag);
    if (!c) return;

    c.destroy();
    this.components = this.components.filter((_c) => _c.tag !== c.tag);
  }

  /**
   * Set game manager reference for layer manager
   * @param gameManager
   */
  setGameManager(gameManager: GameManager) {
    this.gameManager = gameManager;
  }
}
