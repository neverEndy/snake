import Viewer from '../Viewer'
import Renderer from '../Renderer'
import NeverSnake from '../NeverSnake'
import BoardControl from './BoardControl'
import CoordinateSystem from './CoordinateSystem'
import { shuffle } from 'lodash'
import RectangleGraphic from '../Graphic/RectangleGraphic'
import Collection from '../Collection'
import Vec2 from '../Vector/Vec2'
import Event from '../utils/Event'

export type GameOptions = {
  unit: number
  size: number
  seeds: number
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
  randomSeeds: Collection<RectangleGraphic>
  private removeEvents: Array<ReturnType<Event['addListener']>> = []
  constructor (options: GameConstructor) {
    this.options = options
    this.viewer = options.viewer
    this.renderer = options.renderer
    this.boardControl = new BoardControl()
    this.coordinateSystem = new CoordinateSystem({ ...options, size: this.viewer.container.getBoundingClientRect().width })
    this.snake = new NeverSnake(options.unit)
    this.randomSeeds = this.createRandomSeed()
    this.init()
  }

  init () {
    this.initSnake()
    this.randomSeeds = this.createRandomSeed()
  }

  initSnake () {
    this.snake = new NeverSnake(this.options.unit)
    ;(window as any).snake = this.snake
    this.viewer.graphics.add(this.snake)
  }

  createRandomSeed () {
    const collection = new Collection<RectangleGraphic>()
    const positions = this.coordinateSystem.generateLocalPositions()
    const targetPositions = shuffle(positions).slice(0, this.options.seeds)
    targetPositions.forEach(pos => {
      const graphic = new RectangleGraphic({
        startPosition: pos,
        width: this.options.unit,
        height: this.options.unit
      })
      collection.add(graphic)
    })
    return collection
  }

  registerSnakeMove () {
    const handleSnakeGrow = (position: Vec2) => {
      for (const seed of this.randomSeeds.values) {
        if (seed.startPosition.isEqualTo(position)) {
          this.randomSeeds.remove(seed)
          this.snake.grow()
          console.log(this.snake.body.length)
          break
        }
      }
    }
    const handleBoundaryCollision = (position: Vec2) => {
      const { lowerRight, upperLeft } = this.coordinateSystem.localBoundary
      const snakePosition = this.coordinateSystem.toLocal(position)
      const upperCollision = snakePosition.y < upperLeft.y
      const lowerCollision = snakePosition.y > lowerRight.y
      const leftCollision = snakePosition.x < upperLeft.x
      const rightCollision = snakePosition.x > lowerRight.x
      if (upperCollision || lowerCollision || leftCollision || rightCollision) {
        this.stop()
        this.snake.stop()
      }
    }
    const handleSnakeSelfCollision = (position: Vec2) => {
      const snakePosition = this.coordinateSystem.toLocal(position)
      for (const snakeBodyRec of this.snake.body) {
        const bodyItemPosition = this.coordinateSystem.toLocal(snakeBodyRec.startPosition)
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
      this.boardControl.moveUpEvent.addListener(() => {
        this.snake.move('up')
      }),
      this.boardControl.moveRightEvent.addListener(() => {
        this.snake.move('right')
      }),
      this.boardControl.moveDownEvent.addListener(() => {
        this.snake.move('down')
      }),
      this.boardControl.moveLeftEvent.addListener(() => {
        this.snake.move('left')
      })
    ]
    this.removeEvents.concat(removeEvents)
  }

  start () {
    this.boardControl.start()
    this.registerControl()
    this.registerSnakeMove()
    this.renderer.addTask(() => {
      const ctx = this.viewer.ctx
      this.coordinateSystem.renderGrid(ctx)
      this.randomSeeds.values.forEach(graphic => graphic.drawOnCanvas(ctx))
    })
  }

  stop () {
    this.boardControl.stop()
    this.removeEvents.forEach(remove => remove())
  }
}

export default Game
