import Collection from '.'
import Graphic from '../Graphic'
import { IRenderable } from '../Renderer/@types'

class GraphicCollection extends Collection<Graphic> implements IRenderable {
  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    for (const graphic of this.values) {
      graphic.drawOnCanvas(ctx)
    }
  }
}

export default GraphicCollection
