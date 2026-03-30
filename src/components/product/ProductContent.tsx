'use client'

import { useState } from 'react'

interface Props {
  content: string
}

export function ProductContent({ content }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (!content) return null

  return (
    <div className={`product-review-content ${expanded ? 'expanded' : ''}`}>
      <div className="product-content">
        <div className={`ba-text-fpt ${!expanded ? 'has-height' : ''}`}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        {!expanded && (
          <div className="show-more" style={{ textAlign: 'center', paddingTop: 20 }}>
            <button className="btn--view-more" onClick={() => setExpanded(true)} type="button">
              Xem thêm
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6, verticalAlign: -2 }}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
