import { useMemo } from 'react'
import { BoxProps } from './Box'

type Params = {
  numberOfColumns: number
  boxes: BoxProps[]
}

type Column = {
  boxes: BoxProps[]
  height: number
}

const generateColumns = ({ numberOfColumns = 0 }): Column[] => {
  return Array(numberOfColumns)
    .fill(null)
    .map(() => ({ boxes: [], height: 0 }))
}

export function useDistributedBoxes({ numberOfColumns, boxes }: Params) {
  return useMemo(() => {
    const columns = generateColumns({ numberOfColumns })

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]
      const shortestColumn = columns.reduce(
        (shortest, current, index) => (current.height < columns[shortest].height ? index : shortest),
        0,
      )
      columns[shortestColumn].boxes.push(box)
      columns[shortestColumn].height += box.height
    }

    return columns.flatMap(column => column.boxes)
  }, [boxes, numberOfColumns])
}
