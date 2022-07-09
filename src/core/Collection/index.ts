import Event from '../utils/Event'

class Collection<T extends { id: string }> {
  hash: { [k: string]: T } = {}
  addEvent = new Event<T>()
  removeEvent = new Event<T>()

  get values () {
    return Object.values(this.hash)
  }

  add (val: T) {
    if (this.hash[val.id]) return
    this.hash[val.id] = val
    this.addEvent.dispatch(val)
  }

  remove (val: T) {
    if (!this.hash[val.id]) return false
    delete this.hash[val.id]
    this.removeEvent.dispatch(val)
  }

  removeById (id: string) {
    if (!this.hash[id]) return false
    delete this.hash[id]
  }
}

export default Collection
