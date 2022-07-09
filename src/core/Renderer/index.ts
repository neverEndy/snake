import Viewer from '../Viewer'
import Animation from './Animation'

export type RendererContructor = {
  viewer: Viewer
  fps?: number
}

class Renderer {
  private animation: Animation
  viewer: Viewer
  constructor (param: RendererContructor) {
    this.animation = new Animation(param.fps)
    this.viewer = param.viewer
    this.render = this.render.bind(this)
  }

  start () {
    this.animation.addTask(this.render)
    this.animation.start()
  }

  stop () {
    this.animation.removeTask(this.render)
    this.animation.stop()
  }

  addTask (task: () => void) {
    return this.animation.addTask(task)
  }

  removeTask (task: () => void) {
    this.animation.removeTask(task)
  }

  render () {
    this.clear()
    this.viewer.graphics.drawOnCanvas(this.viewer.ctx)
  }

  clear () {
    const { width, height } = this.viewer.canvas.getBoundingClientRect()
    this.viewer.ctx.clearRect(0, 0, width, height)
  }
}

export default Renderer
