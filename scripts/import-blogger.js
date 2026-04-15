/**
 * Import Blogger feed.atom → Supabase (polysto-web)
 *
 * Products (tag san-pham, excluding thanhly):
 *   → products, product_variants, product_images, product_categories
 *
 * Blog posts (no tag san-pham, type POST, status LIVE):
 *   → posts, post_post_categories
 *
 * Also outputs redirect map for SEO (old Blogger URL → new polysto-web URL)
 *
 * Usage: node scripts/import-blogger.js
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// ── Config ──
const FEED_PATH = path.resolve('C:/Users/AERO 16 XE4/Desktop/takeout/Blogger/Blogs/POLY Store - iPhone, iPad, Macbook và các sản phẩm/feed.atom');
const DB_URL = "postgresql://postgres:Tuongbach130897'@db.vtaudcllsgtksjiaiiqt.supabase.co:5432/postgres";

// ── Tag → Category mapping (Blogger tag → Supabase category slug) ──
const PRODUCT_TAG_MAP = {
  'iPhone': 'iphone',
  'iPhone-11-series': 'iphone',
  'iPhone-12-series': 'iphone',
  'iPhone-13-series': 'iphone',
  'iPhone-14-series': 'iphone',
  'iPhone-15-series': 'iphone',
  'iPhone-16-series': 'iphone',
  'iPhone-17-series': 'iphone',
  'ipad': 'ipad',
  'ipad-pro': 'ipad-pro',
  'ipad-pro-11': 'ipad-pro',
  'ipad-pro-12-9': 'ipad-pro',
  'ipad-pro-m2-2022': 'ipad-pro',
  'ipad-air': 'ipad-air',
  'ipad-gen': 'ipad-gen',
  'ipad-mini': 'ipad-mini',
  'macbook': 'macbook',
  'macbook-air': 'macbook-air',
  'phu-kien': 'phu-kien',
  'phu-kien-ipad': 'phu-kien',
  'phu-kien-iphone': 'phu-kien',
  'pencil': 'apple-pencil',
  'day-sac': 'sac-cap',
  'coc-sac': 'sac-cap',
  'ban-phim': 'magic-keyboard',
};

// Condition mapping
const CONDITION_MAP = {
  'Likenew': 'likenew',
  'Like New': 'likenew',
  'likenew': 'likenew',
  'Seal': 'seal',
  'seal': 'seal',
  'Nguyên Seal': 'seal',
  'Open Box': 'openbox',
  'openbox': 'openbox',
  'New Nobox': 'new_nobox',
  'Cũ': 'old',
};

// ── Helpers ──

function toSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'");
}

function extractTag(html, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractFirstImage(html) {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return m ? m[1] : null;
}

// Extract content before custom tags (the actual product description)
function extractProductContent(html) {
  // Content is everything before the first custom tag
  const customTags = ['<giacu>', '<giaban>', '<thuonghieu>', '<daban>', '<km>', '<mota>', '<thongso>', '<cate>', '<dungluong>', '<tinhtrang>', '<loaisp>', '<tag>'];
  let cutoff = html.length;
  for (const tag of customTags) {
    const idx = html.indexOf(tag);
    if (idx !== -1 && idx < cutoff) cutoff = idx;
  }
  return html.slice(0, cutoff).trim();
}

// Parse specs table
function parseSpecs(html) {
  const thongso = extractTag(html, 'thongso');
  if (!thongso) return {};
  const specs = {};
  const rows = [...thongso.matchAll(/<tr>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>\s*<\/tr>/g)];
  for (const row of rows) {
    specs[row[1].trim()] = row[2].trim();
  }
  return specs;
}

// Parse variants from <dungluong> and <link rel='enclosure' href='http://tuychon.post'>
function parseVariants(html, enclosureLinks) {
  const variants = [];
  const tuychon = enclosureLinks.find(l => l.includes('tuychon.post'));
  if (tuychon) {
    // type field contains the variant options as JSON-like string
    // e.g. { "128GB (9.490.000đ)", "256GB (10.490.000đ)" }
    const optMatch = tuychon.match(/type='\{([^}]+)\}'/);
    if (optMatch) {
      const opts = optMatch[1].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      for (const opt of opts) {
        // Parse "128GB (9.490.000đ)" → name: "128GB", price: 9490000
        const m = opt.match(/^(.+?)\s*\(([0-9.]+)đ?\)$/);
        if (m) {
          const name = m[1].trim();
          const price = parseInt(m[2].replace(/\./g, ''), 10);
          variants.push({ name, price: isNaN(price) ? 0 : price });
        } else {
          variants.push({ name: opt.trim(), price: 0 });
        }
      }
    }
  }
  return variants;
}

// Parse colors from <link rel='enclosure' href='http://mau.post'>
function parseColors(enclosureLinks) {
  const mau = enclosureLinks.find(l => l.includes('mau.post'));
  if (!mau) return [];
  const m = mau.match(/type='\{([^}]+)\}'/);
  if (!m) return [];
  return m[1].split(',').map(s => s.trim().replace(/^"|"$/g, '').trim()).filter(Boolean);
}

// Parse product images from enclosure links (type image/*)
function parseImages(enclosureLinks) {
  return enclosureLinks
    .filter(l => l.includes("type='image/"))
    .map(l => {
      const m = l.match(/href='([^']+)'/);
      return m ? m[1] : null;
    })
    .filter(Boolean);
}

// ── Parse Feed ──
function parseEntries(xml) {
  const entries = [];
  const entryBlocks = xml.split('<entry>').slice(1);

  for (const block of entryBlocks) {
    const endIdx = block.indexOf('</entry>');
    if (endIdx === -1) continue;
    const entry = block.slice(0, endIdx);

    // Type and status
    const type = (entry.match(/<blogger:type>(\w+)</) || [])[1];
    const status = (entry.match(/<blogger:status>(\w+)</) || [])[1];
    if (type !== 'POST' || status !== 'LIVE') continue;

    // Title
    const title = (entry.match(/<title>([^<]*)</) || [])[1] || '';

    // Content
    const contentMatch = entry.match(/<content type='html'>([\s\S]*?)<\/content>/);
    const rawContent = contentMatch ? contentMatch[1] : '';
    const html = decodeHtmlEntities(rawContent);

    // Tags
    const tags = [...entry.matchAll(/term='([^']+)'/g)].map(m => m[1]);

    // Published date
    const published = (entry.match(/<published>([^<]+)</) || [])[1] || new Date().toISOString();
    const updated = (entry.match(/<updated>([^<]+)</) || [])[1] || published;

    // Blogger filename (for redirect map)
    const filename = (entry.match(/<blogger:filename>([^<]+)</) || [])[1] || '';

    // Enclosure links (images, colors, variants)
    const enclosureLinks = [...entry.matchAll(/<link rel='enclosure'[^/]*\/>/g)].map(m => m[0]);

    // Meta description
    const metaDesc = (entry.match(/<blogger:metaDescription>([^<]*)</) || [])[1] || '';

    entries.push({ title, html, tags, published, updated, filename, enclosureLinks, metaDesc });
  }

  return entries;
}

// ── Main ──
async function main() {
  console.log('Reading feed.atom...');
  const xml = fs.readFileSync(FEED_PATH, 'utf8');
  const entries = parseEntries(xml);
  console.log(`Parsed ${entries.length} LIVE POST entries`);

  // Separate products vs blog posts
  const productEntries = entries.filter(e => e.tags.includes('san-pham') && !e.tags.includes('thanhly'));
  const blogEntries = entries.filter(e => !e.tags.includes('san-pham'));
  console.log(`Products: ${productEntries.length} | Blog posts: ${blogEntries.length}`);

  // Connect to DB
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to Supabase');

  // Load category slugs → IDs
  const { rows: catRows } = await client.query('SELECT id, slug FROM categories');
  const catMap = {};
  for (const r of catRows) catMap[r.slug] = r.id;

  const { rows: postCatRows } = await client.query('SELECT id, slug FROM post_categories');
  const postCatMap = {};
  for (const r of postCatRows) postCatMap[r.slug] = r.id;

  // Load brand
  const { rows: brandRows } = await client.query("SELECT id FROM brands WHERE slug = 'apple'");
  const appleBrandId = brandRows[0]?.id;

  // We need iPhone category — create if not exists
  if (!catMap['iphone']) {
    const appleId = catMap['apple'];
    const { rows } = await client.query(
      "INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES ('iPhone', 'iphone', 'Dòng iPhone chính hãng', $1, 5, true) RETURNING id",
      [appleId]
    );
    catMap['iphone'] = rows[0].id;
    console.log('Created iPhone category');
  }

  // Redirect map
  const redirects = [];

  // ═══ IMPORT PRODUCTS ═══
  console.log('\n--- Importing Products ---');
  let prodCount = 0;
  let skipCount = 0;

  for (const entry of productEntries) {
    const slug = toSlug(entry.title);

    // Check duplicate
    const { rows: existing } = await client.query('SELECT id FROM products WHERE slug = $1', [slug]);
    if (existing.length > 0) {
      skipCount++;
      continue;
    }

    // Parse product fields
    const giaCu = parseInt((extractTag(entry.html, 'giacu') || '0').replace(/\D/g, ''), 10);
    const giaBan = parseInt((extractTag(entry.html, 'giaban') || '0').replace(/\D/g, ''), 10);
    const thuonghieu = extractTag(entry.html, 'thuonghieu') || '';
    const tinhtrang = extractTag(entry.html, 'tinhtrang') || '';
    const condition = CONDITION_MAP[tinhtrang] || 'likenew';
    const km = extractTag(entry.html, 'km') || '';
    const mota = extractTag(entry.html, 'mota') || '';
    const specs = parseSpecs(entry.html);
    const content = extractProductContent(entry.html);
    const colors = parseColors(entry.enclosureLinks);
    const variants = parseVariants(entry.html, entry.enclosureLinks);
    const images = parseImages(entry.enclosureLinks);
    const thumbnail = images[0] || extractFirstImage(entry.html) || null;
    const description = stripHtml(mota || content).slice(0, 300);

    // Build box_info from km
    const boxInfo = km ? stripHtml(km) : null;

    // Insert product
    const { rows: prodRows } = await client.query(`
      INSERT INTO products (title, slug, description, content, price, original_price, brand_id,
        condition, status, is_featured, show_on_home, thumbnail, colors, specs, box_info,
        warranty_months, warranty_repair_months, meta_title, meta_description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', false, false, $9, $10, $11, $12, 12, 0, $13, $14, $15, $16)
      RETURNING id
    `, [
      entry.title, slug, description, content,
      giaBan || 0, giaCu || 0, appleBrandId,
      condition, thumbnail, colors.length > 0 ? colors : null,
      JSON.stringify(specs), boxInfo,
      entry.title + ' | POLY Store', description,
      entry.published, entry.updated,
    ]);
    const productId = prodRows[0].id;

    // Insert variants
    for (let i = 0; i < variants.length; i++) {
      await client.query(
        'INSERT INTO product_variants (product_id, name, price, original_price, sort_order) VALUES ($1, $2, $3, $4, $5)',
        [productId, variants[i].name, variants[i].price, 0, i]
      );
    }

    // Insert images
    for (let i = 0; i < images.length; i++) {
      await client.query(
        'INSERT INTO product_images (product_id, url, sort_order) VALUES ($1, $2, $3)',
        [productId, images[i], i]
      );
    }

    // Map tags → categories
    const mappedCatSlugs = new Set();
    for (const tag of entry.tags) {
      if (PRODUCT_TAG_MAP[tag] && catMap[PRODUCT_TAG_MAP[tag]]) {
        mappedCatSlugs.add(PRODUCT_TAG_MAP[tag]);
      }
    }
    for (const catSlug of mappedCatSlugs) {
      await client.query(
        'INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [productId, catMap[catSlug]]
      );
    }

    // Redirect: /2025/03/iphone-13-pro-likenew-99.html → /san-pham/iphone-13-pro-likenew-99
    if (entry.filename) {
      redirects.push({ source: entry.filename, destination: `/san-pham/${slug}` });
    }

    prodCount++;
  }
  console.log(`Imported ${prodCount} products (skipped ${skipCount} duplicates)`);

  // ═══ IMPORT BLOG POSTS ═══
  console.log('\n--- Importing Blog Posts ---');
  let postCount = 0;
  let postSkipCount = 0;

  // Default post category
  const defaultPostCatId = postCatMap['tin-cong-nghe'] || postCatMap['goc-cong-nghe'];

  for (const entry of blogEntries) {
    const slug = toSlug(entry.title);
    if (!slug) { postSkipCount++; continue; }

    // Check duplicate
    const { rows: existing } = await client.query('SELECT id FROM posts WHERE slug = $1', [slug]);
    if (existing.length > 0) { postSkipCount++; continue; }

    const thumbnail = extractFirstImage(entry.html) || null;
    const excerpt = stripHtml(entry.html).slice(0, 300);
    const content = entry.html;

    // Determine post category from tags
    let postCatId = defaultPostCatId;
    if (entry.tags.includes('meo-hay') || entry.tags.includes('thu-thuat')) {
      postCatId = postCatMap['thu-thuat'] || defaultPostCatId;
    } else if (entry.tags.includes('khuyen-mai') || entry.tags.includes('san-pham-khuyen-mai')) {
      postCatId = postCatMap['khuyen-mai'] || defaultPostCatId;
    }

    // Estimate reading time (Vietnamese ~200 words/min)
    const wordCount = stripHtml(entry.html).split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    const { rows: postRows } = await client.query(`
      INSERT INTO posts (title, slug, content, excerpt, thumbnail, author, status,
        view_count, reading_time, meta_title, meta_description, is_featured, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'POLY Store', 'published', 0, $6, $7, $8, false, $9, $10)
      RETURNING id
    `, [
      entry.title, slug, content, excerpt, thumbnail,
      readingTime, entry.title + ' | POLY Store', excerpt,
      entry.published, entry.updated,
    ]);
    const postId = postRows[0].id;

    // Link to post category
    if (postCatId) {
      await client.query(
        'INSERT INTO post_post_categories (post_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [postId, postCatId]
      );
    }

    // Collect tags as post tags array
    const postTags = entry.tags.filter(t => t !== 'tin-tuc' && t !== 'san-pham');
    if (postTags.length > 0) {
      await client.query('UPDATE posts SET tags = $1 WHERE id = $2', [postTags, postId]);
    }

    // Redirect
    if (entry.filename) {
      redirects.push({ source: entry.filename, destination: `/tin-tuc/${slug}` });
    }

    postCount++;
  }
  console.log(`Imported ${postCount} blog posts (skipped ${postSkipCount} duplicates)`);

  // ═══ SAVE REDIRECT MAP ═══
  const redirectsPath = path.resolve(__dirname, '../redirects.json');
  fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2));
  console.log(`\nSaved ${redirects.length} redirects to redirects.json`);

  // Summary
  const { rows: finalProducts } = await client.query('SELECT count(*) FROM products');
  const { rows: finalPosts } = await client.query('SELECT count(*) FROM posts');
  const { rows: finalVariants } = await client.query('SELECT count(*) FROM product_variants');
  const { rows: finalImages } = await client.query('SELECT count(*) FROM product_images');
  console.log('\n=== Final DB State ===');
  console.log('Products:', finalProducts[0].count);
  console.log('Variants:', finalVariants[0].count);
  console.log('Images:', finalImages[0].count);
  console.log('Posts:', finalPosts[0].count);

  await client.end();
  console.log('\nDone!');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
