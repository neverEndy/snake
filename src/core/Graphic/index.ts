import { IGraphic } from './@types'
import { uniqueId } from 'lodash'
import { IRenderable } from '../Renderer/@types'
import Vec2 from '../Vector/Vec2'

abstract class AbsrtactGraphic implements IGraphic, IRenderable {
  id = uniqueId()
  style: IGraphic['style'] = { strokeStyle: '#fff', fillStyle: '#000' }

  get position () {
    return new Vec2()
  }

  init () {}

  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    console.warn('override draw method', ctx)
  }
}

export default AbsrtactGraphic
