import { NextResponse } from "next/server";
import { getFaqItems, saveFaqItems } from "@/lib/data";

export async function GET() {
  const items = await getFaqItems();
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const items = await request.json();
  await saveFaqItems(items);
  return NextResponse.json(items);
}
