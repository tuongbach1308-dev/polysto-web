"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Phone, Mail, MapPin } from "lucide-react";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours_weekday: string;
  hours_weekend: string;
}

export default function ContactPageClient({ contact }: { contact: ContactInfo | null }) {
  const info: ContactInfo = {
    phone: contact?.phone || "",
    email: contact?.email || "",
    address: contact?.address || "",
    hours_weekday: contact?.hours_weekday || "",
    hours_weekend: contact?.hours_weekend || "",
  };
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    await supabase.from("contacts").insert({ name: form.name, phone: form.phone, email: form.email || null, subject: form.subject || null, message: form.message });
    setLoading(false); setToast(true); setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    setTimeout(() => setToast(false), 4000);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Liên hệ</h1>
      {toast && <div className="custom-toast"><div className="bg-brand-500 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3"><span className="font-bold text-lg">✓</span><div><p className="font-semibold text-sm">Thành công!</p><p className="text-xs opacity-80">Thông tin đã được gửi đi.</p></div><button onClick={() => setToast(false)} className="ml-4 text-xl opacity-70 hover:opacity-100">&times;</button></div></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Thông tin</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><Phone size={16} className="text-brand-500" /><div><p className="text-xs text-gray-400">Hotline</p><a href={`tel:${info.phone.replace(/\s/g, "")}`} className="text-sm font-medium">{info.phone}</a></div></div>
              <div className="flex items-center gap-3"><Mail size={16} className="text-brand-500" /><div><p className="text-xs text-gray-400">Email</p><p className="text-sm">{info.email}</p></div></div>
              <div className="flex items-start gap-3"><MapPin size={16} className="text-brand-500 mt-0.5" /><div><p className="text-xs text-gray-400">Địa chỉ</p><p className="text-sm">{info.address}</p></div></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Giờ làm việc</h2>
            <p className="text-sm text-gray-500">{info.hours_weekday}</p>
            <p className="text-sm text-gray-500">{info.hours_weekend}</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Gửi yêu cầu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Họ và tên *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">SĐT *</label><input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Nội dung hỗ trợ</label><select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500"><option value="">Chọn</option><option>Tư vấn</option><option>Bảo hành</option><option>Đổi trả</option><option>Khác</option></select></div>
            </div>
            <div><label className="block text-xs text-gray-500 mb-1">Ghi chú *</label><textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500" /></div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3">{loading ? "Đang gửi..." : "Gửi yêu cầu"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
