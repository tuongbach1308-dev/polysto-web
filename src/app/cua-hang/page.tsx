import { getStores } from '@/lib/supabase/homepage';
import { mapStore } from '@/lib/adapters';
import { stores as staticStores } from '@/data/stores';
import StorePageClient from './StorePageClient';

export default async function StorePage() {
  const supaStores = await getStores();
  const stores = supaStores.length ? supaStores.map(mapStore) : staticStores;

  return <StorePageClient stores={stores} />;
}
