import { SectionRenderer } from '@/components/home/SectionRenderer'

export const revalidate = 60

export default async function HomePage() {
  return <SectionRenderer />
}
