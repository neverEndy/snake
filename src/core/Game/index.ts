import Viewer from '../Viewer'
import Renderer from '../Renderer'
import NeverSnake from '../NeverSnake'
import BoardControl from './BoardControl'
import CoordinateSystem from './CoordinateSystem'
import { shuffle } from 'lodash'
import RectangleGraphic from '../Graphic/RectangleGraphic'
import Vec2 from '../Vector/Vec2'
import Event from '../utils/Event'
import GraphicCollection from '../Collection/GraphicCollection'

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
  boardControl: BoardControl
  start: () => void
  stop: () => void
}

export type GameConstructor = GameOptions & { viewer: Viewer, renderer: Renderer }

class Game implements IGame {
  options: GameOptions
  viewer: Viewer
  renderer: Renderer
  snake: NeverSnake
  boardControl: BoardControl
  coordinateSystem: CoordinateSystem
  randomSeed = new GraphicCollection()
  private removeEvents: Array<ReturnType<Event['addListener']>> = []
  constructor (options: GameConstructor) {
    this.options = options
    this.viewer = options.viewer
    this.renderer = options.renderer
    this.boardControl = new BoardControl()
    this.coordinateSystem = new CoordinateSystem({ ...options })
    this.snake = new NeverSnake(options.unit)
    this.viewer.compositeGraphics.add(this.randomSeed)

    this.init()
  }

  init () {
    this.clearRandomSeed()
    this.generateRandomSeed()
    this.initSnake()
  }

  initSnake () {
    this.snake = new NeverSnake(this.options.unit)
    ;(window as any).snake = this.snake
    this.viewer.graphics.add(this.snake)
    this.snake.speed = this.options.speed
  }

  clearRandomSeed () {
    this.randomSeed.remove(...this.randomSeed.values)
  }

  generateRandomSeed () {
    const positions = this.coordinateSystem.generateLocalPositions()
    const targetPositions = shuffle(positions).slice(0, this.options.seeds)
    for (const pos of targetPositions) {
      const graphic = new RectangleGraphic({
        position: pos,
        width: this.options.unit,
        height: this.options.unit,
        style: { fillStyle: 'green' }
      })
      this.randomSeed.add(graphic)
    }
  }

  registerSnakeMove () {
    const handleSnakeGrow = (position: Vec2) => {
      for (const seed of this.randomSeed.values) {
        if (seed.position.isEqualTo(position)) {
          this.randomSeed.remove(seed)
          this.snake.grow()
          break
        }
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
        }
      }
    }
    const removeEvents = [
      this.snake.moveEvent.addListener(handleSnakeGrow),
      this.snake.moveEvent.addListener(handleBoundaryCollision),
      this.snake.moveEvent.addListener(handleSnakeSelfCollision)
    ]
    this.removeEvents.concat(removeEvents)
  }

  registerControl () {
    const removeEvents = [
      this.boardControl.moveUpEvent.addListener(() => this.snake.move('up')),
      this.boardControl.moveRightEvent.addListener(() => this.snake.move('right')),
      this.boardControl.moveDownEvent.addListener(() => this.snake.move('down')),
      this.boardControl.moveLeftEvent.addListener(() => this.snake.move('left'))
    ]
    this.removeEvents.concat(removeEvents)
  }

  start () {
    this.snake.start()
    this.boardControl.start()
    this.registerControl()
    this.registerSnakeMove()
    this.renderer.addTask(() => {
      const ctx = this.viewer.ctx
      this.coordinateSystem.renderGrid(ctx)
    })
  }

  stop () {
    this.boardControl.stop()
    this.removeEvents.forEach(remove => remove())
  }
}

export default Game
