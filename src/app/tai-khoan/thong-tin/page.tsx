'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSaved(false);
    if (!oldPw || !newPw || !confirmPw) { setPwError('Vui lòng điền đầy đủ'); return; }
    if (newPw.length < 6) { setPwError('Mật khẩu mới tối thiểu 6 ký tự'); return; }
    if (newPw !== confirmPw) { setPwError('Xác nhận mật khẩu không khớp'); return; }
    const result = changePassword(oldPw, newPw);
    if (result.ok) {
      setPwSaved(true);
      setOldPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSaved(false), 3000);
    } else {
      setPwError(result.error || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-text-dark">Thông tin cá nhân</h1>
        <p className="text-sm text-text-muted mt-1">Cập nhật thông tin tài khoản của bạn</p>
      </div>

      {/* Profile form */}
      <form onSubmit={handleProfileSave} className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-text-dark uppercase">Thông tin cơ bản</h2>
        <Input label="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" value={user?.email || ''} disabled className="bg-bg-gray cursor-not-allowed" />
        <Input label="Số điện thoại" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="flex items-center gap-3">
          <Button type="submit">Lưu thay đổi</Button>
          {profileSaved && <span className="text-sm text-navy font-medium">Đã lưu thành công!</span>}
        </div>
      </form>

      {/* Password form */}
      <form onSubmit={handlePasswordChange} className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-text-dark uppercase">Đổi mật khẩu</h2>
        {pwError && <div className="bg-discount-red/10 text-discount-red text-sm px-4 py-2.5 rounded-lg">{pwError}</div>}
        <Input label="Mật khẩu hiện tại" type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
        <Input label="Mật khẩu mới" type="password" placeholder="Tối thiểu 6 ký tự" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
        <Input label="Xác nhận mật khẩu mới" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
        <div className="flex items-center gap-3">
          <Button type="submit" variant="outline">Đổi mật khẩu</Button>
          {pwSaved && <span className="text-sm text-navy font-medium">Đã đổi mật khẩu!</span>}
        </div>
      </form>
    </div>
  );
}
