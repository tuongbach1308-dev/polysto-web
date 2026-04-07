import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat('vi-VN').format(price);
  return `${formatted} đ`;
}

export function getDiscountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Map product model/name to real Apple product image URLs.
 * Falls back to placehold.co if no match found.
 */
const APPLE_CDN = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is';

// Hình từ polystorevn.com (Google Photos) + Apple CDN
const GP = 'https://lh3.googleusercontent.com/pw';

const modelImageMap: Record<string, string> = {
  // iPad Pro — từ polystorevn.com
  'ipad pro m4 512gb':   `${GP}/AP1GczNUibj4_6TpdhtTZRgyNTnCKcB52CXvvc6fWPBTMLoGAAfpJed-jYM-hsjot8z3BviX4qTzQVxvJKEnX2j64SBAIayPUvfERQMk1iMLsMWCBTktn6M=w800`,
  'ipad pro m4 256gb wifi 13': `${GP}/AP1GczNUibj4_6TpdhtTZRgyNTnCKcB52CXvvc6fWPBTMLoGAAfpJed-jYM-hsjot8z3BviX4qTzQVxvJKEnX2j64SBAIayPUvfERQMk1iMLsMWCBTktn6M=w800`,
  'ipad pro m4 1tb':     `${GP}/AP1GczNUibj4_6TpdhtTZRgyNTnCKcB52CXvvc6fWPBTMLoGAAfpJed-jYM-hsjot8z3BviX4qTzQVxvJKEnX2j64SBAIayPUvfERQMk1iMLsMWCBTktn6M=w800`,
  'ipad pro m4':         `${GP}/AP1GczPYIPaJGpMPPhBs_hskGq3NoX9kq4UNXkH2tNs0At08W2CcGTLwyJO-uCOd9FZOD_5M8dK-sHThWKspoogZ14IvVvWlkF4NqtEC6XR11fkx-BbxPXI=w800`,
  'ipad pro m2 128gb':   `${GP}/AP1GczN7xuWGB-Id6VWkz3tFGjHSNjTkpdJtrQLHUAdo6w-QCTzfzFwZx40JsSCQpSEnkBpPC6nh_tIL1r6aR0PkVVyvYAO1K_HpJtdI0-1zZWp4CjeqhIc=w800`,
  'ipad pro m2':         `${GP}/AP1GczObRTuOkAebYd6_1V9dTkVxNb9NozabFpjPFnbt_oHnS1afa5Vu2UJWxSd4fxRMtuOzvm77GX8wn3Wtj2jSAqKhLBU_bhaco8oMiTrvFfx1ujLff2Q=w800`,
  'ipad pro m1':         `${GP}/AP1GczMcxoFIbNIj5yCvVgMWXJBKmM4o9g9Oa2vSecQulYGpVbgpqPFEiiVQ4mhnpgukD0Pgsh8JWUd8wfikZz02zCsXWezk5rGSmdKEnLHUgPmkSpVhLBY=w800`,
  // iPad Air — từ polystorevn.com
  'ipad air 7':  `${GP}/AP1GczOOl6K-zbixnq5tK_j92EnRKHk7oe9-RwGcqUuALZBnK4-0wdisWfx0QM8vtYlhJQKJ9wMHVGlVn5jS76qdds0951BG-nlLvw_SCKhtjnHL_ezD5xk=w800`,
  'ipad air 6':  `${GP}/AP1GczOOl6K-zbixnq5tK_j92EnRKHk7oe9-RwGcqUuALZBnK4-0wdisWfx0QM8vtYlhJQKJ9wMHVGlVn5jS76qdds0951BG-nlLvw_SCKhtjnHL_ezD5xk=w800`,
  'ipad air 5':  `${GP}/AP1GczMHqAVCZURub2Gf6IMnDIiUx02IStYwR17L7YbP8jGizyGrKG1I90nKdzCYz7Gw6xO7i5hHrr1kvnwt-kEOGk96iUCLt9tnSuqk8SWEyRYW7sRlLy8=w800`,
  'ipad air 4':  `${GP}/AP1GczMHqAVCZURub2Gf6IMnDIiUx02IStYwR17L7YbP8jGizyGrKG1I90nKdzCYz7Gw6xO7i5hHrr1kvnwt-kEOGk96iUCLt9tnSuqk8SWEyRYW7sRlLy8=w800`,
  // iPad Gen — từ polystorevn.com
  'ipad gen 11': `${GP}/AP1GczP15PFbSMgGRGqaF5kR5cBxb4tFtV1lpSVOF3PTXbNSLgKgojIZ-D_YA9V3GsRcInlfHibUo36h6cLkibRUr8Ogq5GpF-qDgFTIv-xgTCyfKrQMObs=w800`,
  'ipad gen 10': `${GP}/AP1GczP15PFbSMgGRGqaF5kR5cBxb4tFtV1lpSVOF3PTXbNSLgKgojIZ-D_YA9V3GsRcInlfHibUo36h6cLkibRUr8Ogq5GpF-qDgFTIv-xgTCyfKrQMObs=w800`,
  'ipad gen 9':  `${GP}/AP1GczPwHBdy71_8PK3XslgYZwQHSWDGkdN8Idhr0hh_O0gF4U1ch565e7dNmMzGwdMP4vUPpzaCzxqSiJ6gzmsJ8yu5tJ5BmlNsnVOXpxrKwqFGFparmdA=w800`,
  // iPad Mini — từ polystorevn.com
  'ipad mini 7': `${GP}/AP1GczM0e0Z_mbpnGJ3-MSw5lijmY3Jxz-szJA4kp9ZL6CyzwZ4pH0V6gPcvn5Bz4MQTNnlTR49CWftQ49dBipa9pKgd8mWDQ0nM8gRuCOgNpL1cLqzOAXU=w800`,
  'ipad mini 6': `${GP}/AP1GczM0e0Z_mbpnGJ3-MSw5lijmY3Jxz-szJA4kp9ZL6CyzwZ4pH0V6gPcvn5Bz4MQTNnlTR49CWftQ49dBipa9pKgd8mWDQ0nM8gRuCOgNpL1cLqzOAXU=w800`,
  // MacBook Air — từ polystorevn.com
  'macbook air m4': `${GP}/AP1GczMwpouDLlY0h-5RapPyUNo9_ow_gHEU-TTS_4yTz-hmJKlJvniBCtBizxdKfQKyM-qdYmsDVhXbhaKRuCj29USgu3SpgZrPxGoHBYYSdWmpZIbdeyw=w800`,
  'macbook air m3': `${GP}/AP1GczMwpouDLlY0h-5RapPyUNo9_ow_gHEU-TTS_4yTz-hmJKlJvniBCtBizxdKfQKyM-qdYmsDVhXbhaKRuCj29USgu3SpgZrPxGoHBYYSdWmpZIbdeyw=w800`,
  'macbook air m2': `${GP}/AP1GczNbC8dgzMAzY0eUYyW6eWZPvvbuw2QL1Rs_b3STIB28oQoc8hRJlN_F_HFvJyDu8bXT9AO63_bW81o6y_C89VdkYJ7w_ay6evOWuCNNxSRSgQtRbR4=w800`,
  'macbook air m1': `${GP}/AP1GczNbC8dgzMAzY0eUYyW6eWZPvvbuw2QL1Rs_b3STIB28oQoc8hRJlN_F_HFvJyDu8bXT9AO63_bW81o6y_C89VdkYJ7w_ay6evOWuCNNxSRSgQtRbR4=w800`,
  // MacBook Pro — từ polystorevn.com
  'macbook pro m4 max': `${GP}/AP1GczPZXHk4h7WMmdGg1L4zrSb0hV9dHeR3emdlLi4HqF8wrTuPlk1CC2PywWWk-zsAE0Ia5tE70qzRYHEwE7KFvnTVP0t30Kti0JSJXc3RyNF2ScGg46A=w800`,
  'macbook pro m4 pro': `${GP}/AP1GczPZXHk4h7WMmdGg1L4zrSb0hV9dHeR3emdlLi4HqF8wrTuPlk1CC2PywWWk-zsAE0Ia5tE70qzRYHEwE7KFvnTVP0t30Kti0JSJXc3RyNF2ScGg46A=w800`,
  'macbook pro m4':     `${GP}/AP1GczPZXHk4h7WMmdGg1L4zrSb0hV9dHeR3emdlLi4HqF8wrTuPlk1CC2PywWWk-zsAE0Ia5tE70qzRYHEwE7KFvnTVP0t30Kti0JSJXc3RyNF2ScGg46A=w800`,
  'macbook pro m3 pro': `${GP}/AP1GczPZXHk4h7WMmdGg1L4zrSb0hV9dHeR3emdlLi4HqF8wrTuPlk1CC2PywWWk-zsAE0Ia5tE70qzRYHEwE7KFvnTVP0t30Kti0JSJXc3RyNF2ScGg46A=w800`,
  'macbook pro m3':     `${GP}/AP1GczPZXHk4h7WMmdGg1L4zrSb0hV9dHeR3emdlLi4HqF8wrTuPlk1CC2PywWWk-zsAE0Ia5tE70qzRYHEwE7KFvnTVP0t30Kti0JSJXc3RyNF2ScGg46A=w800`,
  'macbook pro m2 pro': `${GP}/AP1GczPZXHk4h7WMmdGg1L4zrSb0hV9dHeR3emdlLi4HqF8wrTuPlk1CC2PywWWk-zsAE0Ia5tE70qzRYHEwE7KFvnTVP0t30Kti0JSJXc3RyNF2ScGg46A=w800`,
  // AirPods — Apple CDN
  'airpods pro 2':  `${APPLE_CDN}/airpods-pro-2-hero-select-202409?wid=800&hei=800&fmt=png&qlt=90`,
  'airpods 4':      `${APPLE_CDN}/airpods-4-hero-select-202409?wid=800&hei=800&fmt=png&qlt=90`,
  'airpods 3':      `${APPLE_CDN}/MME73?wid=800&hei=800&fmt=png&qlt=90`,
  'airpods 2':      `${APPLE_CDN}/airpods-2nd-gen-hero-202109?wid=800&hei=800&fmt=png&qlt=90`,
  'airpods max':    `${APPLE_CDN}/airpods-max-hero-select-202409-midnight?wid=800&hei=800&fmt=png&qlt=90`,
  // Apple Pencil — Apple CDN
  'apple pencil pro':   `${APPLE_CDN}/apple-pencil-pro-hero-202405?wid=800&hei=800&fmt=png&qlt=90`,
  'apple pencil usb':   `${APPLE_CDN}/apple-pencil-usbc-hero-202310?wid=800&hei=800&fmt=png&qlt=90`,
  'apple pencil gen 2': `${APPLE_CDN}/MU8F2?wid=800&hei=800&fmt=png&qlt=90`,
  'apple pencil gen 1': `${APPLE_CDN}/apple-pencil-1st-gen-202209?wid=800&hei=800&fmt=png&qlt=90`,
  // Accessories — Apple CDN + polystorevn
  'magic mouse':    `${APPLE_CDN}/MK2C3?wid=800&hei=800&fmt=png&qlt=90`,
  'magic keyboard': `${APPLE_CDN}/MJQJ3?wid=800&hei=800&fmt=png&qlt=90`,
  'magic trackpad': `${APPLE_CDN}/MK2C3?wid=800&hei=800&fmt=png&qlt=90`,
  'sac apple 20w':  `${APPLE_CDN}/MHJA3?wid=800&hei=800&fmt=png&qlt=90`,
  'sac apple 35w':  `${APPLE_CDN}/MNWP3?wid=800&hei=800&fmt=png&qlt=90`,
  'sac apple 140w': `${APPLE_CDN}/MLYU3?wid=800&hei=800&fmt=png&qlt=90`,
  // Bút cảm ứng khác — polystorevn phụ kiện
  'goojodoq':       `${GP}/AP1GczM42ZdN0InEBURmilv50hfQEJWd8CJZPfbKhXCK4sz5G7x9gS6ZVGoGIKXJsyqdSP3dc5lCp4rWFbOkpgkjs-33Wck80op3q5-mCi4CrNuHEUEDpUc=w800`,
  'baseus':         `${GP}/AP1GczM42ZdN0InEBURmilv50hfQEJWd8CJZPfbKhXCK4sz5G7x9gS6ZVGoGIKXJsyqdSP3dc5lCp4rWFbOkpgkjs-33Wck80op3q5-mCi4CrNuHEUEDpUc=w800`,
};

