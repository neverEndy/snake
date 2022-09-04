import Viewer from '../Viewer'
import Renderer from '../Renderer'
import NeverSnake from '../NeverSnake'
import { shuffle } from 'lodash'
import RectangleGraphic from '../Graphic/RectangleGraphic'
import Vec2 from '../Vector/Vec2'
import Event from '../utils/Event'
import GraphicCollection from '../Collection/GraphicCollection'
import GridBoard from './GridBoard'

export type GameOptions = {
  unit: number
  size: number
  seeds: number
  speed: number
}

interface IGame {
  options: GameOptions
  viewer: Viewer
  renderer: Renderer
  start: () => void
  stop: () => void
}

export type GameConstructor = GameOptions & { viewer: Viewer, renderer: Renderer }

class Game implements IGame {
  options: GameOptions
  viewer: Viewer
  renderer: Renderer
  snake: NeverSnake
  gridBoard: GridBoard
  randomSeed = new GraphicCollection()
  failedEvent = new Event()
  winEvent = new Event()
  private _isStart = false
  private removeEvents: Array<ReturnType<Event['addListener']>> = []
  constructor (options: GameConstructor) {
    this.options = options
    this.viewer = options.viewer
    this.renderer = options.renderer
    this.gridBoard = new GridBoard(options)
    this.snake = new NeverSnake(options.unit)
    this.viewer.compositeGraphics.add(this.randomSeed)
  }

  setSpeed (val: number) {
    this.snake.speed = val
    this.options.speed = val
  }

  setUnit (val: number) {
    this.gridBoard.coordinateSystem.unit = val
    this.options.unit = val
    this.snake.size = val
  }

  setSize (val: number) {
    this.gridBoard.coordinateSystem.size = val
    this.options.size = val
    this.setUnit(350 / val)
    this.stop()
  }

  setSeeds (val: number) {
    this.options.seeds = val
  }

  get coordinateSystem () {
    return this.gridBoard.coordinateSystem
  }

  initSnake () {
    ;(window as any).snake = this.snake
    this.viewer.graphics.add(this.snake)
    this.snake.speed = this.options.speed
  }

  clearRandomSeed () {
    this.randomSeed.remove(...this.randomSeed.values)
  }

  generateRandomSeed () {
    const positions = this.coordinateSystem.generateLocalPositions()
    const disabledPositions = [
      ...this.snake.body.map(item => item.position.clone()),
      this.snake.position.clone()
    ]
    const validPositions = []
    for (const pos of positions) {
      const isDisabled = !!disabledPositions.find(disablePos => disablePos.isEqualTo(pos))
      if (isDisabled) continue
      validPositions.push(pos)
    }
    const seedsAmount = validPositions.length > this.options.seeds ? this.options.seeds : validPositions.length
    const targetPositions = shuffle(validPositions).slice(0, seedsAmount)

    const seedGraphics = targetPositions.map(pos => new RectangleGraphic({
      position: pos,
      width: this.options.unit,
      height: this.options.unit,
      style: { fillStyle: 'green' }
    }))

    seedGraphics.forEach(graphic => this.randomSeed.add(graphic))

    return seedGraphics
  }

  registerSnakeMove () {
    const handleSnakeGrow = (snakePosition: Vec2) => {
      for (const seed of this.randomSeed.values) {
        if (seed.position.isEqualTo(snakePosition)) {
          this.randomSeed.remove(seed)
          this.snake.grow()
          break
        }
      }
      if (this.randomSeed.values.length === 0) {
        this.generateRandomSeed()
      }
      if (this.snake.body.length === this.options.size ** 2) {
        this.stop()
        this.winEvent.dispatch()
      }
    }
    const handleBoundaryCollision = (position: Vec2) => {
      const { lowerRight, upperLeft } = this.coordinateSystem.localBoundary
      const snakePosition = this.coordinateSystem.toLocal(position)
      const { y: top, x: left } = upperLeft
      const { y: bottom, x: right } = lowerRight
      const upperCollision = snakePosition.y < top
      const lowerCollision = snakePosition.y > bottom
      const leftCollision = snakePosition.x < left
      const rightCollision = snakePosition.x > right

      if (upperCollision) {
        this.snake.position = this.coordinateSystem.toGlobal(new Vec2(snakePosition.x, bottom))
      } else if (lowerCollision) {
        this.snake.position = this.coordinateSystem.toGlobal(new Vec2(snakePosition.x, top))
      } else if (leftCollision) {
        this.snake.position = this.coordinateSystem.toGlobal(new Vec2(right, snakePosition.y))
      } else if (rightCollision) {
        this.snake.position = this.coordinateSystem.toGlobal(new Vec2(left, snakePosition.y))
      }
    }
    const handleSnakeSelfCollision = (position: Vec2) => {
      const snakePosition = this.coordinateSystem.toLocal(position)
      for (const snakeBodyRec of this.snake.body) {
        const bodyItemPosition = this.coordinateSystem.toLocal(snakeBodyRec.position)
        if (bodyItemPosition.isEqualTo(snakePosition)) {
          this.stop()
          this.snake.stop()
          this.failedEvent.dispatch()
        }
      }
    }
    const removeEvents = [
      this.snake.moveEvent.addListener(handleSnakeSelfCollision),
      this.snake.moveEvent.addListener(handleBoundaryCollision),
      this.snake.moveEvent.addListener(handleSnakeGrow)
    ]
    this.removeEvents.concat(removeEvents)
  }

  registerGridRender () {
    this.removeEvents.concat([
      this.renderer.addTask(() => {
        const ctx = this.viewer.ctx
        this.gridBoard.renderGrid(ctx)
      })
    ])
  }

  start () {
    this._isStart && this.stop()
    this._isStart = true
    this.generateRandomSeed()
    this.initSnake()
    this.snake.start()
    this.snake.attachControl()
    this.registerSnakeMove()
    this.registerGridRender()
  }

  stop () {
    this._isStart = true
    this.snake.removeControl()
    this.snake.stop()
    this.clearRandomSeed()
    this.removeEvents.forEach(remove => remove())
    this.viewer.graphics.remove(this.snake)
    this.snake = new NeverSnake(this.options.unit)
  }
}

export default Game
