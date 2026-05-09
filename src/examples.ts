export interface Case {
  notes: string[]
  tiraFn: string
}

const EXAMPLES: readonly Case[] = [
  {
    notes: [
      'tira - creative code golfing',
      'click the squares for more info',
    ],
    tiraFn: 'sin(t)*cos(t*r/6*2*PI+a)',
  },
  {
    notes: [
      'for every square return 0 or 1',
      'to change the visibility',
    ],
    tiraFn: 'Math.random() < 0.1',
  },
  {
    notes: [
      'use a float between 0 and 1',
      'to define the size',
    ],
    tiraFn: 'Math.random()',
  },
  {
    notes: [
      'parameter `t` is',
      'the time in seconds',
    ],
    tiraFn: 'Math.sin(t) * 0.5 + 0.5',
  },
  {
    notes: [
      'parameter `i` is the index of the square',
      'from 0 to 264',
    ],
    tiraFn: 'i==0||i==264||-.2',
  },
  {
    notes: [
      'parameter `r` is the radial distance',
      'of the square, from 0 to 11',
    ],
    tiraFn: 'r % 3',
  },
  {
    notes: [
      'parameter `a` is the angle of the square',
      'from 0 to 2*PI',
    ],
    tiraFn: 'a/PI/2',
  },
  {
    notes: [
      'positive numbers are white',
      'negatives are blue',
    ],
    tiraFn: 'i%2 ? -1 : 1',
  },
  {
    notes: [
      'use the time',
      'to animate values',
    ],
    tiraFn: 'Math.sin(t*r/6*2*PI)',
  },
  {
    notes: [
      'combine parameters',
      'to create patterns',
    ],
    tiraFn: '(a+t)*4/Math.PI&1&&r>2',
  },
  {
    notes: [
      'skip `Math.` to use methods',
      'and props like `sin` or `PI`',
    ],
    tiraFn: 'sin(t)*cos(t*r/6*2*PI+a)',
  },
  {
    notes: [
      'more examples',
    ],
    tiraFn: 'cos(r-t)*cos(a*4+t)',
  },
  {
    notes: [
      'a triangular shape',
    ],
    tiraFn: 'r*cos(a-PI/2)<=5&&r*cos(a-PI/2-2*PI/3)<=5&&r*cos(a-PI/2+2*PI/3)<=5',
  },
] as const

export default EXAMPLES
