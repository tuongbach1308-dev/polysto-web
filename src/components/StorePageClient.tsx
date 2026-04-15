"use client";

import { useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

interface StoreInfo {
  name: string;
  address: string;
  hotline: string;
  phone2: string;
  hours: string;
  mapEmbed: string;
  images?: string[];
}

const DEFAULT_STORES: StoreInfo[] = [
  { name: "POLY Store - Bình Thạnh", address: "170/4/2 Bùi Đình Túy, Phường Bình Thạnh, TPHCM", hotline: "0815.242.433", phone2: "", hours: "8:00 - 21:00 (T2 - CN)", mapEmbed: "", images: [] },
];

export default function StorePageClient({ stores: storesProp }: { stores: StoreInfo[] | null }) {
  const stores = storesProp && storesProp.length > 0 ? storesProp : DEFAULT_STORES;
  const [selected, setSelected] = useState(0);
  const store = stores[selected];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-5">Cửa hàng POLY Store</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-2 space-y-2">
          {stores.map((s, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${selected === i ? "border-brand-500 bg-brand-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <div className="flex items-start gap-2">
                <MapPin size={14} className={`mt-0.5 flex-shrink-0 ${selected === i ? "text-brand-500" : "text-red-500"}`} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{s.address}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Hotline: <span className="font-semibold text-brand-600">{s.hotline}</span></p>
                  {s.phone2 && <p className="text-[11px] text-gray-500">Phản ánh: <span className="font-semibold text-brand-600">{s.phone2}</span></p>}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 min-h-[280px]">
          {store.mapEmbed ? (
            <iframe key={selected} src={store.mapEmbed} className="w-full h-full min-h-[280px] lg:min-h-[350px]" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Bản đồ ${store.name}`} />
          ) : (
            <div className="w-full h-full min-h-[280px] flex items-center justify-center text-gray-400 text-sm">Chưa có bản đồ</div>
          )}
        </div>
      </div>

      {/* Gallery */}
      {store.images && store.images.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 text-center">
            Hình ảnh tại <span className="text-brand-600">{store.name}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {store.images.map((img, i) => (
              <div key={`${selected}-${i}`} className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                <img src={img} alt={`${store.name} - Ảnh ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Clock size={18} className="text-brand-500" />
            <p className="text-[11px] font-semibold text-gray-800">Giờ mở cửa</p>
            <p className="text-[11px] text-gray-500">{store.hours || "8:00 - 21:00"}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Phone size={18} className="text-brand-500" />
            <p className="text-[11px] font-semibold text-gray-800">Hotline</p>
            <a href={`tel:${store.hotline.replace(/\./g, "")}`} className="text-[11px] text-brand-600 font-semibold">{store.hotline}</a>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapPin size={18} className="text-brand-500" />
            <p className="text-[11px] font-semibold text-gray-800">{stores.length} chi nhánh</p>
            <p className="text-[11px] text-gray-500">Toàn quốc</p>
          </div>
        </div>
      </div>
    </div>
  );
}
