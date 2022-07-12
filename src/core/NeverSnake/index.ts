import RectangleGraphic from '../Graphic/RectangleGraphic'
import Vec2, { Direction } from '../Vector/Vec2'
import Graphic from '../Graphic'
import Event from '../utils/Event'

class NeverSnake extends Graphic {
  headGraphic: RectangleGraphic
  size: number
  direction: Direction = 'down'
  position: Vec2
  body: Array<RectangleGraphic> = []
  moveEvent = new Event<Vec2>()
  private _movementIntervalId: number = NaN
  private _speed = 100
  constructor (size: number) {
    super()
    this.size = size
    this.headGraphic = this.createShape()
    this.position = this.headGraphic.startPosition
    this.nextMovement = this.nextMovement.bind(this)
    this._movementIntervalId = window.setInterval(this.nextMovement, this.speed)
  }

  get speed () {
    return this._speed
  }

  set speed (val: number) {
    window.clearInterval(this._movementIntervalId)
    this._movementIntervalId = window.setInterval(this.nextMovement, val)
  }

  get length () {
    return this.body.length
  }

  get reverseDirection (): Direction {
    switch (this.direction) {
      case 'up':
        return 'down'
      case 'down':
        return 'up'
      case 'left':
        return 'right'
      default:
        return 'left'
    }
  }

  stop () {
    window.clearInterval(this._movementIntervalId)
    this._movementIntervalId = NaN
  }

  createShape (position: Vec2 = new Vec2()) {
    const graphic = new RectangleGraphic({
      startPosition: position,
      width: this.size,
      height: this.size
    })
    return graphic
  }

  grow () {
    const newPosition = this.body.at(-1)?.startPosition.clone() || this.position.clone()
    newPosition.move(this.reverseDirection, this.size)
    const graphic = this.createShape(newPosition)
    this.body.push(graphic)
  }

  nextMovement () {
    const headPosition = this.position
    let refPosition = headPosition.clone()
    headPosition.move(this.direction, this.size)
    this.body.forEach(item => {
      const position = item.startPosition
      const clonePosition = position.clone()
      position.move(position.getDirectionTo(refPosition)!, this.size)
      refPosition = clonePosition
    })
    this.moveEvent.dispatch(this.position)
  }

  move (direction: Direction) {
    this.direction = direction
  }

  drawOnCanvas (ctx: CanvasRenderingContext2D) {
    this.headGraphic.drawOnCanvas(ctx)
    this.body.forEach(graphic => graphic.drawOnCanvas(ctx))
  }
}

export default NeverSnake
