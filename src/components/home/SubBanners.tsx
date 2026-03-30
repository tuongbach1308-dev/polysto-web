import Image from 'next/image'
import Link from 'next/link'

interface Banner {
  id: string
  title: string
  image_url: string
  link_url?: string
  grid_size?: string
}

interface Props {
  banners: Banner[]
}

export function SubBanners({ banners }: Props) {
  if (banners.length === 0) return null

  // Layout: first banner large (2/3), rest stacked (1/3)
  // Or if only 2: split 50/50
  // Or if 3+: first 2/3 + column of 2 (1/3 each)
  const first = banners[0]
  const rest = banners.slice(1, 3) // max 2 side banners

  return (
    <section className="sub-banners mt-[15px]">
      <div className="poly-container">
        <div className="flex gap-[15px]">
          {/* Main large banner */}
          <div className={rest.length > 0 ? 'w-full lg:w-2/3' : 'w-full'}>
            <BannerCard banner={first} className="aspect-[2/1] lg:h-full" />
          </div>

          {/* Side banners */}
          {rest.length > 0 && (
            <div className="hidden lg:flex lg:w-1/3 flex-col gap-[15px]">
              {rest.map((b) => (
                <BannerCard key={b.id} banner={b} className="flex-1" />
              ))}
            </div>
          )}
        </div>

        {/* Mobile: show side banners as horizontal scroll */}
        {rest.length > 0 && (
          <div className="lg:hidden flex gap-[10px] mt-[10px] overflow-x-auto no-scrollbar">
            {rest.map((b) => (
              <div key={b.id} className="min-w-[70%] xs:min-w-[48%]">
                <BannerCard banner={b} className="aspect-[2/1]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BannerCard({ banner, className = '' }: { banner: Banner; className?: string }) {
  const content = (
    <div className={`relative rounded-section overflow-hidden banner-shine ${className}`}>
      <Image
        src={banner.image_url}
        alt={banner.title}
        fill
        className="object-cover"
        sizes="(max-width: 991px) 100vw, 66vw"
      />
    </div>
  )

  if (banner.link_url) {
    return <Link href={banner.link_url} className="block">{content}</Link>
  }
  return content
}
