import Component from '../components/component';

export default class LayerManager extends Component {
  components: Component[];
  render: boolean;
  protected layer: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D | null;

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
}
