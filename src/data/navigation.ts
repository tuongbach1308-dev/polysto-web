export interface NavItem {
  label: string;
  href: string;
}

export interface MegaDropdownModel {
  name: string;
  href: string;
}

export interface MegaDropdownColumn {
  title: string;
  href: string;
  models: MegaDropdownModel[];
}

export interface CategoryNavItem {
  label: string;
  slug: string;
  href: string;
  emoji: string;
  columns?: MegaDropdownColumn[];
}

export const topNav: NavItem[] = [
  { label: 'Tra cứu đơn hàng', href: '/tra-cuu-don-hang' },
  { label: 'Góc công nghệ', href: '/goc-cong-nghe' },
  { label: 'Liên hệ', href: '/lien-he' },
];

export const categoryNav: CategoryNavItem[] = [
  {
    label: 'iPad',
    slug: 'ipad',
    href: '/san-pham/ipad',
    emoji: '📱',
    columns: [
      {
        title: 'iPad Air',
        href: '/san-pham/ipad?loai=ipad-air',
        models: [
          { name: 'iPad Air 7', href: '/san-pham/ipad?loai=ipad-air&model=air-7' },
          { name: 'iPad Air 6', href: '/san-pham/ipad?loai=ipad-air&model=air-6' },
          { name: 'iPad Air 5', href: '/san-pham/ipad?loai=ipad-air&model=air-5' },
          { name: 'iPad Air 4', href: '/san-pham/ipad?loai=ipad-air&model=air-4' },
        ],
      },
      {
        title: 'iPad Gen',
        href: '/san-pham/ipad?loai=ipad-gen',
        models: [
          { name: 'iPad Gen 11', href: '/san-pham/ipad?loai=ipad-gen&model=gen-11' },
          { name: 'iPad Gen 10', href: '/san-pham/ipad?loai=ipad-gen&model=gen-10' },
          { name: 'iPad Gen 9', href: '/san-pham/ipad?loai=ipad-gen&model=gen-9' },
        ],
      },
      {
        title: 'iPad Pro',
        href: '/san-pham/ipad?loai=ipad-pro',
        models: [
          { name: 'iPad Pro M5', href: '/san-pham/ipad?loai=ipad-pro&model=pro-m5' },
          { name: 'iPad Pro M4', href: '/san-pham/ipad?loai=ipad-pro&model=pro-m4' },
          { name: 'iPad Pro M2', href: '/san-pham/ipad?loai=ipad-pro&model=pro-m2' },
          { name: 'iPad Pro M1', href: '/san-pham/ipad?loai=ipad-pro&model=pro-m1' },
        ],
      },
      {
        title: 'iPad Mini',
        href: '/san-pham/ipad?loai=ipad-mini',
        models: [
          { name: 'iPad Mini 7', href: '/san-pham/ipad?loai=ipad-mini&model=mini-7' },
          { name: 'iPad Mini 6', href: '/san-pham/ipad?loai=ipad-mini&model=mini-6' },
        ],
      },
    ],
  },
  {
    label: 'MacBook',
    slug: 'macbook',
    href: '/san-pham/macbook',
    emoji: '💻',
    columns: [
      {
        title: 'MacBook Pro',
        href: '/san-pham/macbook?loai=macbook-pro',
        models: [
          { name: 'Macbook Pro M4', href: '/san-pham/macbook?loai=macbook-pro&model=pro-m4' },
        ],
      },
      {
        title: 'MacBook Air',
        href: '/san-pham/macbook?loai=macbook-air',
        models: [
          { name: 'Macbook Air M4', href: '/san-pham/macbook?loai=macbook-air&model=air-m4' },
          { name: 'Macbook Air M3', href: '/san-pham/macbook?loai=macbook-air&model=air-m3' },
          { name: 'Macbook Air M2', href: '/san-pham/macbook?loai=macbook-air&model=air-m2' },
          { name: 'Macbook Air M1', href: '/san-pham/macbook?loai=macbook-air&model=air-m1' },
        ],
      },
    ],
  },
  {
    label: 'Âm thanh',
    slug: 'am-thanh',
    href: '/san-pham/am-thanh',
    emoji: '🎧',
    columns: [
      {
        title: 'AirPods',
        href: '/san-pham/am-thanh?loai=airpods',
        models: [
          { name: 'AirPods Pro 2', href: '/san-pham/am-thanh?loai=airpods&model=pro-2' },
          { name: 'AirPods 4', href: '/san-pham/am-thanh?loai=airpods&model=4' },
          { name: 'AirPods 3', href: '/san-pham/am-thanh?loai=airpods&model=3' },
        ],
      },
      {
        title: 'Chụp tai',
        href: '/san-pham/am-thanh?loai=chup-tai',
        models: [
          { name: 'AirPods Max', href: '/san-pham/am-thanh?loai=chup-tai&model=max' },
        ],
      },
    ],
  },
  {
    label: 'Phụ kiện Apple',
    slug: 'phu-kien-apple',
    href: '/san-pham/phu-kien-apple',
    emoji: '⚡',
  },
  {
    label: 'Phụ kiện iPad',
    slug: 'phu-kien-ipad',
    href: '/san-pham/phu-kien-ipad',
    emoji: '🛡️',
  },
  {
    label: 'Bút cảm ứng',
    slug: 'but-cam-ung',
    href: '/san-pham/but-cam-ung',
    emoji: '✏️',
  },
  {
    label: 'Phụ kiện khác',
    slug: 'phu-kien-khac',
    href: '/san-pham/phu-kien-khac',
    emoji: '📦',
  },
];
