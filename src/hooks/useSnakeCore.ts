import React, { useEffect, useRef } from 'react'
import SnakeCore, { SnakeCoreContructor } from '../core'

class TaskStack<T> {
  stack: Array<(obg: T) => void>
  obj?: T
  constructor () {
    this.stack = []
  }

  addStack (callback: (obj: T) => void) {
    if (this.obj) return callback(this.obj)
    this.stack.push(callback)
  }

  setObject (obj: T) {
    if (this.obj) return
    this.obj = obj
    this.stack.forEach(task => task(obj))
    this.stack = []
  }
}

const useSnakeCore = (elemRef: React.RefObject<HTMLDivElement>, param: Omit<SnakeCoreContructor, 'elem'>) => {
  const snakeCore = useRef<SnakeCore>()
  const snakeCoreStack = useRef(new TaskStack<SnakeCore>())

  const asyncCore = new Promise<SnakeCore>(resolve => {
    snakeCoreStack.current.addStack(map => resolve(map))
  })

  useEffect(() => {
    if (!elemRef.current) return
    if (!snakeCoreStack.current.obj || !snakeCore.current) {
      const core = new SnakeCore({ ...param, elem: elemRef.current })
      snakeCore.current = core
      snakeCoreStack.current.setObject(core)
    }
  }, [elemRef.current])

  return {
    core: snakeCore.current,
    asyncCore
  }
}

export default useSnakeCore
