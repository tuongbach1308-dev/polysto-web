import { createServerClient } from './server'

export type SettingsMap = Record<string, string>

export async function getSettings(): Promise<SettingsMap> {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_settings').select('setting_key, setting_value')
  const map: SettingsMap = {}
  for (const row of data || []) {
    map[row.setting_key] = row.setting_value || ''
  }
  return map
}
