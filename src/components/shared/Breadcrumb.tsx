import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: Props) {
  return (
    <div className="bread-crumb">
      <div className="container">
        <ol className="breadcrumb">
          <li>
            <Link href="/">Trang chủ</Link>
          </li>
          {items.map((item, i) => (
            <li key={i}>
              <span className="mr_lr">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: -2 }}><polyline points="9 18 15 12 9 6" /></svg>
              </span>
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <strong>{item.label}</strong>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
