import { HOTLINE } from '@/lib/constants';
import { CheckCircle } from 'lucide-react';

export default function ProductDetailSidebar() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Khuyến mãi đặc biệt */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="bg-navy px-4 py-3 flex items-center gap-2">
          <span className="text-white text-base">🎁</span>
          <span className="text-white font-bold text-sm">Khuyến mãi đặc biệt</span>
        </div>
        <div className="px-4 py-4 space-y-2.5 text-sm text-text-dark">
          <div className="flex items-start gap-2">
            <span className="text-text-muted mt-0.5">•</span>
            <span>Voucher <span className="font-bold text-discount-red">300.000đ</span> cho lần mua sau</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-text-muted mt-0.5">•</span>
            <span>Bảo hành <span className="font-bold text-navy">12 tháng</span></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-text-muted mt-0.5">•</span>
            <span>Tặng kèm phụ kiện cao cấp</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-text-muted mt-0.5">•</span>
            <span><span className="font-bold text-navy underline">Thu cũ đổi mới</span>, trợ giá đến <span className="font-bold text-discount-red">95%</span></span>
          </div>
        </div>
      </div>

      {/* Chính sách hỗ trợ */}
      <div className="border border-border rounded-xl overflow-hidden flex-1">
        <div className="bg-bg-gray px-4 py-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-navy" />
          <span className="font-bold text-sm text-navy">Chính sách hỗ trợ</span>
        </div>
        <div className="divide-y divide-border">
          <div className="px-4 py-3.5 flex items-center gap-3">
            <span className="text-2xl shrink-0">🚚</span>
            <div>
              <p className="text-sm font-bold text-text-dark">Vận chuyển miễn phí</p>
              <p className="text-xs text-text-muted mt-0.5">Hóa đơn trên 5 triệu</p>
            </div>
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3">
            <span className="text-2xl shrink-0">🎁</span>
            <div>
              <p className="text-sm font-bold text-text-dark">Quà tặng</p>
              <p className="text-xs text-text-muted mt-0.5">Hóa đơn trên 10 triệu</p>
            </div>
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3">
            <span className="text-2xl shrink-0">✅</span>
            <div>
              <p className="text-sm font-bold text-text-dark">Chứng nhận chất lượng</p>
              <p className="text-xs text-text-muted mt-0.5">Sản phẩm chính hãng</p>
            </div>
          </div>
          <div className="px-4 py-3.5 flex items-center gap-3">
            <span className="text-2xl shrink-0">📞</span>
            <div>
              <p className="text-sm font-bold text-text-dark">Hotline: {HOTLINE}</p>
              <p className="text-xs text-text-muted mt-0.5">Hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
