'use client'

import { useRef, useState, useEffect } from 'react'

interface Tab {
  id: string
  name: string
}

interface Props {
  tabs: Tab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
}

export function SubCategoryTabs({ tabs, activeTabId, onTabChange }: Props) {
  const scrollRef = useRef<HTMLUListElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const checkOverflow = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 10)
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkOverflow()
    const el = scrollRef.current
    el?.addEventListener('scroll', checkOverflow)
    window.addEventListener('resize', checkOverflow)
    return () => {
      el?.removeEventListener('scroll', checkOverflow)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [])

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 190, behavior: 'smooth' })
  }

  return (
    <div className="tab_ul">
      {/* Gradient left + arrow */}
      {showLeft && (
        <div className="grad-left">
          <button className="button prev" onClick={() => scroll(-1)} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        </div>
      )}

      <ul ref={scrollRef}>
        {tabs.map(tab => (
          <li
            key={tab.id}
            className={activeTabId === tab.id ? 'current' : ''}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.name}</span>
          </li>
        ))}
      </ul>

      {/* Gradient right + arrow */}
      {showRight && (
        <div className="grad-right">
          <button className="button next" onClick={() => scroll(1)} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}
