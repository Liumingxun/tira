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
  const tiraFn = new Function('t,i,r,a', `return Math.sin(t + i) * Math.cos(r / 60 * 2 * Math.PI + a)`)

  useEffect(() => {
    const interval = setInterval(() => {
      const t = new Date().getSeconds()
      setPoints(prev =>
        prev.map((p, i) => ({
          ...p,
          mag: Math.min(Math.max(tiraFn(t, i, p.r, p.a), -1), 1),
        })),
      )
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Polar points={points} />
    </div>
  )
}

export default App
