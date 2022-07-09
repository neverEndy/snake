import React, { useEffect, useRef } from 'react'
import useSnakeCore from './hooks/useSnakeCore'
// import NeverSnake from './core/NeverSnake'
import './App.scss'

function App () {
  const ref = useRef<HTMLDivElement>(null)
  const { asyncCore } = useSnakeCore(ref, {
    gameOptions: {
      unit: 10,
      size: 500,
      seeds: 50
    }
  })

  useEffect(() => {
    (async () => {
      const core = await asyncCore
      ;(window as any).core = core
      core.game.start()
      // const snake = new NeverSnake()
      // ;(window as any).snake = snake
      // core.viewer.graphics.add(snake)
    })()
  }, [])
  return (
    <div className="App-root">
      <div ref={ref} className='SnakeContainer'></div>
    </div>
  )
}

export default App
