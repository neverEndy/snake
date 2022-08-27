import Vec2 from '../../Vector/Vec2'
import CoordinateSystem, { CoordinateSystemConstructor } from './CoordinateSystem'

export type GridBoardConstructor = CoordinateSystemConstructor

class GridBoard {
  coordinateSystem: CoordinateSystem

  constructor (options: GridBoardConstructor) {
    this.coordinateSystem = new CoordinateSystem(options)
  }

  renderGrid (ctx: CanvasRenderingContext2D) {
    for (let i = 0; i <= this.coordinateSystem.gridLength; i++) {
      const p = i * this.coordinateSystem.unit
      const startColPoint = new Vec2(p, 0)
      const endColPoint = new Vec2(p, (this.coordinateSystem.size) * this.coordinateSystem.unit)
      const startRowPoint = new Vec2(0, p)
      const endRowPoint = new Vec2((this.coordinateSystem.size) * this.coordinateSystem.unit, p)
      ctx.beginPath()
      ctx.moveTo(startColPoint.x, startColPoint.y)
      ctx.lineTo(endColPoint.x, endColPoint.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(startRowPoint.x, startRowPoint.y)
      ctx.lineTo(endRowPoint.x, endRowPoint.y)
      ctx.stroke()
    }
  }
}

export default GridBoard
