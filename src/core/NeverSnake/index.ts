import RectangleGraphic, { RectangleGraphicContructor } from '../Graphic/RectangleGraphic'
import Vec2 from '../Vector/Vec2'
import Graphic from '../Graphic'
import Event from '../utils/Event'
import SnakeControl from './SnakeControl'

class NeverSnake extends Graphic {
  headGraphic: RectangleGraphic
  size: number
  direction: Vec2 = Vec2.CreateDirectionDown()
  body: Array<RectangleGraphic> = []
  moveEvent = new Event<Vec2>()
  growEvent = new Event<NeverSnake>()
  control = new SnakeControl()
  private controlEvents: Array<() => void> = []
  private _movementIntervalId: number = NaN
  private _speed = 100
  private _isStart = false
  constructor (size: number) {
    super()
    this.size = size
    this.headGraphic = this.createShape(new Vec2(), { fillStyle: 'red' })
    this.nextMovement = this.nextMovement.bind(this)
  }

  get position () {
    return this.headGraphic.position
  }

  set position (position: Vec2) {
    this.headGraphic.position = position.clone()
  }

  get speed () {
    return this._speed
  }

  set speed (val: number) {
    if (!this._isStart) {
      this._speed = val
      return
    }
    window.clearInterval(this._movementIntervalId)
    this._movementIntervalId = window.setInterval(this.nextMovement, val)
  }

  get length () {
    return this.body.length
  }

  get reverseDirection (): Vec2 {
    return new Vec2(this.direction.x * -1, this.direction.y * -1)
  }

  attachControl () {
    const removeEvents = [
      this.control.moveUpEvent.addListener(() => this.move(Vec2.CreateDirectionUp())),
      this.control.moveRightEvent.addListener(() => this.move(Vec2.CreateDirectionRight())),
      this.control.moveDownEvent.addListener(() => this.move(Vec2.CreateDirectionDown())),
      this.control.moveLeftEvent.addListener(() => this.move(Vec2.CreateDirectionLeft()))
    ]
    this.controlEvents = removeEvents
    this.control.start()
  }

  removeControl () {
    this.controlEvents.forEach(remove => remove())
    this.control.stop()
  }

  start () {
    this._movementIntervalId = window.setInterval(this.nextMovement, this.speed)
    this._isStart = true
  }

  stop () {
    window.clearInterval(this._movementIntervalId)
    this._movementIntervalId = NaN
    this._isStart = false
  }

  createShape (position: Vec2 = new Vec2(), style?: RectangleGraphicContructor['style']) {
    const graphic = new RectangleGraphic({
      position,
      width: this.size,
      height: this.size,
      style
    })
    return graphic
  }

  grow () {
    const newPosition = this.body.at(-1)?.position.clone() || this.position.clone()
    newPosition.move(this.reverseDirection, this.size)
    const graphic = this.createShape(newPosition, { fillStyle: 'gray' })
    this.body.push(graphic)
    this.growEvent.dispatch(this)
  }

  nextMovement () {
    const headPosition = this.position
    let refPosition = headPosition.clone()
    this.position = headPosition.move(this.direction, this.size)
    this.body.forEach(item => {
      const newRefPosition = item.position.clone()
      item.position = refPosition.clone()
      refPosition = newRefPosition
    })
    this.moveEvent.dispatch(this.position)
  }

  move (direction: Vec2) {
    const isCollision = this.checkSelfDirectionCollision(direction)
    if (isCollision) return
    this.direction = direction.clone()
  }

  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    this.headGraphic.drawOnCanvas(ctx)
    this.body.forEach(graphic => graphic.drawOnCanvas(ctx))
  }

  private checkSelfDirectionCollision (nextDirection: Vec2) {
    return this.reverseDirection.isEqualTo(nextDirection)
  }
}

export default NeverSnake
