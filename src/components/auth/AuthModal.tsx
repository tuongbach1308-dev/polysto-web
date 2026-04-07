'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { X, LogIn, UserPlus, KeyRound } from 'lucide-react';
import { HOTLINE } from '@/lib/constants';
import { useRouter } from 'next/navigation';

type View = 'login' | 'register' | 'forgot';

interface Props {
  open: boolean;
  onClose: () => void;
  initialView?: View;
}

export default function AuthModal({ open, onClose, initialView = 'login' }: Props) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [view, setView] = useState<View>(initialView);
  const [error, setError] = useState('');
  const [forgotDone, setForgotDone] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');

  // Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPw, setRegPw] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  if (!open) return null;

  const reset = () => {
    setError('');
    setLoginEmail(''); setLoginPw('');
    setRegName(''); setRegEmail(''); setRegPhone(''); setRegPw(''); setRegConfirm('');
    setForgotDone(false);
  };

  const switchView = (v: View) => { reset(); setView(v); };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPw) { setError('Vui lòng điền đầy đủ thông tin'); return; }
    const result = login(loginEmail, loginPw);
    if (result.ok) { reset(); onClose(); router.push('/tai-khoan'); }
    else setError(result.error || 'Đăng nhập thất bại');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName || !regEmail || !regPhone || !regPw || !regConfirm) { setError('Vui lòng điền đầy đủ thông tin'); return; }
    if (!/\S+@\S+\.\S+/.test(regEmail)) { setError('Email không hợp lệ'); return; }
    if (!/^0\d{9}$/.test(regPhone)) { setError('Số điện thoại phải có 10 chữ số'); return; }
    if (regPw.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
    if (regPw !== regConfirm) { setError('Xác nhận mật khẩu không khớp'); return; }
    const result = register({ name: regName, email: regEmail, phone: regPhone, password: regPw });
    if (result.ok) { reset(); onClose(); router.push('/tai-khoan'); }
    else setError(result.error || 'Đăng ký thất bại');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-gray flex items-center justify-center text-text-muted hover:text-text-dark transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 lg:p-8">
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LogIn className="h-7 w-7 text-navy" />
                </div>
                <h2 className="text-2xl font-bold text-text-dark">Đăng nhập</h2>
                <p className="text-sm text-text-muted mt-1">Chào mừng bạn quay trở lại</p>
              </div>

              {error && (
                <div className="bg-discount-red/10 text-discount-red text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <Input label="Tài khoản" type="text" placeholder="Nhập email hoặc tên đăng nhập" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <Input label="Mật khẩu" type="password" placeholder="Nhập mật khẩu" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} />
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-text-muted">
                    <input type="checkbox" className="rounded border-border" />
                    Ghi nhớ
                  </label>
                  <button type="button" onClick={() => switchView('forgot')} className="text-navy font-medium link-hover">
                    Quên mật khẩu?
                  </button>
                </div>
                <Button type="submit" className="w-full" size="lg">Đăng nhập</Button>
              </form>

              <p className="text-center text-sm text-text-muted mt-5">
                Chưa có tài khoản?{' '}
                <button onClick={() => switchView('register')} className="text-navy font-semibold link-hover">
                  Đăng ký ngay
                </button>
              </p>
            </>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-7 w-7 text-navy" />
                </div>
                <h2 className="text-2xl font-bold text-text-dark">Đăng ký</h2>
                <p className="text-sm text-text-muted mt-1">Tạo tài khoản để mua sắm dễ dàng hơn</p>
              </div>

              {error && (
                <div className="bg-discount-red/10 text-discount-red text-sm px-4 py-2.5 rounded-lg mb-4">{error}</div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <Input label="Họ và tên" placeholder="Nguyễn Văn A" value={regName} onChange={(e) => setRegName(e.target.value)} />
                <Input label="Email" type="email" placeholder="email@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                <Input label="Số điện thoại" type="tel" placeholder="0901234567" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                <Input label="Mật khẩu" type="password" placeholder="Tối thiểu 6 ký tự" value={regPw} onChange={(e) => setRegPw(e.target.value)} />
                <Input label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} />
                <Button type="submit" className="w-full" size="lg">Đăng ký</Button>
              </form>

              <p className="text-center text-sm text-text-muted mt-5">
                Đã có tài khoản?{' '}
                <button onClick={() => switchView('login')} className="text-navy font-semibold link-hover">
                  Đăng nhập
                </button>
              </p>
            </>
          )}

          {/* FORGOT VIEW */}
          {view === 'forgot' && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="h-7 w-7 text-navy" />
                </div>
                <h2 className="text-xl font-bold text-text-dark">Quên mật khẩu</h2>
                <p className="text-sm text-text-muted mt-1">Nhập email để yêu cầu hỗ trợ</p>
              </div>

              {forgotDone ? (
                <div className="text-center py-4">
                  <p className="text-sm text-text-dark font-medium">Yêu cầu đã được ghi nhận</p>
                  <p className="text-xs text-text-muted mt-2">
                    Vui lòng liên hệ hotline{' '}
                    <a href={`tel:${HOTLINE}`} className="text-navy font-semibold">{HOTLINE}</a>{' '}
                    để được hỗ trợ.
                  </p>
                  <button onClick={() => switchView('login')} className="mt-4 text-sm text-navy font-medium link-hover">
                    Quay lại đăng nhập
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={(e) => { e.preventDefault(); setForgotDone(true); }} className="space-y-4">
                    <Input label="Email" type="email" placeholder="email@example.com" required />
                    <Button type="submit" className="w-full">Gửi yêu cầu</Button>
                  </form>
                  <p className="text-center text-sm text-text-muted mt-4">
                    <button onClick={() => switchView('login')} className="text-navy font-medium link-hover">
                      Quay lại đăng nhập
                    </button>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
