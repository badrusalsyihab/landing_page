import { NextResponse } from "next/server";
import { getHighlights, saveHighlights } from "@/lib/data";

export async function GET() {
  const items = await getHighlights();
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const items = await request.json();
  await saveHighlights(items);
  return NextResponse.json(items);
}
