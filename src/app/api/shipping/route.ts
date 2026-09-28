import { NextResponse } from "next/server";
import { getShippingOptions, saveShippingOptions } from "@/lib/data";

export async function GET() {
  const options = await getShippingOptions();
  return NextResponse.json(options);
}

export async function PUT(request: Request) {
  const options = await request.json();
  await saveShippingOptions(options);
  return NextResponse.json(options);
}
