// Trang test đơn giản để xác nhận design tokens hoạt động đúng
export default function HomePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Design Tokens Test</h1>

      {/* Colors */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="w-20 h-20 bg-main rounded-card flex items-center justify-center text-white text-sm">main</div>
        <div className="w-20 h-20 bg-dark rounded-card flex items-center justify-center text-white text-sm">dark</div>
        <div className="w-20 h-20 bg-price rounded-card flex items-center justify-center text-white text-sm">price</div>
        <div className="w-20 h-20 bg-surface rounded-card flex items-center justify-center text-sm">surface</div>
        <div className="w-20 h-20 bg-dark-soft rounded-card flex items-center justify-center text-white text-sm">footer</div>
      </div>

      {/* Typography */}
      <div className="mb-8 space-y-2">
        <p className="text-product-name font-bold">Product name (16px bold)</p>
        <p className="text-price font-bold text-price">18.990.000đ (18px bold red)</p>
        <p className="text-sm text-price-old line-through">22.990.000đ (13px strikethrough)</p>
        <p className="text-section-title font-bold">Section Title (20px bold)</p>
        <p className="text-nav font-semibold text-white bg-dark-header p-2 inline-block">Nav item (16px 600)</p>
      </div>

      {/* Shadows */}
      <div className="flex gap-8 mb-8">
        <div className="w-40 h-40 bg-white shadow-card rounded-card p-4 text-sm">shadow-card</div>
        <div className="w-40 h-40 bg-white shadow-card-hover rounded-card p-4 text-sm">shadow-card-hover</div>
        <div className="w-40 h-40 bg-white shadow-blog rounded-section p-4 text-sm">shadow-blog</div>
      </div>

      {/* Container width check */}
      <div className="bg-surface-promo p-4 rounded-section mb-8">
        <p className="text-sm text-text-secondary">
          Container max-width: 1349px (xl padding 45px).
          Resize browser to check breakpoints: sm:576 md:768 lg:992 xl:1200
        </p>
      </div>

      {/* Banner effect test */}
      <div className="banner-effect w-60 h-40 bg-dark rounded-section mb-8 flex items-center justify-center text-white">
        Hover for shine effect
      </div>

      {/* View more button test */}
      <div className="view-more">
        <a href="#">
          Xem tất cả
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </a>
      </div>
    </div>
  )
}
