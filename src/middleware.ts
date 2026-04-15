import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const internalUrl = process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const supabase = createServerClient(
    internalUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — important for keeping auth tokens fresh
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /tai-khoan routes — must be logged in
  if (request.nextUrl.pathname.startsWith("/tai-khoan")) {
    if (!user) {
      const loginUrl = new URL("/dang-nhap", request.url);
      loginUrl.searchParams.set("redirect", "/tai-khoan");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Maintenance mode check ──
  // Skip for API routes, static assets, and when service key is missing
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api") && !pathname.startsWith("/_next") && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const adminClient = createAdminClient(
        internalUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data: setting } = await adminClient
        .from("site_settings")
        .select("value")
        .eq("key", "disabled_pages")
        .single();

      if (setting?.value && Array.isArray(setting.value) && setting.value.length > 0) {
        const disabledPages: string[] = setting.value;
        const isDisabled = disabledPages.some((dp) =>
          dp === "/"
            ? pathname === "/"
            : pathname === dp || pathname.startsWith(dp + "/")
        );

        if (isDisabled) {
          return new NextResponse(maintenanceHtml(pathname), {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8", "Retry-After": "3600" },
          });
        }
      }
    } catch {
      // Maintenance check failed — allow request through
    }
  }

  return response;
}

function maintenanceHtml(path: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Đang bảo trì - POLY Store</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f9fafb;color:#374151}
    .c{text-align:center;padding:2rem;max-width:480px}
    .icon{font-size:3.5rem;margin-bottom:1rem}
    h1{font-size:1.5rem;font-weight:700;margin-bottom:.5rem;color:#111827}
    p{font-size:.95rem;color:#6b7280;line-height:1.6;margin-bottom:1.5rem}
    a{display:inline-block;padding:.625rem 1.5rem;background:#166534;color:#fff;border-radius:.5rem;text-decoration:none;font-size:.875rem;font-weight:500;transition:background .2s}
    a:hover{background:#14532d}
    .path{font-size:.75rem;color:#9ca3af;margin-top:1.5rem}
  </style>
</head>
<body>
  <div class="c">
    <div class="icon">🔧</div>
    <h1>Trang đang bảo trì</h1>
    <p>Chúng tôi đang cập nhật để mang đến trải nghiệm tốt hơn. Vui lòng quay lại sau.</p>
    <a href="/">← Về trang chủ</a>
    <div class="path">${path}</div>
  </div>
</body>
</html>`;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, logo.svg, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|logo\\.svg|categories/).*)",
  ],
};
