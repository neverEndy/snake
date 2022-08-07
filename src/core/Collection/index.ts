import { uniqueId } from 'lodash'
import Event from '../utils/Event'

class Collection<T extends { id: string }> {
  id: string
  hash: { [k: string]: T } = {}
  addEvent = new Event<T>()
  removeEvent = new Event<T>()
  constructor (id?: string) {
    this.id = id || uniqueId('collection')
  }

  get values () {
    return Object.values(this.hash)
  }

  add (val: T) {
    if (this.hash[val.id]) return
    this.hash[val.id] = val
    this.addEvent.dispatch(val)
  }

  get (id: string) {
    return this.hash[id]
  }

  remove (...vals: T[]) {
    for (const val of vals) {
      if (!this.hash[val.id]) return false
      this.removeById(val.id)
    }
  }

  removeById (id: string) {
    if (!this.hash[id]) return false
    this.removeEvent.dispatch(this.get(id))
    delete this.hash[id]
  }
}

export default Collection
