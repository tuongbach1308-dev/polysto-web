"use client";

import { useState, useEffect } from "react";
import { Camera, Loader2, CheckCircle } from "lucide-react";
import { getUserProfile } from "@/lib/auth";
import { updateProfile, changePassword } from "@/lib/actions/auth";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    getUserProfile().then((p) => {
      if (p) {
        setForm({
          name: p.full_name || "",
          phone: p.phone || "",
          email: p.email || "",
        });
      }
    });
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.set("full_name", form.name);
    formData.set("phone", form.phone);

    const result = await updateProfile(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setMessage("Cập nhật thành công!");
      setTimeout(() => setMessage(""), 3000);
    }
    setLoading(false);
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwLoading(true);
    setPwError("");
    setPwMessage("");

    const formData = new FormData(e.currentTarget);
    const newPw = formData.get("new_password") as string;
    const confirmPw = formData.get("confirm_password") as string;

    if (newPw !== confirmPw) {
      setPwError("Mật khẩu xác nhận không khớp");
      setPwLoading(false);
      return;
    }

    const result = await changePassword(formData);
    if (result.error) {
      setPwError(result.error);
    } else {
      setPwMessage("Đổi mật khẩu thành công!");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setPwMessage(""), 3000);
    }
    setPwLoading(false);
  }

  const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input {...props} className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" />
    </div>
  );

  const initial = (form.name || form.email || "K").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h1>

      {/* Profile form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 md:p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-brand-600 text-2xl font-bold">{initial}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center shadow hover:bg-brand-600 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{form.name || "Chưa đặt tên"}</p>
            <p className="text-xs text-gray-400">{form.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center gap-2">
            <CheckCircle size={16} /> {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Họ và tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Số điện thoại" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" type="email" value={form.email} disabled />
          </div>
          <button type="submit" disabled={loading} className="btn-primary px-8 py-2.5 text-sm flex items-center gap-2">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Đang lưu...</> : "Lưu thay đổi"}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 md:p-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Đổi mật khẩu</h2>

        {pwError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{pwError}</div>
        )}
        {pwMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center gap-2">
            <CheckCircle size={16} /> {pwMessage}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-[400px]">
          <Input label="Mật khẩu mới" name="new_password" type="password" />
          <Input label="Xác nhận mật khẩu mới" name="confirm_password" type="password" />
          <button type="submit" disabled={pwLoading} className="btn-outline px-8 py-2.5 text-sm flex items-center gap-2">
            {pwLoading ? <><Loader2 size={14} className="animate-spin" /> Đang cập nhật...</> : "Cập nhật mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
