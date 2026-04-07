'use client';

import { cn } from '@/lib/utils';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: 'all', label: 'Mới nhất' },
  { key: 'phu-kien', label: 'Phụ kiện' },
  { key: 'ipad', label: 'iPad' },
  { key: 'macbook', label: 'Macbook' },
];

export default function BlogFilterTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium transition-colors relative',
            activeTab === tab.key
              ? 'text-navy'
              : 'text-text-muted hover:text-text-dark'
          )}
        >
          {tab.label}
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy" />
          )}
        </button>
      ))}
    </div>
  );
}
