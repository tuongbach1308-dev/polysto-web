export const SITE_NAME = 'POLY Store';
export const SITE_DESCRIPTION = 'Chuyên iPad, MacBook, phụ kiện Apple chính hãng';
export const EMAIL = 'contact@polystore.vn';

export const HOTLINE_HN = '0815242433';
export const HOTLINE_HCM = '0886815969';
export const HOTLINE = HOTLINE_HN;

export const STORES = {
  hanoi: {
    name: 'Cơ sở 1 - Hà Nội',
    address: '256 Đ. Nghi Tàm, Yên Phụ, Tây Hồ, Hà Nội',
    phone: HOTLINE_HN,
    hours: '8:30 - 21:30',
    mapUrl: 'https://maps.google.com/?q=256+Nghi+Tam+Yen+Phu+Tay+Ho+Ha+Noi',
  },
  hcm: {
    name: 'Cơ sở 2 - Hồ Chí Minh',
    address: '214/8 Nguyễn Oanh, Phường 17, Gò Vấp, Hồ Chí Minh',
    phone: HOTLINE_HCM,
    hours: '8:30 - 21:30',
    mapUrl: 'https://maps.google.com/?q=214/8+Nguyen+Oanh+Phuong+17+Go+Vap+Ho+Chi+Minh',
  },
};

export const SOCIAL_LINKS = {
  shopee: 'https://shopee.vn/anhphi.bantao',
  instagram: 'https://www.instagram.com/anhphibantao.vn/',
  facebook: 'https://www.facebook.com/anhphibantao.vn',
  tiktok: 'https://www.tiktok.com/@anhphibantao.com',
  threads: 'https://www.threads.com/@anhphibantao.vn',
};

export const SUPPORT_HIGHLIGHTS = [
  { icon: '🔄', title: 'Đổi trả miễn phí', desc: 'Trong vòng 7 ngày' },
  { icon: '✅', title: 'Cam kết chính hãng', desc: 'Hoàn tiền 200% nếu phát hiện hàng giả' },
  { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 300K' },
  { icon: '💳', title: 'Hỗ trợ trả góp', desc: '0% lãi suất qua thẻ tín dụng' },
];

export const PRICE_RANGES = [
  { label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { label: 'Trên 30 triệu', min: 30000000, max: Infinity },
];
