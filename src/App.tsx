import { useEffect, useMemo, useState } from 'react'
import './index.css'

import { useNumberOfColumns } from './useNumberOfColumns'
import Box, { BoxProps } from './Box'
import { useDistributedBoxes } from './useDistributedBoxes'

// --- utils ---

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

export const getDiagonal = ({ width = 0, height = 0 }) => {
  return Math.sqrt(width * width + height * height)
}

export const getWindowDiagonal = () => {
  return getDiagonal({ width: window.innerWidth, height: window.innerHeight })
}

export const getScaledDiagonal = (width: number, height: number) => {
  const windowDiagonal = getWindowDiagonal()
  const boxDiagonal = getDiagonal({ width, height })
  return boxDiagonal / windowDiagonal
}

const BOXES = generateBoxes(40)
const CACHED = BOXES.map(() => 0)

const setCachedBox = (box: BoxProps, size: { width: number; height: number }) => {
  if (box.id !== 0) return
  const windowWidth = window.innerWidth
  const boxHeight = size.height
  const ratio = Math.ceil((boxHeight / windowWidth) * 1000)
  CACHED[box.id] = ratio

  console.table({
    width: size.width,
    height: size.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    ratio,
    boxHeight: Math.floor((ratio * window.innerWidth) / 1000),
  })
}

const getCachedHeight = (id: number) => {
  const ratio = CACHED[id]
  if (!ratio) return undefined
  return Math.floor((ratio * window.innerWidth) / 1000)
}

export default function App() {
  const [boxes, setBoxes] = useState([...BOXES])
  const numberOfColumns = useNumberOfColumns({ maxWidth: MAX_COLUMN_WIDTH })
  const sortedBoxes = useDistributedBoxes({ numberOfColumns, boxes })
  console.log('[app] numberOfColumns:', numberOfColumns)

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
              onLayout={size => setCachedBox(box, size)}
              minWidth={MIN_BOX_WIDTH}
              maxWidth={MAX_COLUMN_WIDTH}
              height={getCachedHeight(box.id) || box.height}
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
