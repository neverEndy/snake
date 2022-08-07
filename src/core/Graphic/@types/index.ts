import Vec2 from "src/core/Vector/Vec2";

export interface IGraphic {
  // _position: Vec2
  readonly position: Vec2
  id: string
  style: Pick<CanvasRenderingContext2D, 'strokeStyle' | 'fillStyle'>
  drawOnCanvas: (ctx: CanvasRenderingContext2D) => void
}
