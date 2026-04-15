"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Phone, Lock, UserPlus, LogIn, Loader2, CheckCircle } from "lucide-react";
import { signIn, signUp } from "@/lib/actions/auth";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Full page reload — ensures server picks up fresh session cookies
      window.location.href = redirectTo;
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 800);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[560px]">

        {/* Left: Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center rounded-lg p-10" style={{ background: "linear-gradient(135deg, #155e35 0%, #1f8f4e 100%)" }}>
          <Image src="/logo.svg" alt="POLY Store" width={80} height={80} className="mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Chào mừng đến POLY Store</h2>
          <p className="text-white/60 text-sm text-center max-w-[300px] leading-relaxed">
            Đăng nhập để theo dõi đơn hàng, lưu sản phẩm yêu thích và nhận nhiều ưu đãi hấp dẫn.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-[320px]">
            {[
              { num: "1000+", label: "Sản phẩm chính hãng" },
              { num: "50K+", label: "Khách hàng tin tưởng" },
              { num: "12T", label: "Bảo hành 1 đổi 1" },
              { num: "24/7", label: "Hỗ trợ tư vấn" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-white">{s.num}</p>
                <p className="text-[11px] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex flex-col justify-center">
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
                className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${tab === "login" ? "border-brand-500 text-brand-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                <LogIn size={16} /> Đăng nhập
              </button>
              <button
                onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
                className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${tab === "register" ? "border-brand-500 text-brand-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                <UserPlus size={16} /> Đăng ký
              </button>
            </div>

            {/* Error / Success messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600 flex items-center gap-2">
                <CheckCircle size={16} /> {success}
              </div>
            )}

            {/* Login form */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Nhập email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Mật khẩu</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="password"
                      type={showPw ? "text" : "password"}
                      required
                      placeholder="Nhập mật khẩu"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href="#" className="text-xs text-brand-500 hover:text-brand-600 transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Đang đăng nhập...</> : "Đăng nhập"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">hoặc đăng nhập với</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social login (placeholder) */}
                <div className="flex gap-3">
                  <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                  <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>
              </form>
            )}

            {/* Register form */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Họ và tên</label>
                  <input name="full_name" type="text" required placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Số điện thoại</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="phone" type="tel" placeholder="0xxx xxx xxx" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="email" type="email" required placeholder="email@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Mật khẩu</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="password" type={showPw ? "text" : "password"} required placeholder="Tối thiểu 6 ký tự" className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="confirm_password" type={showPw2 ? "text" : "password"} required placeholder="Nhập lại mật khẩu" className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" />
                    <button type="button" onClick={() => setShowPw2(!showPw2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 accent-brand-500" />
                  <span className="text-xs text-gray-500">
                    Tôi đồng ý với <Link href="#" className="text-brand-500 hover:underline">Điều khoản dịch vụ</Link> và <Link href="#" className="text-brand-500 hover:underline">Chính sách bảo mật</Link>
                  </span>
                </label>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Đang đăng ký...</> : "Đăng ký"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
