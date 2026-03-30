import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, getPages } from '@/lib/supabase/pages'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getSettings } from '@/lib/supabase/settings'

export const revalidate = 60

// Reserved slugs that should NOT match this catch-all
const RESERVED = ['san-pham', 'danh-muc', 'shop', 'bai-viet', 'bao-hanh', 'gio-hang', 'thanh-toan', 'dat-hang-thanh-cong', 'api']

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (RESERVED.includes(params.slug)) return {}
  const page = await getPageBySlug(params.slug)
  if (!page) return {}
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || '',
    openGraph: page.og_image ? { images: [{ url: page.og_image }] } : {},
  }
}

export default async function CmsPage({ params }: { params: { slug: string } }) {
  if (RESERVED.includes(params.slug)) notFound()

  const page = await getPageBySlug(params.slug)
  if (!page) notFound()

  const settings = await getSettings()
  const baseUrl = settings.site_url || ''

  return (
    <div className="container-page py-8 max-w-4xl mx-auto">
      <BreadcrumbSchema items={[
        { name: 'Trang chủ', url: baseUrl },
        { name: page.title, url: `${baseUrl}/${page.slug}` },
      ]} />

      <h1 className="text-3xl font-bold text-slate-800 mb-8">{page.title}</h1>
      <div className="prose-content" dangerouslySetInnerHTML={{ __html: page.content }} />

      {/* Google Maps for contact page */}
      {page.template === 'contact' && settings.google_maps_embed && (
        <div className="mt-8 rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }} />
      )}
    </div>
  )
}
