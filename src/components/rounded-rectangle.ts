import Component from './component';
import Vector2 from '../vector2';

export default class RoundedRectangleComponent extends Component {
  readonly width: number;
  readonly height: number;
  position: Vector2;
  onHover: (() => void | undefined) | undefined;

  private ctx: CanvasRenderingContext2D;
  private strokeStyle;
  private fillStyle: string;
  private readonly radii: number[];
  private readonly originalStrokeStyle;
  private readonly originalFillStyle: string;

  constructor(
    tag: string,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    radii: number[],
    position: Vector2,
    strokeStyle: string = '#000000',
    fillStyle: string = '#ffffff',
    onHover?: (self: RoundedRectangleComponent) => void
  ) {
    super(tag);
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.radii = radii;
    this.position = position;
    this.strokeStyle = strokeStyle;
    this.originalStrokeStyle = this.strokeStyle;
    this.fillStyle = fillStyle;
    this.originalFillStyle = this.fillStyle;
    if (onHover) this.onHover = () => onHover(this);
  }

  update(elapsed: number) {
    super.update(elapsed);
    this.draw();
  }

  /**
   * Set current border color
   * @param color
   */
  setStrokeStyle(color: string) {
    this.strokeStyle = color;
  }

  /**
   * Set current fill color
   * @param color
   */
  setFillStyle(color: string) {
    this.fillStyle = color;
  }

  /**
   * Restore original styling
   */
  restore() {
    this.strokeStyle = this.originalStrokeStyle;
    this.fillStyle = this.originalFillStyle;
    document.body.style.cursor = 'default';
  }

  /**
   * Check if mouse is inside rectangle
   * @param mousePosition
   * @private
   */
  isMouseInside(mousePosition: Vector2) {
    const x = mousePosition.x;
    const y = mousePosition.y;
    return (
      x <= this.position.x + this.width &&
      x >= this.position.x &&
      y <= this.position.y + this.height &&
      y >= this.position.y
    );
  }

  /**
   * Draw the rectangle
   * @private
   */
  private draw() {
    this.ctx.save();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      this.radii
    );
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }
}
