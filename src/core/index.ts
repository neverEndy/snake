import Viewer, { ViewerConstructor } from './Viewer'
import Renderer from './Renderer'
import Game, { GameOptions } from './Game'

export type SnakeCoreContructor = {
  elem: HTMLElement
  fps?: number
  gameOptions: GameOptions
} & ViewerConstructor

class SnakeCore {
  viewer: Viewer
  renderer: Renderer
  game: Game
  constructor (param: SnakeCoreContructor) {
    this.viewer = new Viewer(param.elem, param)
    this.renderer = new Renderer({ viewer: this.viewer, fps: param.fps })
    this.game = new Game({ ...param.gameOptions, viewer: this.viewer, renderer: this.renderer })
    this.renderer.start()
  }
}

export default SnakeCore
