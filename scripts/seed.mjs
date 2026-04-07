import { createClient } from '@supabase/supabase-js'

const SB_URL = 'https://egniotwnnoivmwjxoflv.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbmlvdHdubm9pdm13anhvZmx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ0OTMxNiwiZXhwIjoyMDkwMDI1MzE2fQ.YMvnGYdKhCqDpLuMbvOlSdsEP7XMAfN5TgDOGRgLNbw'

const sb = createClient(SB_URL, SB_KEY)

// ============================================================
// 1. CATEGORIES
// ============================================================
const categories = [
  { name: 'iPad', slug: 'ipad', description: 'iPad Apple chinh hang', sort_order: 0, is_active: true, show_on_homepage: true },
  { name: 'MacBook', slug: 'macbook', description: 'MacBook Apple chinh hang', sort_order: 1, is_active: true, show_on_homepage: true },
  { name: 'Am thanh', slug: 'am-thanh', description: 'AirPods, tai nghe Apple', sort_order: 2, is_active: true, show_on_homepage: true },
  { name: 'Phu kien Apple', slug: 'phu-kien-apple', description: 'Sac, cap, chuot, ban phim Apple', sort_order: 3, is_active: true, show_on_homepage: true },
  { name: 'Phu kien iPad', slug: 'phu-kien-ipad', description: 'Op lung, kinh, bao da iPad', sort_order: 4, is_active: true, show_on_homepage: true },
  { name: 'But cam ung', slug: 'but-cam-ung', description: 'Apple Pencil, but cam ung', sort_order: 5, is_active: true, show_on_homepage: true },
  { name: 'Phu kien khac', slug: 'phu-kien-khac', description: 'Hub, adapter, phu kien khac', sort_order: 6, is_active: true, show_on_homepage: true },
]

