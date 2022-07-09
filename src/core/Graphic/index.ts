import { IGraphic } from './@types'
import { uniqueId } from 'lodash'
import { IRenderable } from '../Renderer/@types'

class Graphic implements IGraphic, IRenderable {
  id = uniqueId()

  init () {}

  drawOnCanvas (ctx: CanvasRenderingContext2D) {
  }
}

export default Graphic
