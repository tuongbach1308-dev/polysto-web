import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 * Called by polysto-app admin after saving changes (settings, products, posts, etc.)
 *
 * Body: { secret: string, paths?: string[] }
 * - secret: must match REVALIDATE_SECRET env var
 * - paths: optional array of paths to revalidate (default: revalidate everything)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths } = body as { secret?: string; paths?: string[] };

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    if (paths && paths.length > 0) {
      for (const path of paths) {
        revalidatePath(path);
      }
    } else {
      // Revalidate all pages
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true, paths: paths || ["/"] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