// ============================================================
// 2. PRODUCTS (from anhphi static data)
// ============================================================
const products = [
  { name: 'iPad Air 7 M3 256GB WiFi', slug: 'ipad-air-7-m3-256gb-wifi', cat: 'ipad', brand: 'Apple', price_min: 15990000, price_max: 15990000, specs: { 'Chip': 'M3', 'Bo nho': '256GB', 'Man hinh': '11 inch Liquid Retina', 'Ket noi': 'WiFi' }, short_description: 'iPad Air 7 chip M3 manh me, man hinh 11 inch sac net.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 0 },
  { name: 'iPad Air 6 M2 128GB WiFi', slug: 'ipad-air-6-m2-128gb-wifi', cat: 'ipad', brand: 'Apple', price_min: 12990000, price_max: 12990000, specs: { 'Chip': 'M2', 'Bo nho': '128GB', 'Man hinh': '11 inch Liquid Retina', 'Ket noi': 'WiFi' }, short_description: 'iPad Air 6 chip M2 hieu nang cao.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 1 },
  { name: 'iPad Air 5 M1 64GB WiFi', slug: 'ipad-air-5-m1-64gb-wifi', cat: 'ipad', brand: 'Apple', price_min: 9990000, price_max: 9990000, specs: { 'Chip': 'M1', 'Bo nho': '64GB', 'Man hinh': '10.9 inch Liquid Retina', 'Ket noi': 'WiFi' }, short_description: 'iPad Air 5 M1 gia tot.', condition_note: 'Open Box', is_featured: false, sort_order: 2 },
  { name: 'iPad Pro M4 256GB WiFi 11 inch', slug: 'ipad-pro-m4-256gb-wifi-11', cat: 'ipad', brand: 'Apple', price_min: 26990000, price_max: 26990000, specs: { 'Chip': 'M4', 'Bo nho': '256GB', 'Man hinh': '11 inch Ultra Retina XDR', 'Ket noi': 'WiFi' }, short_description: 'iPad Pro M4 sieu mong, hieu nang vuot troi.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 3 },
  { name: 'iPad Pro M2 128GB WiFi 11 inch', slug: 'ipad-pro-m2-128gb-wifi-11', cat: 'ipad', brand: 'Apple', price_min: 18990000, price_max: 18990000, specs: { 'Chip': 'M2', 'Bo nho': '128GB', 'Man hinh': '11 inch Liquid Retina XDR', 'Ket noi': 'WiFi' }, short_description: 'iPad Pro M2 cho cong viec chuyen nghiep.', condition_note: 'Open Box', is_featured: false, sort_order: 4 },
  { name: 'iPad Gen 10 64GB WiFi', slug: 'ipad-gen-10-64gb-wifi', cat: 'ipad', brand: 'Apple', price_min: 7990000, price_max: 7990000, specs: { 'Chip': 'A14 Bionic', 'Bo nho': '64GB', 'Man hinh': '10.9 inch Liquid Retina', 'Ket noi': 'WiFi' }, short_description: 'iPad Gen 10 gia re nhat dong iPad moi.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 5 },
  { name: 'iPad Gen 9 64GB WiFi', slug: 'ipad-gen-9-64gb-wifi', cat: 'ipad', brand: 'Apple', price_min: 5990000, price_max: 5990000, specs: { 'Chip': 'A13 Bionic', 'Bo nho': '64GB', 'Man hinh': '10.2 inch Retina', 'Ket noi': 'WiFi' }, short_description: 'iPad Gen 9 gia hoc sinh, sinh vien.', condition_note: 'No Box', is_featured: false, sort_order: 6 },
  { name: 'iPad Mini 7 A17 Pro 128GB WiFi', slug: 'ipad-mini-7-a17-128gb-wifi', cat: 'ipad', brand: 'Apple', price_min: 12490000, price_max: 12490000, specs: { 'Chip': 'A17 Pro', 'Bo nho': '128GB', 'Man hinh': '8.3 inch Liquid Retina', 'Ket noi': 'WiFi' }, short_description: 'iPad Mini 7 nho gon, chip manh me.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 7 },
  // MacBook
  { name: 'MacBook Air M3 13 inch 256GB', slug: 'macbook-air-m3-13-256gb', cat: 'macbook', brand: 'Apple', price_min: 24990000, price_max: 24990000, specs: { 'Chip': 'M3', 'RAM': '8GB', 'SSD': '256GB', 'Man hinh': '13.6 inch Liquid Retina' }, short_description: 'MacBook Air M3 mong nhe, hieu nang manh me.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 10 },
  { name: 'MacBook Air M2 13 inch 256GB', slug: 'macbook-air-m2-13-256gb', cat: 'macbook', brand: 'Apple', price_min: 19990000, price_max: 19990000, specs: { 'Chip': 'M2', 'RAM': '8GB', 'SSD': '256GB', 'Man hinh': '13.6 inch Liquid Retina' }, short_description: 'MacBook Air M2 thiet ke moi, gia tot.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 11 },
  { name: 'MacBook Air M1 13 inch 256GB', slug: 'macbook-air-m1-13-256gb', cat: 'macbook', brand: 'Apple', price_min: 14990000, price_max: 14990000, specs: { 'Chip': 'M1', 'RAM': '8GB', 'SSD': '256GB', 'Man hinh': '13.3 inch Retina' }, short_description: 'MacBook Air M1 gia tot nhat phan khuc.', condition_note: 'No Box', is_featured: false, sort_order: 12 },
  { name: 'MacBook Pro M3 Pro 14 inch 512GB', slug: 'macbook-pro-m3-pro-14-512gb', cat: 'macbook', brand: 'Apple', price_min: 42990000, price_max: 42990000, specs: { 'Chip': 'M3 Pro', 'RAM': '18GB', 'SSD': '512GB', 'Man hinh': '14.2 inch Liquid Retina XDR' }, short_description: 'MacBook Pro M3 Pro danh cho chuyen gia.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 13 },
  // Am thanh
  { name: 'AirPods Pro 2 USB-C', slug: 'airpods-pro-2-usb-c', cat: 'am-thanh', brand: 'Apple', price_min: 4990000, price_max: 4990000, specs: { 'Chip': 'H2', 'Chong on': 'Co (ANC)', 'Cong sac': 'USB-C' }, short_description: 'AirPods Pro 2 chong on chu dong.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 20 },
  { name: 'AirPods 4 ANC', slug: 'airpods-4-anc', cat: 'am-thanh', brand: 'Apple', price_min: 4290000, price_max: 4290000, specs: { 'Chip': 'H2', 'Chong on': 'Co (ANC)', 'Cong sac': 'USB-C' }, short_description: 'AirPods 4 thiet ke moi voi chong on.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 21 },
  { name: 'AirPods Max USB-C', slug: 'airpods-max-usb-c', cat: 'am-thanh', brand: 'Apple', price_min: 11990000, price_max: 11990000, specs: { 'Chip': 'H2', 'Chong on': 'ANC cao cap', 'Cong sac': 'USB-C' }, short_description: 'AirPods Max chat am cao cap nhat cua Apple.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 22 },
  // Phu kien
  { name: 'Apple Pencil Pro', slug: 'apple-pencil-pro', cat: 'but-cam-ung', brand: 'Apple', price_min: 2890000, price_max: 2890000, specs: { 'Tuong thich': 'iPad Pro M4, iPad Air M2+', 'Squeeze gesture': 'Co' }, short_description: 'Apple Pencil Pro cao cap nhat.', condition_note: 'Nguyen Seal', is_featured: true, sort_order: 30 },
  { name: 'Magic Mouse', slug: 'magic-mouse', cat: 'phu-kien-apple', brand: 'Apple', price_min: 1790000, price_max: 1790000, specs: { 'Ket noi': 'Bluetooth', 'Sac': 'Lightning' }, short_description: 'Magic Mouse Apple chinh hang.', condition_note: 'Nguyen Seal', is_featured: false, sort_order: 31 },
  { name: 'Hub USB-C 7in1 Ugreen', slug: 'hub-usb-c-7in1-ugreen', cat: 'phu-kien-khac', brand: 'Ugreen', price_min: 690000, price_max: 690000, specs: { 'Cong': 'HDMI, USB-A x2, USB-C, SD, MicroSD, PD 100W' }, short_description: 'Hub USB-C 7in1 da nang.', condition_note: 'Nguyen Seal', is_featured: false, sort_order: 40 },
]

// ============================================================
// 3. BLOG POSTS
// ============================================================
const posts = [
  { title: 'iPad Air 7 M3 co gi moi? Danh gia chi tiet', slug: 'ipad-air-7-m3-co-gi-moi', excerpt: 'Tim hieu nhung nang cap moi tren iPad Air 7 voi chip M3 va man hinh 11 inch.', category: 'ipad', status: 'published', is_featured: true, content: '<p>iPad Air 7 la phien ban moi nhat trong dong iPad Air voi chip M3 manh me. Bai viet nay se danh gia chi tiet ve hieu nang, thiet ke va trai nghiem su dung.</p>' },
  { title: 'So sanh MacBook Air M3 vs M2 — Nen mua ban nao?', slug: 'so-sanh-macbook-air-m3-vs-m2', excerpt: 'Phan tich chi tiet su khac biet giua MacBook Air M3 va M2 de giup ban chon dung.', category: 'macbook', status: 'published', is_featured: true, content: '<p>MacBook Air M3 va M2 deu la nhung lua chon tuyet voi. Bai viet so sanh chi tiet ve hieu nang, pin va gia ca.</p>' },
  { title: 'Top 5 phu kien can thiet cho iPad 2025', slug: 'top-5-phu-kien-can-thiet-cho-ipad', excerpt: 'Nhung phu kien khong the thieu de tan dung toi da iPad cua ban.', category: 'phu-kien', status: 'published', is_featured: false, content: '<p>Tu but cam ung den bao da, day la 5 phu kien ban nen mua kem iPad de co trai nghiem tot nhat.</p>' },
  { title: 'AirPods Pro 2 vs AirPods 4 ANC — Chon tai nghe nao?', slug: 'airpods-pro-2-vs-airpods-4-anc', excerpt: 'So sanh 2 tai nghe chong on cua Apple de tim ra lua chon phu hop.', category: 'tin-tuc', status: 'published', is_featured: false, content: '<p>Ca hai deu co chong on ANC, nhung khac nhau ve thiet ke va gia ca. Cung tim hieu chi tiet.</p>' },
]

// ============================================================
// RUN SEED
// ============================================================
async function seed() {
  console.log('=== SEEDING SUPABASE ===\n')

  // 1. Seed categories
  console.log('1. Seeding categories...')
  const { data: cats, error: catErr } = await sb.from('web_catalog_categories').upsert(categories, { onConflict: 'slug' }).select('id, slug')
  if (catErr) { console.error('  ERROR:', catErr.message); return }
  console.log(`  Inserted/updated ${cats.length} categories`)

  // Build slug → id map
  const catMap = {}
  for (const c of cats) catMap[c.slug] = c.id

  // 2. Seed products
  console.log('\n2. Seeding catalog products...')
  let insertCount = 0
  for (const p of products) {
    const catId = catMap[p.cat]
    if (!catId) { console.log(`  SKIP ${p.name} — category "${p.cat}" not found`); continue }
    const row = {
      category_id: catId,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      images: [],
      thumbnail: null,
      short_description: p.short_description,
      description: '',
      price_min: p.price_min,
      price_max: p.price_max,
      specs: p.specs,
      condition_note: p.condition_note || '',
      is_featured: p.is_featured,
      is_active: true,
      sort_order: p.sort_order,
    }
    const { error } = await sb.from('web_catalog_products').upsert(row, { onConflict: 'slug' })
    if (error) { console.log(`  ERROR ${p.name}:`, error.message) } else { insertCount++ }
  }
  console.log(`  Inserted/updated ${insertCount} products`)

  // 3. Seed blog posts
  console.log('\n3. Seeding blog posts...')
  let postCount = 0
  for (const p of posts) {
    const row = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      status: p.status,
      is_featured: p.is_featured,
      author: 'POLY Store',
      published_at: new Date().toISOString(),
    }
    const { error } = await sb.from('web_posts').upsert(row, { onConflict: 'slug' })
    if (error) { console.log(`  ERROR ${p.title}:`, error.message) } else { postCount++ }
  }
  console.log(`  Inserted/updated ${postCount} posts`)

  console.log('\n=== SEED COMPLETE ===')
}

seed().catch(console.error)
