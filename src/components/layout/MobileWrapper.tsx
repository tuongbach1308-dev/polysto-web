'use client'

import { useState } from 'react'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileBottomSheet } from './MobileBottomSheet'

interface Category {
  id: string
  name: string
  slug: string
  icon_url?: string
  children?: { id: string; name: string; slug: string }[]
}

interface Props {
  categories: Category[]
}

export function MobileWrapper({ categories }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <MobileBottomNav onOpenMenu={() => setSheetOpen(true)} />
      <MobileBottomSheet
        categories={categories}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  )
}
