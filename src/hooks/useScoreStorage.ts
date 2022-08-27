import { useState } from 'react'

export type ScoreStorage = {
  name: string,
  score: number,
  boardSize: number | typeof NaN,
  speed: number | typeof NaN
}

export const STORAGE_KEY = 'snake_storage'

const getLocalStorage = () => {
  const storage = window.localStorage.getItem(STORAGE_KEY) || '[]'
  return JSON.parse(storage)
}

const useScoreStorage = () => {
  const [storage, setStorage] = useState<Array<ScoreStorage>>(getLocalStorage())
  const addRecord = (payload: ScoreStorage) => {
    const prevItem = storage.find(item => item.name === payload.name)
    let newStorage: ScoreStorage[]
    if (!prevItem) {
      newStorage = [...storage, { ...payload }]
    } else {
      const otherItems = storage.filter(item => item.name !== payload.name)
      newStorage = [...otherItems, { ...payload }]
    }
    setStorage(newStorage)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage))
  }

  return { records: storage, addRecord }
}

export default useScoreStorage
