import Vec2 from '../../Vector/Vec2'

export type CoordinateSystemConstructor = {
  size: number
  unit: number
}

class CoordinateSystem {
  size: CoordinateSystemConstructor['size']
  unit: CoordinateSystemConstructor['unit']
  constructor (param: CoordinateSystemConstructor) {
    this.size = param.size
    this.unit = param.unit
  }

  get gridLength () {
    return this.size
  }

  get localBoundary () {
    return {
      upperLeft: new Vec2(0, 0),
      lowerRight: new Vec2(this.gridLength - 1, this.gridLength - 1)
    }
  }

  generateLocalPositions () {
    const result: Vec2[] = []
    for (let iy = 0; iy < this.gridLength; iy++) {
      const y = iy * this.unit
      for (let ix = 0; ix < this.gridLength; ix++) {
        const x = ix * this.unit
        result.push(new Vec2(x, y))
      }
    }
    return result
  }

  toGlobal (pos: Vec2) {
    return new Vec2(pos.x * this.unit, pos.y * this.unit)
  }

  toLocal (pos: Vec2) {
    return new Vec2(pos.x / this.unit, pos.y / this.unit)
  }
}

export default CoordinateSystem
