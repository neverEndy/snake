import { GameOptions } from '.'
import Vec2 from '../Vector/Vec2'
class CoordinateSystem {
  size: GameOptions['size']
  unit: GameOptions['unit']
  constructor (param: GameOptions) {
    this.size = param.size
    this.unit = param.unit
    this.renderGrid = this.renderGrid.bind(this)
  }

  get gridLength () {
    return this.size / this.unit + 1
  }

  get localBoundary () {
    return {
      upperLeft: new Vec2(0, 0),
      lowerRight: new Vec2(this.gridLength * this.unit, this.gridLength * this.unit)
    }
  }

  generateLocalPositions () {
    const result: Vec2[] = []
    for (let iy = 0; iy < this.gridLength; iy++) {
      const y = iy * this.unit
      for (let ix = 0; ix < this.gridLength; ix++) {
        const x = ix * this.unit
        result.push(new Vec2(x, y))
      }
    }
    return result
  }

  renderGrid (ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.gridLength; i++) {
      const p = i * this.unit
      const startColPoint = new Vec2(p, 0)
      const endColPoint = new Vec2(p, this.size)
      const startRowPoint = new Vec2(0, p)
      const endRowPoint = new Vec2(this.size, p)
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

  toGlobal (pos: Vec2) {
    return new Vec2(pos.x * this.unit, pos.y * this.unit)
  }

  toLocal (pos: Vec2) {
    return new Vec2(pos.x / this.unit, pos.y / this.unit)
  }
}

export default CoordinateSystem
