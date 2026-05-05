import type { FunctionComponent } from 'react'
import type { TiraPoint } from './lib/polar'
import { useEffect, useState } from 'react'
import { ringPoints } from './lib/polar'

interface PolarProps {
  points: TiraPoint[]
  debug?: boolean
}

const Polar: FunctionComponent<PolarProps> = ({ points, debug = false }) => {
  return (
    <div className="relative h-full aspect-square rounded-full mx-auto grid grid-cols-1 grid-rows-1 place-items-center">
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
            className="w-2.5 h-2.5 border border-transparent"
            style={{
              gridArea: '1 / 1',
              transformOrigin: `calc(50% - ${point.r}px) center`,
              transform: `translateX(${point.r}px) rotate(${point.a}rad)`,
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

type TiraFn = ((t: number, i: number, r: number, a: number) => number)
function parseTiraFn(code: string): TiraFn | null {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('t,i,r,a', `return ${code}`) as TiraFn
    fn(0, 0, 0, 0)
    return fn
  }
  catch {
    return null
  }
}
const DEFAULT_TIRA_FN = `sin(t) * cos(t * r / 60 * 2 * PI + a)`

const TiraFnInput: FunctionComponent<{ onTiraFnChange: (fn: () => TiraFn) => void }> = ({ onTiraFnChange }) => {
  const handleTiraFnChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const fn = parseTiraFn(ev.target.value)
    if (fn) {
      console.log(fn.toString())
      onTiraFnChange(() => fn)
    }
  }

  return (
    <div className="text-left flex flex-col items-start">
      <label htmlFor="tiraFn">(t,i,r,a) =&gt;</label>
      <textarea id="tiraFn" cols={35} defaultValue={DEFAULT_TIRA_FN} onChange={handleTiraFnChange} />
    </div>
  )
}

const RING_COUNT = 12
const RING_STEP = 10

export const Tira: FunctionComponent<{
  ringCount?: number
  ringStep?: number
}> = ({ ringCount = RING_COUNT, ringStep = RING_STEP }) => {
  const [tiraFn, setTiraFn] = useState(() => parseTiraFn(DEFAULT_TIRA_FN)!)

  const [points, setPoints] = useState<TiraPoint[]>(() =>
    Array.from({ length: ringCount }, (_, i) => i)
      .flatMap(i => ringPoints(i * ringStep).map(p => ({ ...p, mag: 1 }))),
  )

  useEffect(() => {
    let rafId: number
    const loop = (t: number) => {
      t /= 1000
      setPoints(prev =>
        prev.map((p, i) => ({
          ...p,
          mag: Math.tanh(tiraFn(t, i, p.r, p.a)),
        })),
      )
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [tiraFn])

  return (
    <>
      <Polar points={points} />
      <TiraFnInput onTiraFnChange={setTiraFn}></TiraFnInput>
    </>
  )
}
