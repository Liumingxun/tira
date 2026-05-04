const BASE_R = 60
const BASE_COUNT = 24

 interface PolarPoint {
  r: number
  a: number
}

export interface TiraPoint extends PolarPoint {
  mag: number
}

export function ringPoints(r: number): PolarPoint[] {
  const count = Math.max(1, Math.round(r / BASE_R * BASE_COUNT))
  return Array.from({ length: count }, (_, i) => ({
    r,
    a: (i / count) * 2 * Math.PI,
  }))
}

interface CartesianPoint {
  x: number
  y: number
}

export function point2Cartesian(point: PolarPoint): CartesianPoint {
  return {
    x: point.r * Math.cos(point.a),
    y: point.r * Math.sin(point.a),
  }
}
