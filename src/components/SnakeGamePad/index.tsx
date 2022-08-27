import React, { useState } from 'react'
import Button from '../Button'
import Setting, { ISettingProps } from './Setting'

export interface ISnakeGamePadProps {
  onStart: () => void
  onSetting: ISettingProps['onConfirm']
}

const SnakeGamePad = ({
  onStart,
  onSetting
}: ISnakeGamePadProps) => {
  const [openSetting, setOpenSetting] = useState(false)

  const handleConfirm: ISettingProps['onConfirm'] = (param) => {
    setOpenSetting(false)
    onSetting(param)
  }
  return (
    <div>
      <Button onClick={onStart}>Start</Button>
      <Button onClick={() => setOpenSetting(true)}>Setting</Button>
      <Setting
        open={openSetting}
        onClose={() => setOpenSetting(!openSetting)}
        onConfirm={handleConfirm}/>
    </div>
  )
}

export default SnakeGamePad
