'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    router.push('/tai-khoan');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Vui lòng điền đầy đủ thông tin'); return; }
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
    const result = login(email, password);
    if (result.ok) {
      router.push('/tai-khoan');
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-border rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <LogIn className="h-7 w-7 text-navy" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark">Đăng nhập</h1>
          <p className="text-sm text-text-muted mt-1">Chào mừng bạn quay trở lại</p>
        </div>

        {error && (
          <div className="bg-discount-red/10 text-discount-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-muted">
              <input type="checkbox" className="rounded border-border" />
              Ghi nhớ đăng nhập
            </label>
            <Link href="/quen-mat-khau" className="text-navy font-medium link-hover">
              Quên mật khẩu?
            </Link>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Chưa có tài khoản?{' '}
          <Link href="/dang-ky" className="text-navy font-semibold link-hover">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
