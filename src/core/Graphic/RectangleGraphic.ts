// import { forEach } from 'lodash'
import AbsrtactGraphic from '.'
import { IRenderable } from '../Renderer/@types'
import Vec2 from '../Vector/Vec2'
import { IGraphic } from './@types'

export type RectangleGraphicContructor = {
  position: Vec2
  width: number
  height: number
  style?: Partial<IGraphic['style']>
}

class RectangleGraphic extends AbsrtactGraphic implements IGraphic, IRenderable {
  _position: Vec2
  width: number
  height: number
  constructor (param: RectangleGraphicContructor) {
    super()
    this._position = param.position
    this.width = param.width
    this.height = param.height
    this.style = { ...this.style, ...param.style }
  }

  get position () {
    return this._position
  }

  set position (pos: Vec2) {
    this._position = pos
  }

  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position

    ctx.fillStyle = this.style.fillStyle
    ctx.fillRect(x, y, this.width, this.height)
    ctx.fill()

    ctx.strokeStyle = this.style.strokeStyle
    ctx.strokeRect(x, y, this.width, this.height)
    ctx.stroke()
  }
}

export default RectangleGraphic
