/**
 * This structure is used in some places to represent 2D positions and vectors
 */
export default class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Calculate a direction vector from one point to another.
   * @param from
   * @param to
   */
  static direction(from: Vector2, to: Vector2): Vector2 {
    return new Vector2(to.x - from.x, to.y - from.y);
  }

  /**
   * Calculate the magnitude of a vector.
   * @param vector
   */
  static magnitude(vector: Vector2): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }

  /**
   * Clone this vector.
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Check if this vector is equal to another vector within a tolerance.
   * @param vector
   * @param tolerance
   */
  equalsTolerance(vector: Vector2, tolerance: number): boolean {
    return (
      Math.abs(this.x - vector.x) <= tolerance &&
      Math.abs(this.y - vector.y) <= tolerance
    );
  }

  /**
   * Return a new normalized vector from this vector
   */
  normalize(): Vector2 {
    const magnitude = Vector2.magnitude(this);
    return new Vector2(this.x / magnitude, this.y / magnitude);
  }
}
