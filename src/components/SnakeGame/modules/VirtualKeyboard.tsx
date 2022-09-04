import React from 'react'
import './VirtualKeyboard.scss'

export enum VirtualKeyType {
  UP,
  DOWN,
  RIGHT,
  LEFT
}

export interface IVirtualKeyboardProps {
  onKeyDown: (k: VirtualKeyType) => void
}

const VirtualKeyboard = ({
  onKeyDown
}: IVirtualKeyboardProps) => {
  return (
    <div className="VirtualKeyboard">
      <span className="empty"></span>
      <span onClick={() => onKeyDown(VirtualKeyType.UP)}>▲</span>
      <span className="empty"></span>
      <span onClick={() => onKeyDown(VirtualKeyType.LEFT)}>◀</span>
      <span className="empty"></span>
      <span onClick={() => onKeyDown(VirtualKeyType.RIGHT)}>▶</span>
      <span className="empty"></span>
      <span onClick={() => onKeyDown(VirtualKeyType.DOWN)}>▼</span>
      <span className="empty"></span>
    </div>
  )
}

export default VirtualKeyboard
