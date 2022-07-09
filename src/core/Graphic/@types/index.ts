// import Geometry from '../../Geometry'

export interface IGraphic {
  // geometry: Geometry
  id: string
  drawOnCanvas: (ctx: CanvasRenderingContext2D) => void
}
