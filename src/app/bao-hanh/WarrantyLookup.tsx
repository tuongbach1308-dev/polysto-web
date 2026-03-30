'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface WarrantyResult {
  id: string; seri: string; customer_name: string; product_name: string
  warranty_start: string; warranty_end: string; status: string; notes?: string
}

export function WarrantyLookup() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<WarrantyResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/warranty?q=${encodeURIComponent(query.trim())}`)
      if (!res.ok) throw new Error('Lỗi tra cứu')
      const data = await res.json()
      setResults(data)
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const isExpired = (end: string) => new Date(end) < new Date()

  return (
    <div>
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Nhập số seri hoặc SĐT..."
          className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="btn-primary px-6 disabled:opacity-50"
        >
          {loading ? 'Đang tìm...' : 'Tra cứu'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

      {results !== null && (
        <div className="mt-6">
          {results.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-lg mb-1">Không tìm thấy kết quả</p>
              <p className="text-sm">Vui lòng kiểm tra lại số seri hoặc số điện thoại.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{r.product_name}</p>
                      <p className="text-sm text-slate-500 mt-1">Seri: <span className="font-mono uppercase">{r.seri}</span></p>
                      <p className="text-sm text-slate-500">Khách: {r.customer_name}</p>
                      <p className="text-sm text-slate-500">BH: {formatDate(r.warranty_start)} → {formatDate(r.warranty_end)}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isExpired(r.warranty_end)
                        ? 'bg-red-50 text-red-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {isExpired(r.warranty_end) ? 'Hết hạn' : 'Còn BH'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
