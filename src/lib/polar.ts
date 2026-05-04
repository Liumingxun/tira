const BASE_R = 60
const BASE_COUNT = 24


export interface Point {
  r: number
  a: number
}

export function ringPoints(r: number): Point[] {
  const count = Math.max(1, Math.round(r / BASE_R * BASE_COUNT))
  return Array.from({ length: count }, (_, i) => ({
    r,
    a: (i / count) * 2 * Math.PI,
  }))
}
