import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/data";
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

  products.push(newProduct);
  await saveProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
