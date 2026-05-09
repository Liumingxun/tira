import type { FunctionComponent } from 'react'
import type { PolarPoint } from './lib/polar'
import { memo, useCallback, useEffect, useImperativeHandle, useReducer, useRef, useState } from 'react'
import EXAMPLES from './examples'
import { createPoints } from './lib/polar'

interface PolarProps {
  points: PolarPoint[]
  tiraFn: TiraFn
  onClick?: () => void
  debug?: boolean
}

const Polar: FunctionComponent<PolarProps> = memo(({ points, tiraFn, debug = false, onClick }) => {
  const pointElementsRef = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    pointElementsRef.current.length = points.length
  }, [points.length])

  useEffect(() => {
    let rafId = 0
    const loop = (time: number) => {
      const t = time / 1000
      points.forEach((point, index) => {
        const element = pointElementsRef.current[index]
        if (element === null || element === undefined)
          return
        const mag = Math.min(Math.max(tiraFn(t, index, point.r / 10, point.a), -1), 1)
        element.style.transform = `scale(${mag})`
        element.style.backgroundColor = mag >= 0 ? 'var(--color-blue-500)' : '#000000'
      })
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [points, tiraFn])

  return (
    <div onClick={onClick} className="relative h-full aspect-square rounded-full mx-auto grid grid-cols-1 grid-rows-1 place-items-center">
      {debug && (
        <>
          <div className="absolute inset-0 m-auto w-1 h-full bg-gray-400" />
          <div className="absolute inset-0 m-auto w-full h-1 bg-gray-400" />
        </>
      )}
      {
        points.map((point, index) => (
          <div
            key={`${point.a}-${point.r}`}
            className="w-2.5 h-2.5 border border-transparent"
            style={{
              gridArea: '1 / 1',
              transformOrigin: `calc(50% - ${point.r}px) center`,
              transform: `translateX(${point.r}px) rotate(${point.a}rad)`,
            }}
          >
            <div
              ref={(element) => {
                pointElementsRef.current[index] = element
              }}
              className="w-full h-full will-change-transform"
            />
          </div>
        ))
      }
    </div>
  )
})

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

interface TiraFnInputState {
  raw: string
  fn: TiraFn | null
}

function createTiraFnInputState(raw: string): TiraFnInputState {
  return {
    raw,
    fn: parseTiraFn(raw),
  }
}

function tiraFnInputReducer(_state: TiraFnInputState, raw: string): TiraFnInputState {
  return createTiraFnInputState(raw)
}

interface TiraFnInputProps { ref?: React.Ref<TiraFnInputHandle>, onTiraFnChange: (fn: () => TiraFn) => void }
interface TiraFnInputHandle {
  next: () => void
}
const TiraFnInput: FunctionComponent<TiraFnInputProps> = memo(({ onTiraFnChange, ref }) => {
  const [state, setState] = useReducer(tiraFnInputReducer, EXAMPLES[0].tiraFn, createTiraFnInputState)
  const [exampleIndex, setExampleIndex] = useState(0)

  useImperativeHandle(ref, () => ({
    next: () => {
      setExampleIndex((index) => {
        const nextIndex = (index + 1) % EXAMPLES.length
        setState(EXAMPLES[nextIndex]!.tiraFn)
        return nextIndex
      })
    },
  }))

  useEffect(() => {
    if (state.fn === null)
      return
    const fn = state.fn
    onTiraFnChange(() => fn)
  }, [onTiraFnChange, state.fn])

  const handleTiraFnChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(ev.target.value)
  }

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      if (state.fn)
        history.pushState(null, '', `?${new URLSearchParams({ code: state.raw }).toString()}`)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code)
      setState(code)
  }, [])

  const [focusing, setFocusing] = useState(() => false)

  return (
    <div className="text-left flex flex-col items-start w-96">
      {
        focusing
          ? (
              <>
                <p className="text-blue-500">
                  &#47;&#47;&ensp;
                  hit "enter" to save in URL
                </p>
                <p className="text-blue-500">
                  &#47;&#47;&ensp;
                  or click to
                  {' '}
                  <a className="underline" href={`https://github.com/liumingxun/tira/issues/new?title=The+Pattern+Name&body=${encodeURIComponent(state.raw)}`} onMouseDown={e => e.preventDefault()}>submit</a>
                  {' '}
                  your entry!
                </p>
              </>
            )
          : (
              EXAMPLES[exampleIndex]?.notes.map(note => (
                <p key={note} className="text-blue-500">
                  &#47;&#47;&ensp;
                  {note}
                </p>
              ),
              ))
      }
      <label htmlFor="tiraFn">(t,i,r,a) =&gt;</label>
      <textarea id="tiraFn" className="overflow-y-visible w-full" rows={3} value={state.raw} onBlur={() => setFocusing(false)} onFocus={() => setFocusing(true)} onKeyDown={handleKeyDown} onChange={handleTiraFnChange} />
    </div>
  )
})

const POINTS = createPoints()

export const Tira: FunctionComponent = () => {
  const [tiraFn, setTiraFn] = useState(() => parseTiraFn(EXAMPLES[0]!.tiraFn)!)
  const tiraFnInputRef = useRef<TiraFnInputHandle>(null)

  const handlePolarClick = useCallback(() => {
    tiraFnInputRef.current?.next()
  }, [])

  return (
    <>
      <Polar points={POINTS} tiraFn={tiraFn} onClick={handlePolarClick} />
      <TiraFnInput ref={tiraFnInputRef} onTiraFnChange={setTiraFn} />
    </>
  )
}
