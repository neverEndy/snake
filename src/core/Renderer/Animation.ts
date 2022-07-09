import Event from '../utils/Event'

class Animation {
  private _isStart: boolean = false
  private _fps: number = 30
  private startTime: number = NaN
  private then: number = NaN
  private now: number = Date.now()
  private elapsed: number = NaN
  private fpsInterval: number = 0
  private taskEvent = new Event()
  constructor (fps: number = 30) {
    this._fps = fps
    this.render = this.render.bind(this)
  }

  get fps () {
    return this._fps
  }

  get isStart () {
    return this._isStart
  }

  addTask (task: () => void) {
    return this.taskEvent.addListener(task)
  }

  removeTask (task: () => void) {
    this.taskEvent.removeListener(task)
  }

  start () {
    this._isStart = true
    this.fpsInterval = 1000 / this.fps
    this.then = Date.now()
    this.startTime = this.then
    this.render()
  }

  stop () {
    this._isStart = false
  }

  private render () {
    if (!this.isStart) return
    window.requestAnimationFrame(this.render)
    this.now = Date.now()
    this.elapsed = this.now - this.then
    if (this.elapsed > this.fpsInterval) {
      this.then = this.now - (this.elapsed % this.fpsInterval)
      this.taskEvent.dispatch()
    }
  }
}

export default Animation
