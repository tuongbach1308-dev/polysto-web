'use client'

import { useState } from 'react'
import { addToCart } from '@/lib/cart/store'

interface Props {
  product: { id: string; name: string; price: number; image?: string }
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: Props) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleAdd}
        disabled={disabled}
        className={`flex-1 py-3 rounded-lg font-semibold text-center transition-all ${
          disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : added ? 'bg-emerald-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98]'
        }`}
      >
        {disabled ? 'Hết hàng' : added ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
      </button>
    </div>
  )
}