// Fallback images per category — từ polystorevn.com
const categoryFallback: Record<string, string> = {
  'ipad':           `${GP}/AP1GczPwHBdy71_8PK3XslgYZwQHSWDGkdN8Idhr0hh_O0gF4U1ch565e7dNmMzGwdMP4vUPpzaCzxqSiJ6gzmsJ8yu5tJ5BmlNsnVOXpxrKwqFGFparmdA=w800`,
  'macbook':        `${GP}/AP1GczMwpouDLlY0h-5RapPyUNo9_ow_gHEU-TTS_4yTz-hmJKlJvniBCtBizxdKfQKyM-qdYmsDVhXbhaKRuCj29USgu3SpgZrPxGoHBYYSdWmpZIbdeyw=w800`,
  'am-thanh':       `${APPLE_CDN}/airpods-pro-2-hero-select-202409?wid=800&hei=800&fmt=png&qlt=90`,
  'phu-kien-apple': `${GP}/AP1GczM42ZdN0InEBURmilv50hfQEJWd8CJZPfbKhXCK4sz5G7x9gS6ZVGoGIKXJsyqdSP3dc5lCp4rWFbOkpgkjs-33Wck80op3q5-mCi4CrNuHEUEDpUc=w800`,
  'phu-kien-ipad':  `${GP}/AP1GczM42ZdN0InEBURmilv50hfQEJWd8CJZPfbKhXCK4sz5G7x9gS6ZVGoGIKXJsyqdSP3dc5lCp4rWFbOkpgkjs-33Wck80op3q5-mCi4CrNuHEUEDpUc=w800`,
  'but-cam-ung':    `${APPLE_CDN}/apple-pencil-pro-hero-202405?wid=800&hei=800&fmt=png&qlt=90`,
  'phu-kien-khac':  `${GP}/AP1GczM42ZdN0InEBURmilv50hfQEJWd8CJZPfbKhXCK4sz5G7x9gS6ZVGoGIKXJsyqdSP3dc5lCp4rWFbOkpgkjs-33Wck80op3q5-mCi4CrNuHEUEDpUc=w800`,
};

