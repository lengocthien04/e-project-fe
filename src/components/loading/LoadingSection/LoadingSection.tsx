import { CSSProperties } from 'react'
import LoadingRing from '../LoadingRing'

interface Props {
  style?: CSSProperties
  height?: string
}

export default function LoadingSection({
  style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40rem',
    width: '100%'
  },
  height = '40rem'
}: Props) {
  return (
    <div
      style={{
        ...style,
        height: height
      }}
    >
      <LoadingRing />
    </div>
  )
}
