'use client';

import { useState } from 'react';
import type { Condition } from '@/types/product';
import { conditionLabels } from '@/types/product';
import { cn, formatPrice } from '@/lib/utils';
import { ChevronDown, Check, RotateCcw } from 'lucide-react';

const PRICE_MIN = 0;
const PRICE_MAX = 80000000;


const PRICE_QUICK = [
  { label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: '20 - 40 triệu', min: 20000000, max: 40000000 },
  { label: 'Trên 40 triệu', min: 40000000, max: PRICE_MAX },
];

const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
const CONNECTIVITY_OPTIONS = ['WiFi', 'WiFi + 5G', 'WiFi + LTE'];

interface Props {
  // Model filter (chỉ cho trang category)
  models?: string[];
  activeModel?: string | null;
  onModelChange?: (model: string | null) => void;
  // Price
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  // Condition
  activeConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  // Storage
  activeStorage: string | null;
  onStorageChange: (storage: string | null) => void;
  // Connectivity
  activeConnectivity: string | null;
  onConnectivityChange: (conn: string | null) => void;
  // Stock
  inStockOnly: boolean;
  onInStockChange: (val: boolean) => void;
  // Reset
  onResetAll: () => void;
  hasFilters: boolean;
}

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-text-dark">
        {title}
        <ChevronDown className={cn('h-4 w-4 text-text-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function PillGroup({ options, active, onSelect, allowNull = true }: { options: string[]; active: string | null; onSelect: (val: string | null) => void; allowNull?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {allowNull && (
        <button
          onClick={() => onSelect(null)}
          className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors', !active ? 'bg-navy text-white border-navy' : 'border-border text-text-muted hover:border-navy/30')}
        >
          Tất cả
        </button>
      )}
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt === active ? null : opt)}
          className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors', active === opt ? 'bg-navy text-white border-navy' : 'border-border text-text-muted hover:border-navy/30')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function ProductSidebar({
  models, activeModel, onModelChange,
  priceRange, onPriceRangeChange,
  activeConditions, onConditionsChange,
  activeStorage, onStorageChange,
  activeConnectivity, onConnectivityChange,
  inStockOnly, onInStockChange,
  onResetAll, hasFilters,
}: Props) {
  const [sections, setSections] = useState({
    model: true, price: true, condition: true, storage: false, connectivity: false,
  });
  const toggle = (key: keyof typeof sections) => setSections((s) => ({ ...s, [key]: !s[key] }));

  const conditions: Condition[] = ['nguyen-seal', 'open-box', 'no-box'];

  const toggleCondition = (cond: string) => {
    onConditionsChange(
      activeConditions.includes(cond)
        ? activeConditions.filter((c) => c !== cond)
        : [...activeConditions, cond]
    );
  };

  const isQuickActive = (q: typeof PRICE_QUICK[0]) => priceRange[0] === q.min && priceRange[1] === q.max;

  return (
    <aside>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-bold text-text-dark uppercase tracking-wide">Bộ lọc</span>
          {hasFilters && (
            <button onClick={onResetAll} className="flex items-center gap-1 text-xs text-discount-red font-medium link-hover">
              <RotateCcw className="h-3 w-3" /> Xóa lọc
            </button>
          )}
        </div>

        {/* Model filter */}
        {models && models.length > 0 && onModelChange && (
          <Section title="Dòng sản phẩm" open={sections.model} onToggle={() => toggle('model')}>
            <PillGroup options={models} active={activeModel ?? null} onSelect={onModelChange} />
          </Section>
        )}

        {/* Price filter */}
        <Section title="Mức giá" open={sections.price} onToggle={() => toggle('price')}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onPriceRangeChange([PRICE_MIN, PRICE_MAX])}
              className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors', priceRange[0] === PRICE_MIN && priceRange[1] === PRICE_MAX ? 'bg-navy text-white border-navy' : 'border-border text-text-muted hover:border-navy/30')}
            >
              Tất cả
            </button>
            {PRICE_QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => onPriceRangeChange(isQuickActive(q) ? [PRICE_MIN, PRICE_MAX] : [q.min, q.max])}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors', isQuickActive(q) ? 'bg-navy text-white border-navy' : 'border-border text-text-muted hover:border-navy/30')}
              >
                {q.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Condition filter */}
        <Section title="Tình trạng máy" open={sections.condition} onToggle={() => toggle('condition')}>
          <div className="space-y-2">
            {conditions.map((cond) => {
              const active = activeConditions.includes(cond);
              return (
                <button
                  key={cond}
                  onClick={() => toggleCondition(cond)}
                  className={cn('flex items-center gap-2.5 w-full text-left text-sm py-1 transition-colors', active ? 'text-navy font-medium' : 'text-text-muted hover:text-text-dark')}
                >
                  <span className={cn('w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors', active ? 'bg-navy border-navy' : 'border-border')}>
                    {active && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </span>
                  {conditionLabels[cond]}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Storage filter */}
        <Section title="Dung lượng" open={sections.storage} onToggle={() => toggle('storage')}>
          <PillGroup options={STORAGE_OPTIONS} active={activeStorage} onSelect={onStorageChange} />
        </Section>

        {/* Connectivity filter */}
        <Section title="Kết nối" open={sections.connectivity} onToggle={() => toggle('connectivity')}>
          <PillGroup options={CONNECTIVITY_OPTIONS} active={activeConnectivity} onSelect={onConnectivityChange} />
        </Section>

        {/* In stock toggle */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-text-dark">Còn hàng</span>
          <button
            onClick={() => onInStockChange(!inStockOnly)}
            className={cn('relative w-11 h-6 rounded-full transition-colors shrink-0', inStockOnly ? 'bg-navy' : 'bg-gray-300')}
          >
            <span className={cn('absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200', inStockOnly ? 'translate-x-5' : 'translate-x-0')} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export { PRICE_MIN, PRICE_MAX };
