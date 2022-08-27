import React, { useEffect, useState } from 'react'
import Popup from '../../Popup'
import Button from '../../Button'
import { useSnakeGame } from '..'

export interface IGameRecordPopupProps {
  open: boolean
  onClose: () => void
}

const GameRecordPopup = ({
  open,
  onClose
}: IGameRecordPopupProps) => {
  const { addRecord, score, asyncCore } = useSnakeGame()
  const [player, setPlayer] = useState<string>('')
  const isFormComplete = !!player

  const handleClose = () => {
    onClose()
  }
  const handleSubmit = async () => {
    const core = await asyncCore
    const { size, speed } = core.game.options
    if (!isFormComplete) return
    addRecord({ name: player, score, boardSize: size, speed })
    onClose()
  }

  useEffect(() => {
    setPlayer('')
  }, [open])
  return (
    <Popup
      title='add record'
      withBackDrop
      open={open}
      onClose={handleClose}>
        <div>
          <div>
            <label className='mr-3'>name</label>
            <input className='border border-gray-400 rounded' type="text" value={player} onChange={(e) => setPlayer(e.target.value)}/>
          </div>
          <Button onClick={handleClose}>cancel</Button>
          <Button disabled={!isFormComplete} onClick={handleSubmit}>ok {isFormComplete}</Button>
        </div>
    </Popup>
  )
}

export default GameRecordPopup
