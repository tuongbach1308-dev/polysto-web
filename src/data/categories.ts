import type { Category } from '@/types/product';

export const categories: Category[] = [
  {
    name: 'iPad',
    slug: 'ipad',
    models: ['iPad Air', 'iPad Gen', 'iPad Pro', 'iPad Mini'],
    image: '/images/products/ipad-placeholder.svg',
  },
  {
    name: 'MacBook',
    slug: 'macbook',
    models: ['MacBook Pro', 'MacBook Air'],
    image: '/images/products/macbook-placeholder.svg',
  },
  {
    name: 'Âm thanh',
    slug: 'am-thanh',
    models: ['AirPods', 'Chụp tai'],
    image: '/images/products/audio-placeholder.svg',
  },
  {
    name: 'Phụ kiện Apple',
    slug: 'phu-kien-apple',
    models: ['Sạc', 'Cáp', 'Magic Mouse', 'Magic Keyboard'],
    image: '/images/products/accessory-placeholder.svg',
  },
  {
    name: 'Phụ kiện iPad',
    slug: 'phu-kien-ipad',
    models: ['Ốp lưng', 'Kính cường lực', 'Bao da'],
    image: '/images/products/ipad-acc-placeholder.svg',
  },
  {
    name: 'Bút cảm ứng',
    slug: 'but-cam-ung',
    models: ['Apple Pencil', 'Bút cảm ứng khác'],
    image: '/images/products/pencil-placeholder.svg',
  },
  {
    name: 'Phụ kiện khác',
    slug: 'phu-kien-khac',
    models: ['Hub', 'Adapter', 'Khác'],
    image: '/images/products/other-placeholder.svg',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
