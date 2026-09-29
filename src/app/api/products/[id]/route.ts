import { NextResponse } from "next/server";
import { updateProduct, deleteProduct, getProductById } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  const updated = await updateProduct(id, updates);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  await deleteProduct(id);
  return NextResponse.json({ success: true });
}
