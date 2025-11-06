import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { secret, tags } = await request.json()

    // Verify secret to prevent unauthorized access
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
    }

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { message: "Tags array is required" },
        { status: 400 }
      )
    }

    // Revalidate each tag
    tags.forEach((tag: string) => {
      revalidateTag(tag)
    })

    return NextResponse.json({
      revalidated: true,
      tags,
      now: Date.now(),
    })
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}

