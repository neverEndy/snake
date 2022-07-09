import GraphicCollection from '../Collection/GraphicCollection'

export type ViewerConstructor = {}

class Viewer {
  container: HTMLElement
  canvas: HTMLCanvasElement
  graphics = new GraphicCollection()
  private width: number = 0
  private height: number = 0
  constructor (elem: HTMLElement, param: ViewerConstructor) {
    this.container = elem
    this.canvas = this.createCanvas()
    this.container.appendChild(this.canvas)
    this.updateCanvasSize()
  }

  get ctx () {
    const result = this.canvas.getContext('2d')
    if (!result) {
      throw new Error('canvas ctx not found')
    }
    return result
  }

  private createCanvas () {
    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    return canvas
  }

  private updateCanvasSize () {
    window.setInterval(() => {
      const { width, height } = this.canvas.getBoundingClientRect()
      if (this.width === width) return
      if (this.height === height) return
      this.width = width
      this.height = height
      this.canvas.setAttribute('width', width + 'px')
      this.canvas.setAttribute('height', height + 'px')
    })
  }
}

export default Viewer
