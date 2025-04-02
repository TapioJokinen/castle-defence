export default class DomUtils {
  static createCanvas(
    id: string,
    width: number,
    height: number,
    zIndex: string,
    className: string
  ) {
    const canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = zIndex;
    canvas.className = className;

    return canvas;
  }

  static createDiv(
    id: string,
    className: string,
    style: Partial<CSSStyleDeclaration>
  ) {
    const div = document.createElement('div');
    div.id = id;
    div.className = className;
    Object.assign(div.style, style);

    return div;
  }
}
