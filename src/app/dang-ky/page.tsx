'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    router.push('/tai-khoan');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone || !password || !confirm) { setError('Vui lòng điền đầy đủ thông tin'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email không hợp lệ'); return; }
    if (!/^0\d{9}$/.test(phone)) { setError('Số điện thoại phải có 10 chữ số'); return; }
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
    if (password !== confirm) { setError('Xác nhận mật khẩu không khớp'); return; }
    const result = register({ name, email, phone, password });
    if (result.ok) {
      router.push('/tai-khoan');
    } else {
      setError(result.error || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-border rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserPlus className="h-7 w-7 text-navy" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark">Đăng ký tài khoản</h1>
          <p className="text-sm text-text-muted mt-1">Tạo tài khoản để mua sắm dễ dàng hơn</p>
        </div>

        {error && (
          <div className="bg-discount-red/10 text-discount-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Họ và tên" placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Số điện thoại" type="tel" placeholder="0901234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Mật khẩu" type="password" placeholder="Tối thiểu 6 ký tự" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <Button type="submit" className="w-full" size="lg">
            Đăng ký
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Đã có tài khoản?{' '}
          <Link href="/dang-nhap" className="text-navy font-semibold link-hover">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
