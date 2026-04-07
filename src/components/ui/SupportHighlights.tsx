import { ReceiptText, ShieldCheck, Truck, CreditCard } from 'lucide-react';

const highlights = [
  {
    icon: <ReceiptText className="h-7 w-7 text-navy" strokeWidth={1.5} />,
    title: 'Đổi trả miễn phí',
    desc: 'Trong vòng 7 ngày',
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-green-600" strokeWidth={1.5} />,
    title: 'Cam kết chính hãng',
    desc: 'Hoàn tiền 200% nếu phát hiện hàng giả',
  },
  {
    icon: <Truck className="h-7 w-7 text-orange-500" strokeWidth={1.5} />,
    title: 'Miễn phí vận chuyển',
    desc: 'Đơn hàng từ 300K',
  },
  {
    icon: <CreditCard className="h-7 w-7 text-navy" strokeWidth={1.5} />,
    title: 'Hỗ trợ trả góp',
    desc: '0% lãi suất qua thẻ tín dụng',
  },
];

export default function SupportHighlights() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
      {highlights.map((item, i) => (
        <div key={i} className="flex items-center gap-3 p-3 lg:p-4 bg-white border border-border rounded-lg">
          <div className="shrink-0">{item.icon}</div>
          <div>
            <h4 className="text-sm font-semibold text-text-dark">{item.title}</h4>
            <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
