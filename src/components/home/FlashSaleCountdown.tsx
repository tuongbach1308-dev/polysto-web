'use client'

import { useState, useEffect } from 'react'

interface Props {
  endDate: string
}

export function FlashSaleCountdown({ endDate }: Props) {
  const [time, setTime] = useState<{ d: number; h: number; m: number; s: number } | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) { setExpired(true); return }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const iv = setInterval(calc, 1000)
    return () => clearInterval(iv)
  }, [endDate])

  if (expired) {
    return (
      <div className="timer-view">
        <span className="lof-labelexpired">Đã kết thúc</span>
      </div>
    )
  }

  if (!time) return null

  const pad = (n: number) => n.toString().padStart(2, '0')
  const blocks = [
    { v: pad(time.d), l: 'Ngày' },
    { v: pad(time.h), l: 'Giờ' },
    { v: pad(time.m), l: 'Phút' },
    { v: pad(time.s), l: 'Giây' },
  ]

  return (
    <div className="timer-view">
      {blocks.map((b, i) => (
        <div key={i} className="block-timer">
          <p>{b.v}</p>
          <span>{b.l}</span>
        </div>
      ))}
    </div>
  )
}
