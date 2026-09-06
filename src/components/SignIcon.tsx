import type { SignShape } from '../types/content'

interface Props {
  shape: SignShape
  symbol: string
  size?: number
}

/**
 * Упрощённая схематичная отрисовка знака по форме/цвету группы — не официальный
 * пиксель-в-пиксель скан из Правилника, а обучающая схема (форма и цвет верны).
 */
export function SignIcon({ shape, symbol, size = 72 }: Props) {
  const fontSize = symbol.length > 2 ? size * 0.28 : size * 0.4

  const textEl = (
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fontSize={fontSize}
      fontWeight={700}
      fontFamily="system-ui, sans-serif"
    >
      {symbol}
    </text>
  )

  let shapeEl: JSX.Element
  let textColor = '#1a1a1a'

  switch (shape) {
    case 'triangle':
      shapeEl = <polygon points="50,6 96,90 4,90" fill="#ffffff" stroke="#c0392b" strokeWidth="7" />
      break
    case 'triangle-inverted':
      shapeEl = <polygon points="4,10 96,10 50,94" fill="#ffffff" stroke="#c0392b" strokeWidth="7" />
      break
    case 'circle-red':
      shapeEl = <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#c0392b" strokeWidth="8" />
      break
    case 'circle-blue':
      shapeEl = <circle cx="50" cy="50" r="44" fill="#2e6da4" stroke="#1c4d76" strokeWidth="3" />
      textColor = '#ffffff'
      break
    case 'octagon-red':
      shapeEl = (
        <polygon
          points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"
          fill="#c0392b"
          stroke="#7a221a"
          strokeWidth="3"
        />
      )
      textColor = '#ffffff'
      break
    case 'diamond-yellow':
      shapeEl = (
        <polygon points="50,4 96,50 50,96 4,50" fill="#f4c430" stroke="#8a6d1a" strokeWidth="3" />
      )
      break
    case 'square-blue':
      shapeEl = <rect x="6" y="6" width="88" height="88" rx="6" fill="#2e6da4" stroke="#1c4d76" strokeWidth="3" />
      textColor = '#ffffff'
      break
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={symbol}>
      {shapeEl}
      <g fill={textColor}>{textEl}</g>
    </svg>
  )
}
