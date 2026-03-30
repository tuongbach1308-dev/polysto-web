import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  icon_url?: string
  image_url?: string
}

interface Props {
  categories: Category[]
}

export function CategoryStrip({ categories }: Props) {
  if (categories.length === 0) return null

  return (
    <section className="category-strip py-[20px]">
      <div className="poly-container">
        {/* Desktop: flex wrap, centered */}
        <div className="hidden md:flex flex-wrap justify-center gap-[12px]">
          {categories.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-[10px] overflow-x-auto no-scrollbar pb-[5px]">
          {categories.map((cat) => (
            <div key={cat.id} className="shrink-0 w-[80px]">
              <CategoryItem category={cat} mobile />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryItem({ category, mobile }: { category: Category; mobile?: boolean }) {
  const img = category.icon_url || category.image_url

  return (
    <Link
      href={`/danh-muc/${category.slug}`}
      className={`cate-item-hover flex flex-col items-center gap-[6px] transition-all duration-300 ${
        mobile
          ? 'text-center'
          : 'bg-surface rounded-section px-[16px] py-[12px] min-w-[110px]'
      }`}
    >
      <div className={`cate-image relative ${mobile ? 'w-[50px] h-[50px]' : 'w-[44px] h-[44px]'}`}>
        {img ? (
          <Image
            src={img}
            alt={category.name}
            fill
            className="object-contain transition-transform duration-300"
            sizes="50px"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-surface-light flex items-center justify-center text-xl">
            📱
          </div>
        )}
      </div>
      <span className={`cate-name text-center font-semibold leading-tight transition-colors duration-300 ${
        mobile ? 'text-[1.1rem] line-clamp-2' : 'text-[1.2rem]'
      }`}>
        {category.name}
      </span>
    </Link>
  )
}
