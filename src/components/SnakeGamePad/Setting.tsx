import React, { useState } from 'react'
import Button from '../Button'
import Popup from '../Popup'
import './Setting.scss'

type SettingPayload = {
  speed: number
  size: number
}

export interface ISettingProps {
  open: boolean
  onClose: () => void
  onConfirm: (param: SettingPayload) => void
}

const Setting = ({
  open,
  onClose,
  onConfirm
}: ISettingProps) => {
  const [setting, setSetting] = useState<SettingPayload>({
    speed: 5,
    size: 10
  })

  const handleClose = () => {
    onClose()
  }

  const handleConfirm = () => {
    onConfirm({ ...setting })
  }
  return (
    <Popup
      withBackDrop
      open={open}
      title='Game Setting'
      onClose={handleClose}
      >
        <div className='SettingContainer'>
          <div className="inputRowGroup">
            <label>Speed</label>
            <input type="number" min='1' max='1000' value={setting.speed} onChange={e => setSetting({ ...setting, speed: Number(e.target.value) })}/>
          </div>
          <div className="inputRowGroup">
            <label>size</label>
            <input type="number" min='5' max='10000' value={setting.size} onChange={e => setSetting({ ...setting, size: Number(e.target.value) })}/>
          </div>

          <div className="actions">
            <Button onClick={handleClose}>cancel</Button>
            <Button onClick={handleConfirm}>ok</Button>
          </div>
        </div>
    </Popup>
  )
}

export default Setting
