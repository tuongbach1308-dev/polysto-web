"use client";

import { useState } from "react";
import { Plus, MapPin, Edit2, Trash2, X } from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  { id: "1", name: "Nguyễn Văn A", phone: "0815242433", address: "30 Ngõ 80 Trung Kính, P. Yên Hòa, Q. Cầu Giấy, Hà Nội", isDefault: true },
  { id: "2", name: "Nguyễn Văn A", phone: "0912345678", address: "214/8 Nguyễn Oanh, P. 17, Q. Gò Vấp, TP. Hồ Chí Minh", isDefault: false },
];

export default function AddressPage() {
  const [addresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Địa chỉ giao hàng</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
          <Plus size={16} /> Thêm địa chỉ
        </button>
      </div>

      {/* Address list */}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <MapPin size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{addr.name}</span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-sm text-gray-600">{addr.phone}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-medium text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">Mặc định</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{addr.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1 transition-colors">
                  <Edit2 size={12} /> Sửa
                </button>
                {!addr.isDefault && (
                  <>
                    <span className="text-gray-200">|</span>
                    <button className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors">
                      <Trash2 size={12} /> Xóa
                    </button>
                    <span className="text-gray-200">|</span>
                    <button className="text-xs text-gray-400 hover:text-brand-500 font-medium transition-colors">
                      Đặt mặc định
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-[500px] animate-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Thêm địa chỉ mới</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Họ tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Số điện thoại</label>
                  <input type="tel" placeholder="0xxx xxx xxx" className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Tỉnh / Thành phố</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 bg-white">
                    <option>Chọn Tỉnh/TP</option>
                    <option>Hà Nội</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Quận / Huyện</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 bg-white">
                    <option>Chọn Quận/Huyện</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Phường / Xã</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 bg-white">
                  <option>Chọn Phường/Xã</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Địa chỉ chi tiết</label>
                <input type="text" placeholder="Số nhà, tên đường..." className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-brand-500" />
                <span className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline py-2.5 text-sm">Hủy</button>
                <button type="submit" className="flex-1 btn-primary py-2.5 text-sm">Lưu địa chỉ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
