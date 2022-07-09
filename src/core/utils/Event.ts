
class Event<T = void> {
  private tasks: Array<(param: T) => void> = []

  addListener (task: (param: T) => void) {
    this.tasks.push(task)
    return () => this.removeListener(task)
  }

  removeListener (task: (param: T) => void) {
    this.tasks = this.tasks.filter(item => item !== task)
  }

  dispatch (param: T) {
    for (const task of this.tasks) task(param)
  }
}

export default Event