export function getProductImageUrl(category: string, name: string, _size = 600): string {
  const lower = name.toLowerCase();

  // Try to find a match by checking if the product name contains a known key
  for (const [key, url] of Object.entries(modelImageMap)) {
    if (lower.includes(key)) return url;
  }

  // Fallback to category image
  if (categoryFallback[category]) return categoryFallback[category];

  // Last resort: placehold.co
  const short = name.length > 25 ? name.slice(0, 25) + '...' : name;
  return `https://placehold.co/600x600/F5F5F5/999?text=${encodeURIComponent(short)}&font=roboto`;
}

/** Fallback URL when an image fails to load */
export function getProductImageFallback(category: string, name: string): string {
  const short = name.length > 25 ? name.slice(0, 25) + '...' : name;
  const colors: Record<string, { bg: string; fg: string }> = {
    'ipad': { bg: 'E8EFF5', fg: '3B82F6' },
    'macbook': { bg: 'F0F0F0', fg: '6B7280' },
    'am-thanh': { bg: 'F3E8FF', fg: '8B5CF6' },
    'phu-kien-apple': { bg: 'ECFDF5', fg: '10B981' },
    'phu-kien-ipad': { bg: 'FFF7ED', fg: 'F59E0B' },
    'but-cam-ung': { bg: 'FFF1F2', fg: 'EF4444' },
    'phu-kien-khac': { bg: 'F0F9FF', fg: '0EA5E9' },
  };
  const c = colors[category] || { bg: 'F5F5F5', fg: '999999' };
  return `https://placehold.co/600x600/${c.bg}/${c.fg}?text=${encodeURIComponent(short)}&font=roboto`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
