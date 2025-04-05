import Component from './component';
import Vector2 from '../vector2';

export default class Route extends Component {
  private ctx: CanvasRenderingContext2D;
  private readonly points: Vector2[];
  private readonly width: number;

  constructor(
    tag: string,
    ctx: CanvasRenderingContext2D,
    points: Vector2[],
    width: number
  ) {
    super(tag);
    this.ctx = ctx;
    this.points = points;
    this.width = width;
  }

  update(elapsed: number) {
    super.update(elapsed);
    this.drawBorders();
    this.drawFills();
  }

  /**
   * Draw borders of the route
   * @private
   */
  private drawBorders() {
    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.width;
    this.ctx.strokeStyle = '#000000';

    this.drawPoints();
  }

  /**
   * Draw fillings of the route
   * @private
   */
  private drawFills() {
    this.ctx.save();
    this.ctx.lineWidth = this.width * 0.85;
    this.ctx.strokeStyle = '#d9d9d9';

    this.drawPoints();
  }

  /**
   * Draw the points of the route
   * @private
   */
  private drawPoints() {
    for (let i = 0; i < this.points.length; i++) {
      if (i < 1) continue;

      const prevPoint = this.points[i - 1];
      const point = this.points[i];

      this.ctx.beginPath();
      this.ctx.moveTo(prevPoint.x, prevPoint.y);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    }
  }
}
