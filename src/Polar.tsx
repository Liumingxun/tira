import type { FunctionComponent } from 'react'
import type { TiraPoint } from './lib/polar'

interface PolarProps {
  points: TiraPoint[]
  debug?: boolean
}

export const Polar: FunctionComponent<PolarProps> = ({ points, debug = false }) => {
  return (
    <div className="relative h-full aspect-square mx-auto">
      {debug && (
        <>
          <div className="absolute inset-0 m-auto w-1 h-full bg-gray-400" />
          <div className="absolute inset-0 m-auto w-full h-1 bg-gray-400" />
        </>
      )}
      {
        points.map((point, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 w-2.5 h-2.5"
            style={{
              transformOrigin: `calc(50% - ${point.r}px) calc(50%)`,
              transform: `translate(-50%, -50%) translateX(${point.r}px) rotate(${point.a}rad)`,
            }}
          >
            <div
              className={`w-full h-full ${point.mag >= 0 ? 'bg-blue-500' : 'bg-black'}`}
              style={{
                transform: `scale(${point.mag})`,
              }}
            />
          </div>
        ))
      }
    </div>
  )
}
