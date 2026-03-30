'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatVND } from '@/lib/utils'
import { addToCart } from '@/lib/cart/store'

interface Props {
  product: {
    id: string
    name: string
    slug: string
    thumbnail?: string
    price_min?: number
    price_max?: number
    price?: number
    sale_price?: number
    stock?: number
    sku?: string
    condition_note?: string
    specs?: Record<string, string>
  }
  variant: 'catalog' | 'shop'
  phone?: string
}

export function ProductInfo({ product, variant, phone }: Props) {
  const [qty, setQty] = useState(1)
  const isShop = variant === 'shop'
  const outOfStock = isShop && product.stock !== undefined && product.stock <= 0

  const handleAddCart = () => {
    if (outOfStock) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price || product.price_min || 0,
      image: product.thumbnail,
    }, qty)
  }

  const specs = Object.entries(product.specs || {}).slice(0, 5)

  return (
    <div className="product-detail-info">
      {/* Title */}
      <h1 className="title-product">{product.name}</h1>

      {/* SKU */}
      <div className="product-top">
        {product.sku && (
          <span className="sku-product">
            SKU: <strong style={{ marginLeft: 4 }}>{product.sku.toUpperCase()}</strong>
          </span>
        )}
      </div>

      {/* Price */}
      <div className="price-box-detail" style={{ marginBottom: 15 }}>
        {isShop ? (
          <>
            {product.sale_price && product.sale_price < (product.price || 0) ? (
              <>
                <span className="special-price">{formatVND(product.sale_price)}đ</span>
                <span className="old-price" style={{ marginLeft: 10 }}>{formatVND(product.price!)}đ</span>
              </>
            ) : (
              <span className="special-price">{formatVND(product.price || 0)}đ</span>
            )}
          </>
        ) : (
          <span className="special-price">
            {product.price_min
              ? product.price_min === product.price_max
                ? `${formatVND(product.price_min)}đ`
                : `${formatVND(product.price_min)}đ - ${formatVND(product.price_max || product.price_min)}đ`
              : 'Liên hệ'
            }
          </span>
        )}
      </div>

      {/* Stock status */}
      {isShop && (
        <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: 10 }}>
          Tình trạng: {product.stock! > 0
            ? <span style={{ color: '#7bb842', fontWeight: 600 }}>Còn hàng ({product.stock})</span>
            : <span style={{ color: '#f83015', fontWeight: 600 }}>Hết hàng</span>
          }
        </p>
      )}

      {/* Condition note */}
      {product.condition_note && (
        <div style={{ background: '#f1f1f1', borderRadius: 8, padding: '8px 12px', marginBottom: 15, fontSize: '1.4rem' }}
          dangerouslySetInnerHTML={{ __html: product.condition_note }}
        />
      )}

      {/* Quick specs */}
      {specs.length > 0 && (
        <div className="specifications" style={{ marginBottom: 15 }}>
          <table>
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k}>
                  <td style={{ fontWeight: 600, color: '#444' }}>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action buttons */}
      <div className="button_actions" style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        {isShop ? (
          <>
            {/* Quantity */}
            <div className="input_number_product">
              <button className="btn_num" onClick={() => setQty(Math.max(1, qty - 1))} type="button">−</button>
              <input type="text" value={qty} readOnly />
              <button className="btn_num" onClick={() => setQty(qty + 1)} type="button">+</button>
            </div>

            {/* Buy now */}
            <button
              className="btn btn-buyNow"
              onClick={handleAddCart}
              disabled={outOfStock}
              style={{ flex: 1 }}
            >
              <span className="txt-main">MUA NGAY</span>
            </button>

            {/* Add to cart */}
            <button
              className="btn btn_add_cart"
              onClick={handleAddCart}
              disabled={outOfStock}
              aria-label="Thêm giỏ hàng"
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </button>
          </>
        ) : (
          /* Catalog: call to action */
          <a href={`tel:${(phone || '').replace(/\./g, '')}`} className="btn btn-buyNow" style={{ flex: 1, textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="txt-main">GỌI NGAY</span>
            <span style={{ fontSize: '1.3rem', opacity: 0.8 }}>{phone || 'POLY Store'}</span>
          </a>
        )}
      </div>
    </div>
  )
}
