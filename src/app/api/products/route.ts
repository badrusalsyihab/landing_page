import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/data";
import type { Product } from "@/lib/types";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const newProduct: Product = await request.json();
  const products = await getProducts();

  if (products.some((p) => p.id === newProduct.id)) {
    return NextResponse.json(
      { error: "ID produk sudah dipakai" },
      { status: 409 }
    );
  }

  const created = await createProduct(newProduct);
  return NextResponse.json(created, { status: 201 });
}
