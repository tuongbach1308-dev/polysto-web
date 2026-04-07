export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  product: string;
}

export const testimonials: Testimonial[] = [
  { id: '1', name: 'Nguyễn Minh Anh', content: 'Mua iPad Air M2 ở đây rất uy tín, hàng nguyên seal, giao nhanh. Giá tốt hơn thị trường nhiều!', rating: 5, product: 'iPad Air M2' },
  { id: '2', name: 'Trần Hoàng Long', content: 'MacBook Air M3 giá quá tốt, nhân viên tư vấn nhiệt tình. Sẽ quay lại mua tiếp!', rating: 5, product: 'MacBook Air M3' },
  { id: '3', name: 'Lê Thị Hương', content: 'AirPods Pro 2 mua ở POLY Store rẻ hơn cửa hàng khác 500k, bảo hành đầy đủ.', rating: 5, product: 'AirPods Pro 2' },
  { id: '4', name: 'Phạm Đức Huy', content: 'Đã mua 3 chiếc iPad cho công ty, luôn hài lòng với chất lượng và dịch vụ.', rating: 5, product: 'iPad Pro M4' },
  { id: '5', name: 'Võ Ngọc Trâm', content: 'Mua MacBook Pro M2 Pro open box, máy như mới, tiết kiệm được gần 7 triệu. Tuyệt vời!', rating: 4, product: 'MacBook Pro M2 Pro' },
  { id: '6', name: 'Đỗ Quang Minh', content: 'Shop ship nhanh, đóng gói cẩn thận. Apple Pencil Pro rất đáng tiền!', rating: 5, product: 'Apple Pencil Pro' },
];
