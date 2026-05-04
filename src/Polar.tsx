import type { FunctionComponent } from 'react'

interface PolarProps {}

interface Point {
  r: number
  a: number
}

const RING_COUNT = 12
const RING_STEP = 10
const BASE_R = 60
const BASE_COUNT = 24

function ringPoints(r: number): Point[] {
  const count = Math.max(1, Math.round(r / BASE_R * BASE_COUNT))
  return Array.from({ length: count }, (_, i) => ({
    r,
    a: (i / count) * 2 * Math.PI,
  }))
}

export const Polar: FunctionComponent<PolarProps> = () => {
  const points = Array.from({ length: RING_COUNT }, (_, i) => i)
    .flatMap(i => ringPoints(i * RING_STEP))

  return (
    <div className="relative h-60 aspect-square bg-amber-200 mx-auto
    before:absolute before:inset-0 before:m-auto before:w-1 before:h-full before:bg-gray-400
    after:absolute after:inset-0 after:m-auto after:w-full after:h-1 after:bg-gray-400"
    >
      {
        points.map((point, index) => (
          <div
            key={index}
            className="absolute transform top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-blue-500"
            style={{
              transformOrigin: `calc(50% - ${point.r}px) calc(50%)`,
              transform: `translate(-50%, -50%) translateX(${point.r}px) rotate(${point.a}rad)`,
            }}
          />
        ))
      }
    </div>
  )
}
