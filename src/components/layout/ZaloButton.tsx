import { getSettings } from '@/lib/supabase/settings'

export async function ZaloButton() {
  const settings = await getSettings()
  if (!settings.zalo_url) return null

  return (
    <a
      href={settings.zalo_url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      title="Chat Zalo"
    >
      <span className="text-white font-bold text-sm">Zalo</span>
    </a>
  )
}
