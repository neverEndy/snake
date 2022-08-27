import React from 'react'
import { useSnakeGame } from '..'
import './RecordList.scss'

const RecordList = () => {
  const { records } = useSnakeGame()
  const sortedRecords = records.sort((a, b) => Number(b.score / (b.boardSize ** 2)) - Number(a.score / a.boardSize ** 2))
  return (
    <div className='ScoreRecord'>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Progress</th>
            <th>Score / Size²</th>
            <th>Board Size</th>
            <th>Speed</th>
          </tr>
        </thead>
        <tbody>
          {
            sortedRecords.map((record, index) => {
              const name = String(record.name)
              const boardSize = String(record.boardSize)
              const speed = String(record.speed)
              const score = record.score
              const progress = isNaN(record.boardSize) ? 'NaN' : String(record.score / (record.boardSize ** 2))
              return (
                <tr key={index}>
                  <td>{name}</td>
                  <td>{progress}</td>
                  <td>{`${score} / ${String(record.boardSize ** 2)}`}</td>
                  <td>{boardSize}</td>
                  <td>{speed}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default RecordList
