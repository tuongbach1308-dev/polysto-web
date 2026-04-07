export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  href: string;
  bgColor: string;
}

export const banners: Banner[] = [
  {
    id: '1',
    title: 'iPad Air M3 - Mới nhất 2025',
    subtitle: 'Mỏng nhẹ. Mạnh mẽ. Giá từ 15.990.000đ',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczMUl1B408poKUIpbgN9u6TYBUFiqFJNgAetRlTrVblFhpN-jxLAHxy9ytdMz5K9KL7AcH0Cx02-LKNJQqFFE3hwJEYL9_tRdSeBwKV7ZcCGtlX2_Zg=w2400',
    cta: 'Mua ngay',
    href: '/san-pham/ipad',
    bgColor: 'from-green-50 to-emerald-100',
  },
  {
    id: '2',
    title: 'MacBook Air M3 - Siêu mỏng',
    subtitle: 'Hiệu năng đột phá. Giá chỉ từ 24.990.000đ',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczNbC8dgzMAzY0eUYyW6eWZPvvbuw2QL1Rs_b3STIB28oQoc8hRJlN_F_HFvJyDu8bXT9AO63_bW81o6y_C89VdkYJ7w_ay6evOWuCNNxSRSgQtRbR4=w2400',
    cta: 'Khám phá',
    href: '/san-pham/macbook',
    bgColor: 'from-lime-50 to-green-100',
  },
  {
    id: '3',
    title: 'AirPods Pro 2 - Giảm đến 26%',
    subtitle: 'Chống ồn tuyệt vời. Chỉ còn 4.990.000đ',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczPzad_L4Ss9JRgtDGzwmrr3ElsjH5phYbYQsbs3nZ4qGt3QJoJdTtPCcMCB6y8UQpcTDHS8Y6GG3ttjtytAyT_ql8zHZgoGrAHX7aMSEWMfx_-IxBo=w2400',
    cta: 'Xem ngay',
    href: '/san-pham/am-thanh',
    bgColor: 'from-emerald-50 to-teal-100',
  },
  {
    id: '4',
    title: 'Phụ kiện chính hãng Apple',
    subtitle: 'Đầy đủ sạc, cáp, ốp lưng, bút cảm ứng. Giảm đến 45%',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczM42ZdN0InEBURmilv50hfQEJWd8CJZPfbKhXCK4sz5G7x9gS6ZVGoGIKXJsyqdSP3dc5lCp4rWFbOkpgkjs-33Wck80op3q5-mCi4CrNuHEUEDpUc=w2400',
    cta: 'Xem tất cả',
    href: '/san-pham/phu-kien-apple',
    bgColor: 'from-green-50 to-lime-100',
  },
];
