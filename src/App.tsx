import { useEffect, useMemo, useState } from 'react'
import './index.css'

import { useNumberOfColumns } from './useNumberOfColumns'
import Box, { BoxProps } from './Box'
import { useDistributedBoxes } from './useDistributedBoxes'

// --- utils ---

export const getDiagonal = (width: number, height: number) => {
  return Math.sqrt(width * width + height * height)
}

export const getWindowDiagonal = () => {
  return getDiagonal(window.innerWidth, window.innerHeight)
}

export const getScaledDiagonal = (width: number, height: number) => {
  const windowDiagonal = getWindowDiagonal()
  const boxDiagonal = getDiagonal(width, height)
  return boxDiagonal / windowDiagonal
}

const getRandomHeight = ({ min = 80, max = 160 }: { min?: number; max?: number } = {}) => {
  return min + Math.floor(Math.random() * max)
}

const getRandomColor = () => {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`
}

const MIN_BOX_WIDTH = 120
const MAX_COLUMN_WIDTH = 256

const generateBoxes = (count: number): BoxProps[] => {
  return new Array(count).fill(0).map((_, i) => ({
    minWidth: MIN_BOX_WIDTH,
    maxWidth: MAX_COLUMN_WIDTH,
    height: getRandomHeight(),
    color: getRandomColor(),
    id: i,
  }))
}

// --- app ---

const BOXES = generateBoxes(40)
const CACHED_DIAGNOLS = BOXES.map(() => 0)

export default function App() {
  const [boxWidth] = useState(120)
  const [boxes] = useState([...BOXES])
  const [count, setCount] = useState(0)

  const getCachedHeight = (id: number) => {}

  const setDiagnolForId = (id: number, scale: number) => {
    CACHED_DIAGNOLS[id] = scale
  }

  const numberOfColumns = useNumberOfColumns({ maxWidth: MAX_COLUMN_WIDTH })

  const sortedBoxes = useDistributedBoxes({ numberOfColumns, boxes })

  return (
    <div className='w-full p-4 flex flex-col flex-1'>
      <div
        style={{
          columnWidth: '100%',
          columnCount: numberOfColumns,
          columnGap: '1rem',
          width: '100%',
        }}
      >
        {sortedBoxes.map((box, id) => {
          return (
            <Box
              onDiagnol={scale => setDiagnolForId(id, scale)}
              scaledDiagonal={CACHED_DIAGNOLS.at(id)}
              height={box.height}
              minWidth={MIN_BOX_WIDTH}
              maxWidth={MAX_COLUMN_WIDTH}
              color={box.color}
              key={`box-${box.id}`}
              id={box.id}
            />
          )
        })}
      </div>
    </div>
  )
}
