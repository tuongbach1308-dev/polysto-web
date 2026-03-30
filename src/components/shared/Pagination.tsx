import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  const href = (page: number) => page === 1 ? basePath : `${basePath}?page=${page}`

  return (
    <div className="nav_pagi">
      <ul className="pagination">
        {/* Prev */}
        <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
          {currentPage > 1 ? (
            <Link href={href(currentPage - 1)} className="page-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </Link>
          ) : (
            <span className="page-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </span>
          )}
        </li>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === '...' ? (
            <li key={`dots-${i}`} className="page-item">
              <span className="page-link" style={{ border: 0 }}>...</span>
            </li>
          ) : (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <Link href={href(page)} className="page-link">{page}</Link>
            </li>
          )
        )}

        {/* Next */}
        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
          {currentPage < totalPages ? (
            <Link href={href(currentPage + 1)} className="page-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          ) : (
            <span className="page-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </span>
          )}
        </li>
      </ul>
    </div>
  )
}
