import { readFileSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "./ProductDetail";

type Product = {
  sku: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  priceCurrency: string;
  image: string;
  url: string;
  condition: string;
  mpn: string;
  inStock: boolean;
};

function loadProducts(): Product[] {
  const dataFile = path.join(process.cwd(), "data", "abildelar-products.json");
  const content = readFileSync(dataFile, "utf-8");
  return JSON.parse(content);
}

function getProduct(sku: string): Product | undefined {
  const products = loadProducts();
  return products.find((p) => p.sku === sku);
}

export async function generateStaticParams() {
  const products = loadProducts();
  return products.map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = getProduct(sku);
  if (!product) return { title: "Inte funnen" };

  return {
    title: `${product.name} — Bilskrotscentralen`,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = getProduct(sku);
  if (!product) notFound();

  const allProducts = loadProducts();
  const relatedProducts = allProducts
    .filter((p) => p.brand === product!.brand && p.sku !== product!.sku)
    .slice(0, 4);

  return (
    <ProductDetail product={product!} relatedProducts={relatedProducts} />
  );
}
