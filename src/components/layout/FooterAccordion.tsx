'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  title: string
  children: React.ReactNode
}

export function FooterAccordion({ title, children }: Props) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const toggle = () => {
    if (!isMobile) return
    setOpen(!open)
  }

  return (
    <div className="footer-click">
      <h4
        className={`title-menu ${isMobile ? 'clicked' : ''} ${open ? 'cls_mn' : ''}`}
        onClick={toggle}
        style={{ cursor: isMobile ? 'pointer' : 'default' }}
      >
        <span>{title}</span>
      </h4>
      <div
        ref={contentRef}
        className={`list-menu ${isMobile ? (open ? 'hidden-mob current' : 'hidden-mob') : ''}`}
      >
        {children}
      </div>
    </div>
  )
}
