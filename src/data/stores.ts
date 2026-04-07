export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapUrl: string;
  embedUrl: string;
  image: string;
}

export const stores: Store[] = [
  {
    id: '1',
    name: 'Cơ sở 1 - Hà Nội',
    address: '256 Đ. Nghi Tàm, Yên Phụ, Tây Hồ, Hà Nội',
    phone: '0815242433',
    hours: '8:30 - 21:30',
    mapUrl: 'https://maps.google.com/?q=256+Nghi+Tam+Yen+Phu+Tay+Ho+Ha+Noi',
    embedUrl: 'https://maps.google.com/maps?q=256+%C4%90.+Nghi+T%C3%A0m,+Y%C3%AAn+Ph%E1%BB%A5,+T%C3%A2y+H%E1%BB%93,+H%C3%A0+N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: '/images/stores/hanoi.svg',
  },
  {
    id: '2',
    name: 'Cơ sở 2 - Hồ Chí Minh',
    address: '214/8 Nguyễn Oanh, Phường 17, Gò Vấp, Hồ Chí Minh',
    phone: '0886815969',
    hours: '8:30 - 21:30',
    mapUrl: 'https://maps.google.com/?q=214/8+Nguyen+Oanh+Phuong+17+Go+Vap+Ho+Chi+Minh',
    embedUrl: 'https://maps.google.com/maps?q=214%2F8+Nguy%E1%BB%85n+Oanh,+Ph%C6%B0%E1%BB%9Dng+17,+G%C3%B2+V%E1%BA%A5p,+H%E1%BB%93+Ch%C3%AD+Minh&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: '/images/stores/hcm.svg',
  },
];
