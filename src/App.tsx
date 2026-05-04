import { ringPoints } from './lib/polar'
import { Polar } from './Polar'
import './index.css'

export function App() {
  const RING_COUNT = 12
  const RING_STEP = 10
  const points = Array.from({ length: RING_COUNT }, (_, i) => i)
    .flatMap(i => ringPoints(i * RING_STEP))

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Polar points={points} />
    </div>
  )
}

export default App
