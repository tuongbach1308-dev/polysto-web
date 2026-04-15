"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart, updateCartItem, removeFromCart, getCartTotal, setCheckoutItems } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { OrderItem } from "@/lib/database.types";
import { Trash2, Plus, Minus, ShoppingBag, CheckSquare, Square, Info } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";

export default function CartPage() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [voucher, setVoucher] = useState("");

  useEffect(() => {
    const update = () => {
      const c = getCart();
      setCart(c);
      setSelected((prev) => {
        if (prev.length === c.length) return prev;
        return c.map((_, i) => prev[i] ?? true);
      });
    };
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  const allSelected = selected.length > 0 && selected.every(Boolean);
  const selectedCount = selected.filter(Boolean).length;
  const selectedTotal = cart.reduce((s, item, i) => selected[i] ? s + item.price * item.quantity : s, 0);

  function toggleAll() {
    setSelected(selected.map(() => !allSelected));
  }

  function toggleItem(index: number) {
    setSelected(selected.map((v, i) => i === index ? !v : v));
  }

  function deleteSelected() {
    for (let i = cart.length - 1; i >= 0; i--) {
      if (selected[i]) removeFromCart(i);
    }
    setCart(getCart());
  }

  if (cart.length === 0) return (
    <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
      <ShoppingBag className="mx-auto text-gray-200 mb-4" size={56} />
      <h1 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h1>
      <p className="text-sm text-gray-400 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
      <Link href="/san-pham" className="btn-primary">Tiếp tục mua sắm</Link>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <StepIndicator steps={["Giỏ hàng", "Đặt hàng", "Hoàn tất"]} currentStep={0} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ══ Left: Cart items (2/3) ══ */}
          <div className="lg:col-span-2 space-y-3">

            {/* Select all bar */}
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <button onClick={toggleAll} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors">
                {allSelected
                  ? <CheckSquare size={18} className="text-brand-500" />
                  : <Square size={18} className="text-gray-300" />
                }
                Chọn tất cả ({cart.length} sản phẩm)
              </button>
              {selectedCount > 0 && (
                <button onClick={deleteSelected} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} /> Xóa
                </button>
              )}
            </div>

            {/* Cart items */}
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  {/* Checkbox */}
                  <button onClick={() => toggleItem(i)} className="flex-shrink-0">
                    {selected[i]
                      ? <CheckSquare size={18} className="text-brand-500" />
                      : <Square size={18} className="text-gray-300" />
                    }
                  </button>

                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-white border border-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</h3>
                    <div className="flex gap-2 mt-1">
                      {item.variant && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.variant}</span>
                      )}
                      {item.color && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.color}</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm font-bold text-brand-600">{formatPrice(item.price)}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-md flex-shrink-0">
                    <button onClick={() => updateCartItem(i, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-500 transition-colors">
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateCartItem(i, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-500 transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button onClick={() => { removeFromCart(i); setCart(getCart()); }}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Tip bar */}
            <div className="bg-brand-50 border border-brand-100 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <Info size={14} className="text-brand-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-brand-600">Mẹo nhỏ</span> — <Link href="/dang-nhap" className="text-brand-500 font-medium hover:underline">Đăng nhập</Link> nhẹ nhàng để được ưu tiên freeship, tracking đơn trong một nốt nhạc
              </p>
            </div>
          </div>

          {/* ══ Right: Payment summary (1/3) ══ */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-[120px]">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Thông tin thanh toán
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tổng tiền:</span>
                  <span className="font-semibold text-gray-800">{formatPrice(selectedTotal)}</span>
                </div>

                {/* Voucher */}
                <div>
                  <label className="text-gray-500 text-sm">Voucher khuyến mãi</label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="text"
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value)}
                      placeholder="Chọn hoặc nhập mã"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Tổng thanh toán:</span>
                  <span className="text-lg font-bold text-brand-600">{formatPrice(selectedTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const items = cart.filter((_, i) => selected[i]);
                  setCheckoutItems(items);
                  window.location.href = "/thanh-toan";
                }}
                disabled={selectedCount === 0}
                className={`mt-4 w-full text-center py-3 rounded-md text-sm font-bold uppercase transition-colors ${
                  selectedCount > 0
                    ? "btn-primary cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Đi đến thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
