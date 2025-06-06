import { getScaledDiagonal } from './App'

export type BoxProps = {
  id: number
  minWidth: number
  maxWidth: number
  height: number
  color: string
  scaledDiagonal?: number
  onLayout?: ({ width, height }: { width: number; height: number }) => void
}

export default function Box(props: BoxProps) {
  const onRefCallback = (box: HTMLDivElement) => {
    if (!box || !props.onLayout) return
    props.onLayout({
      width: box.clientWidth,
      height: box.clientHeight,
    })
  }

  return (
    <div
      ref={onRefCallback}
      className='masonry-box min-w-24 max-w-64 w-full text-black mb-4 flex justify-center items-center rounded-xs'
      style={{
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        height: props.height,
        backgroundColor: props.color,
      }}
    >
      <p className='text-black text-center text-2xl font-bold'>
        <span className='text-black/75 text-sm mb-2'>#{props.id}</span>
        <br />
        <span className='text-black font-bold text-md mb-2'>{props.height}px</span>
      </p>
    </div>
  )
}
