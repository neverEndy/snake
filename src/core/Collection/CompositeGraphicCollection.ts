import Collection from '.'
import GraphicCollection from './GraphicCollection'
import { IRenderable } from '../Renderer/@types'
import Graphic from '../Graphic'

class CompositeGraphicCollection<P extends Graphic> extends Collection<GraphicCollection<P>> implements IRenderable {
  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    for (const collection of this.values) {
      collection.drawOnCanvas(ctx)
    }
  }
}

export default CompositeGraphicCollection
