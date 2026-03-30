import Image from 'next/image'
import Link from 'next/link'

interface Feature {
  id: string
  icon_url?: string
  icon_type: string
  icon_name?: string
  title: string
  description?: string
  link_url?: string
}

interface Props {
  features: Feature[]
}

const BG_COLORS = ['promo-bg-1', 'promo-bg-2', 'promo-bg-3', 'promo-bg-4']

export function FeaturesStrip({ features }: Props) {
  if (features.length === 0) return null

  return (
    <section className="features-strip py-[20px]">
      <div className="poly-container">
        {/* Desktop: 4 columns */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-[12px]">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} bgClass={BG_COLORS[i % BG_COLORS.length]} />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-[10px] overflow-x-auto no-scrollbar pb-[4px]">
          {features.map((f, i) => (
            <div key={f.id} className="shrink-0 w-[75%] xs:w-[48%]">
              <FeatureCard feature={f} bgClass={BG_COLORS[i % BG_COLORS.length]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, bgClass }: { feature: Feature; bgClass: string }) {
  const content = (
    <div className={`${bgClass} rounded-section p-[16px] flex items-center gap-[12px] h-full transition-transform hover:scale-[1.02] duration-300`}>
      <div className="shrink-0 w-[44px] h-[44px] relative">
        {feature.icon_type === 'image' && feature.icon_url ? (
          <Image src={feature.icon_url} alt={feature.title} fill className="object-contain" sizes="44px" />
        ) : feature.icon_type === 'emoji' && feature.icon_name ? (
          <span className="text-[2.8rem] leading-none">{feature.icon_name}</span>
        ) : (
          <span className="text-[2.8rem] leading-none">⭐</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[1.4rem] font-bold text-dark leading-tight">{feature.title}</h4>
        {feature.description && (
          <p className="text-[1.2rem] text-price-old mt-[2px] line-clamp-2">{feature.description}</p>
        )}
      </div>
    </div>
  )

  if (feature.link_url) {
    return <Link href={feature.link_url} className="block">{content}</Link>
  }
  return content
}
