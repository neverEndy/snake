import Event from '../utils/Event'

class BoardControl {
  container: HTMLElement
  moveUpEvent = new Event()
  moveRightEvent = new Event()
  moveDownEvent = new Event()
  moveLeftEvent = new Event()
  constructor () {
    this.container = document.body
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  start () {
    this.container.addEventListener('keydown', this.handleKeyDown)
  }

  stop () {
    this.container.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown (e: KeyboardEvent) {
    this.handleMoveUp(e)
    this.handleMoveRight(e)
    this.handleMoveDown(e)
    this.handleMoveLeft(e)
  }

  handleMoveUp (e: KeyboardEvent) {
    if (e.key !== 'w') return
    this.moveUpEvent.dispatch()
  }

  handleMoveRight (e: KeyboardEvent) {
    if (e.key !== 'd') return
    this.moveRightEvent.dispatch()
  }

  handleMoveDown (e: KeyboardEvent) {
    if (e.key !== 's') return
    this.moveDownEvent.dispatch()
  }

  handleMoveLeft (e: KeyboardEvent) {
    if (e.key !== 'a') return
    this.moveLeftEvent.dispatch()
  }
}

export default BoardControl
