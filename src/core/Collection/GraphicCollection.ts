import Collection from '.'
import Graphic from '../Graphic'
import { IRenderable } from '../Renderer/@types'

class GraphicCollection<P extends Graphic> extends Collection<P> implements IRenderable {
  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    for (const graphic of this.values) {
      graphic.drawOnCanvas(ctx)
    }
  }
}

export default GraphicCollection
