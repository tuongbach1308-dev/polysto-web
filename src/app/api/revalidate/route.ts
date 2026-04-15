import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Handle CORS preflight */
export async function OPTIONS() {
  return NextResponse.json(null, { headers: corsHeaders });
}

/**
 * POST /api/revalidate
 * Called by polysto-app admin after saving changes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths } = body as { secret?: string; paths?: string[] };

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401, headers: corsHeaders });
    }

    if (paths && paths.length > 0) {
      for (const path of paths) {
        revalidatePath(path);
      }
    } else {
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true, paths: paths || ["/"] }, { headers: corsHeaders });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
  }
}
