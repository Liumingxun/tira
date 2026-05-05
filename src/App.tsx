import type { TiraPoint } from './lib/polar'
import { useEffect, useState } from 'react'
import { ringPoints } from './lib/polar'
import { Polar } from './Polar'
import './index.css'

const RING_COUNT = 12
const RING_STEP = 10

// eslint-disable-next-line ts/no-unsafe-function-type
function parseTiraFn(code: string): (Function) | null {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('t,i,r,a', `return ${code}`)
    fn(0, 0, 0, 0)
    return fn
  }
  catch {
    return null
  }
}

export function App() {
  const [points, setPoints] = useState<TiraPoint[]>(() =>
    Array.from({ length: RING_COUNT }, (_, i) => i)
      .flatMap(i => ringPoints(i * RING_STEP).map(p => ({ ...p, mag: 1 }))),
  )

  const [tiraFn, setTiraFn] = useState(() => parseTiraFn(`sin(t) * cos(t * r / 60 * 2 * PI + a)`)!)

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
  }, [tiraFn])

  const handleTiraFnChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const fn = parseTiraFn(ev.target.value)
    if (fn)
      setTiraFn(() => fn)
  }

  return (
    <div className="h-screen w-screen overflow-hidden grid grid-rows-[80vh_auto] place-items-center gap-4">
      <Polar points={points} />
      <div className="text-left flex flex-col items-start">
        <label htmlFor="tiraFn">(t,i,r,a) =&gt;</label>
        <textarea id="tiraFn" cols={35} defaultValue="sin(t) * cos(t * r / 60 * 2 * PI + a)" onChange={handleTiraFnChange} />
      </div>
    </div>
  )
}

export default App
