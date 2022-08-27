import React, { useEffect, useRef, useState, createContext, useContext } from 'react'
import useSnakeCore from '../../hooks/useSnakeCore'
import SnakeGamePad from '../SnakeGamePad'
import { ISettingProps } from '../SnakeGamePad/Setting'
import useScoreStorage, { ScoreStorage } from '../../hooks/useScoreStorage'
import GameRecordPopup from './modules/GameRecordPopup'
import RecordList from './modules/RecordList'
import SnakeCore from 'src/core'

export type SnakeGameContext = {
  score: number
  records: ScoreStorage[]
  addRecord: (payload: ScoreStorage) => void
  asyncCore: Promise<SnakeCore>
}

const snakeGameContext = createContext({} as SnakeGameContext)

const SnakeGame = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [score, setScore] = useState(0)
  const { records, addRecord } = useScoreStorage()
  const [recordOpen, setRecordOpen] = useState(false)
  const { asyncCore } = useSnakeCore(ref, {
    gameOptions: {
      unit: 500 / 10,
      size: 10,
      seeds: 5,
      speed: 150
    }
  })

  const handleStartGame = async () => {
    const game = (await asyncCore).game
    setScore(0)
    game.start()
    game.snake.growEvent.addListener(handleAddScore)
    // (await asyncCore).
  }

  const handleGameSetting: ISettingProps['onConfirm'] = async ({ speed, size }) => {
    const game = (await asyncCore).game
    game.setSpeed(500 / speed)
    game.setSize(size)
  }

  const handleAddScore = () => {
    setScore(prev => prev + 1)
  }

  const handleGameFailed = () => {
    alert('yout failed')
    setRecordOpen(true)
  }

  const handleGameWin = () => {
    alert('you win')
    setRecordOpen(true)
  }

  useEffect(() => {
    (async () => {
      const core = await asyncCore
      ;(window as any).core = core
      core.game.failedEvent.addListener(handleGameFailed)
      core.game.winEvent.addListener(handleGameWin)
    })()
  }, [])

  const value: SnakeGameContext = {
    score,
    records,
    addRecord,
    asyncCore
  }
  return (
    <snakeGameContext.Provider value={value}>
      <div className="SnakeGame">
        <div className="SnakeContainer">
          <SnakeGamePad onStart={handleStartGame} onSetting={handleGameSetting}/>
          <p>score: {score}</p>
          <div ref={ref} className='SnakeContainer-canvas'></div>
        </div>
        <RecordList />
       <GameRecordPopup open={recordOpen} onClose={() => setRecordOpen(!recordOpen)} />
      </div>
    </snakeGameContext.Provider>
  )
}

export const useSnakeGame = () => useContext(snakeGameContext)

export default SnakeGame
