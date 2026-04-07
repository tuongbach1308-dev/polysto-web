'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { KeyRound } from 'lucide-react';
import { HOTLINE } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-sm mx-auto px-4 py-12">
      <div className="bg-white border border-border rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <KeyRound className="h-7 w-7 text-navy" />
          </div>
          <h1 className="text-xl font-bold text-text-dark">Quên mật khẩu</h1>
          <p className="text-sm text-text-muted mt-1">Nhập email để yêu cầu hỗ trợ</p>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📞</span>
            </div>
            <p className="text-sm text-text-dark font-medium">Yêu cầu đã được ghi nhận</p>
            <p className="text-xs text-text-muted mt-2">
              Vui lòng liên hệ hotline{' '}
              <a href={`tel:${HOTLINE}`} className="text-navy font-semibold">{HOTLINE}</a>{' '}
              để được hỗ trợ đặt lại mật khẩu.
            </p>
            <Link href="/dang-nhap" className="inline-block mt-4 text-sm text-navy font-medium link-hover">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <Input label="Email" type="email" placeholder="email@example.com" required />
            <Button type="submit" className="w-full">Gửi yêu cầu</Button>
          </form>
        )}

        {!submitted && (
          <p className="text-center text-sm text-text-muted mt-4">
            <Link href="/dang-nhap" className="text-navy font-medium link-hover">
              Quay lại đăng nhập
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
