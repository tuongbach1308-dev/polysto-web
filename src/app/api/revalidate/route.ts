import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  // Support both header auth and body secret
  const headerSecret = request.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const body = await request.json()
    const secret = headerSecret || body.secret

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const paths = body.paths
    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: 'paths must be a non-empty array' }, { status: 400 })
    }

    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({ revalidated: true, paths, now: Date.now() })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
