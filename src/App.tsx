import type { TiraPoint } from './lib/polar'
import { useEffect, useState } from 'react'
import { ringPoints } from './lib/polar'
import { Polar } from './Polar'
import './index.css'

const RING_COUNT = 12
const RING_STEP = 10

export function App() {
  const [points, setPoints] = useState<TiraPoint[]>(() =>
    Array.from({ length: RING_COUNT }, (_, i) => i)
      .flatMap(i => ringPoints(i * RING_STEP).map(p => ({ ...p, mag: 1 }))),
  )

  // eslint-disable-next-line no-new-func
  const tiraFn = new Function('t,i,r,a', `return sin(t) * cos(t * r / 60 * 2 * PI + a)`)

  useEffect(() => {
    let rafId: number
    const loop = (t: number) => {
      t /= 1000
      setPoints(prev =>
        prev.map((p, i) => ({
          ...p,
          mag: Math.min(Math.max(tiraFn(t, i, p.r, p.a), -1), 1),
        })),
      )
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Polar points={points} />
    </div>
  )
}

export default App
