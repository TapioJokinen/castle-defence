import Component from './component';
import Vector2 from '../vector2';

export default class TextComponent extends Component {
  text: string;
  position: Vector2;
  onHover: (() => void | undefined) | undefined;

  private ctx: CanvasRenderingContext2D;
  private fillStyle: string;
  private readonly fontSize: number;
  private readonly fontWeight: string;
  private readonly fontFamily: string;
  private readonly originalFillStyle: string;

  constructor(
    tag: string,
    ctx: CanvasRenderingContext2D,
    text: string,
    color: string,
    fontSize: number,
    fontWeight: string,
    fontFamily: string,
    position: Vector2,
    onHover?: (self: TextComponent) => void
  ) {
    super(tag);
    this.ctx = ctx;
    this.text = text;
    this.fillStyle = color;
    this.originalFillStyle = this.fillStyle;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.fontFamily = fontFamily;
    this.position = position;
    if (onHover) this.onHover = () => onHover(this);
  }

  update(elapsed: number) {
    super.update(elapsed);
    this.draw();
  }

  /**
   * Set text for the text component
   * @param text
   */
  setText(text: string): void {
    this.text = text;
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
    this.fillStyle = this.originalFillStyle;
    document.body.style.cursor = 'default';
  }

  private draw() {
    this.ctx.save();
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.font = this.getFont();
    this.ctx.fillText(this.text, this.position.x, this.position.y);
    this.ctx.restore();
  }

  private getFont() {
    return `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
  }
}
