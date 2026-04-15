import { ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";

interface Badge {
  title: string;
  desc: string;
}

const FALLBACK_BADGES: Badge[] = [
  { title: "Chính hãng 100%", desc: "Cam kết Apple chính hãng" },
  { title: "Freeship toàn quốc", desc: "Đơn từ 300K thanh toán trước" },
  { title: "Trả góp 0%", desc: "Qua thẻ tín dụng & Krevido" },
  { title: "Hỗ trợ 24/7", desc: "Tư vấn miễn phí" },
];

const ICONS = [ShieldCheck, Truck, CreditCard, Headphones];

export default function ServiceBadges({ badges: badgesProp }: { badges?: Badge[] }) {
  const badges = badgesProp && badgesProp.length > 0 ? badgesProp : FALLBACK_BADGES;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {badges.slice(0, 4).map((b, i) => {
          const Icon = ICONS[i] || ShieldCheck;
          return (
            <div key={i} className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3">
              <Icon size={24} className="text-brand-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{b.title}</p>
                <p className="text-xs text-gray-500">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
