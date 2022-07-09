export type Direction = 'up' | 'right' | 'down' | 'left'

class Vec2 {
  x: number
  y: number
  constructor (x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
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
    return this.x === vec.x && this.y === vec.y
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

  move (direction: Direction, val: number = 1) {
    switch (direction) {
      case 'down':
        return this.moveDown(val)
      case 'left':
        return this.moveLeft(val)
      case 'right':
        return this.moveRight(val)
      case 'up':
        return this.moveUp(val)
    }
  }

  moveReverse (direction: Direction, val: number = 1) {
    const getReverse = (dir: Direction) => {
      switch (dir) {
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
    return this.move(getReverse(direction), val)
  }

  getDirectionTo (vec2: Vec2): Direction | undefined {
    if (vec2.x > this.x) return 'right'
    if (vec2.x < this.x) return 'left'
    if (vec2.y > this.y) return 'down'
    if (vec2.y < this.y) return 'up'
    return undefined
  }
}

export default Vec2
