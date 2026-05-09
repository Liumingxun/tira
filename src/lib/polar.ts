const BASE_R = 60
const BASE_COUNT = 24

export interface PolarPoint {
  r: number
  a: number
}

export function ringPoints(r: number): PolarPoint[] {
  const count = Math.max(1, Math.round(r / BASE_R * BASE_COUNT))
  return Array.from({ length: count }, (_, i) => ({
    r,
    a: (i / count) * 2 * Math.PI,
  }))
}

const RING_COUNT = 12
const RING_STEP = 10

export function createPoints(ringCount: number = RING_COUNT, ringStep: number = RING_STEP): PolarPoint[] {
  return Array.from({ length: ringCount }, (_, i) => i)
    .flatMap(i => ringPoints(i * ringStep))
}
