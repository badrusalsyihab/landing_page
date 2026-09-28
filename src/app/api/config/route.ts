import { NextResponse } from "next/server";
import { getStoreConfig, saveStoreConfig } from "@/lib/data";

export async function GET() {
  const config = await getStoreConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await saveStoreConfig(body);
  return NextResponse.json(body);
}
