import { useEffect, useState } from 'react'

const getNumberOfColumns = ({ maxWidth = 256 }: { maxWidth?: number }) => {
  return Math.ceil(window.innerWidth / maxWidth)
}

export function useNumberOfColumns({ maxWidth = 256 }) {
  const [numberOfColumns, setNumberOfColumns] = useState(getNumberOfColumns({ maxWidth }))
  useEffect(() => {
    const handleResize = () => setNumberOfColumns(getNumberOfColumns({ maxWidth }))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [maxWidth])

  return numberOfColumns
}
