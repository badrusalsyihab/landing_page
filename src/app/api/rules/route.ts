import { NextResponse } from "next/server";
import { getCodRules, saveCodRules } from "@/lib/data";

export async function GET() {
  const rules = await getCodRules();
  return NextResponse.json(rules);
}

export async function PUT(request: Request) {
  const rules: string[] = await request.json();
  await saveCodRules(rules);
  return NextResponse.json(rules);
}
