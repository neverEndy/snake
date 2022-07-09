import Graphic from '.'
import Vec2 from '../Vector/Vec2'
import { IGraphic } from './@types'

export type RectangleGraphicContructor = {
  startPosition: Vec2
  width: number
  height: number
}

class RectangleGraphic extends Graphic implements IGraphic {
  startPosition: Vec2
  width: number
  height: number
  constructor (param: RectangleGraphicContructor) {
    super()
    this.startPosition = param.startPosition
    this.width = param.width
    this.height = param.height
  }

  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    const { x, y } = this.startPosition
    ctx.fillRect(x, y, this.width, this.height)
    ctx.strokeRect(x, y, this.width, this.height)
    ctx.strokeStyle = '#fff'
  }
}

export default RectangleGraphic
