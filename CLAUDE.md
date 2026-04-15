# polysto-web

Public-facing storefront for POLY Store. Built with Next.js 16, React 19, Tailwind CSS v4, Supabase.

## Architecture
- **Storefront only** — no admin panel (admin is in polysto-app)
- **Supabase**: project `vtaudcllsgtksjiaiiqt` (shared with polysto-app POLY Website workspace)
- **Auth**: Supabase Auth for customer login/signup
- **Brand**: POLY Store, green #1f8f4e
- **Fonts**: Quicksand (headings), Inter (body)

## Commands
```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint
```

## Key Directories
- `src/app/(storefront)/` — All public routes
- `src/components/` — Storefront components (Header, Footer, ProductCard, etc.)
- `src/lib/` — Utilities (auth, cart, seo, format, supabase clients)
- `src/lib/actions/` — Server actions (auth, wishlist)

@AGENTS.md
