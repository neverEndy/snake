class Vec2 {
  x: number
  y: number
  constructor (x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  static CreateDirectionUp () {
    return new Vec2(0, -1)
  }

  static CreateDirectionDown () {
    return new Vec2(0, 1)
  }

  static CreateDirectionRight () {
    return new Vec2(1, 0)
  }

  static CreateDirectionLeft () {
    return new Vec2(-1, 0)
  }

  clone () {
    return new Vec2(this.x, this.y)
  }

  distanceTo (vec: Vec2) {
    const a = Math.abs(this.x - vec.x)
    const b = Math.abs(this.y - vec.y)
    return Math.sqrt(a ** 2 + b ** 2)
  }

  isEqualTo (vec: Vec2) {
    const xCompare = Math.abs(this.x - vec.x) < 0.0001
    const yCompare = Math.abs(this.y - vec.y) < 0.0001
    return xCompare && yCompare
  }

  moveRight (dist: number = 1) {
    this.x += dist
    return this
  }

  moveLeft (dist: number = 1) {
    this.moveRight(-dist)
    return this
  }

  moveUp (dist: number = 1) {
    this.moveDown(-dist)
    return this
  }

  moveDown (dist: number = 1) {
    this.y += dist
    return this
  }

  move (direction: Vec2, val: number = 1) {
    const isDown = direction.isEqualTo(Vec2.CreateDirectionDown())
    const isUp = direction.isEqualTo(Vec2.CreateDirectionUp())
    const isRight = direction.isEqualTo(Vec2.CreateDirectionRight())
    const isLeft = direction.isEqualTo(Vec2.CreateDirectionLeft())

    if (isDown) return this.moveDown(val)
    if (isUp) return this.moveUp(val)
    if (isRight) return this.moveRight(val)
    if (isLeft) return this.moveLeft(val)

    throw new Error(`direction x: ${direction.x}, y: ${direction.y}, is not typeof direction`)
  }

  moveReverse (direction: Vec2, val: number = 1) {
    const isDown = direction.isEqualTo(Vec2.CreateDirectionDown())
    const isUp = direction.isEqualTo(Vec2.CreateDirectionUp())
    const isRight = direction.isEqualTo(Vec2.CreateDirectionRight())
    const isLeft = direction.isEqualTo(Vec2.CreateDirectionLeft())

    const getReverse = (dir: Vec2) => {
      if (isDown) return Vec2.CreateDirectionUp()
      if (isUp) return Vec2.CreateDirectionDown()
      if (isRight) return Vec2.CreateDirectionLeft()
      if (isLeft) return Vec2.CreateDirectionRight()
      throw new Error(`direction x: ${dir.x}, y: ${dir.y}, is not typeof direction`)
    }
    return this.move(getReverse(direction), val)
  }

  getDirectionTo (vec2: Vec2): Vec2 | undefined {
    if (vec2.x > this.x) return Vec2.CreateDirectionRight()
    if (vec2.x < this.x) return Vec2.CreateDirectionLeft()
    if (vec2.y > this.y) return Vec2.CreateDirectionDown()
    if (vec2.y < this.y) return Vec2.CreateDirectionUp()
    return undefined
  }
}

export default Vec2
