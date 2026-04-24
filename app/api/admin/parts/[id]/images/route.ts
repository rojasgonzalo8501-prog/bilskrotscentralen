import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PER_PART = 20;
const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "admin") return null;
  return s;
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const part = await db.part.findUnique({
    where: { id },
    include: { _count: { select: { images: true } } },
  });
  if (!part) return NextResponse.json({ error: "Part not found" }, { status: 404 });
  if (part._count.images >= MAX_PER_PART) {
    return NextResponse.json({ error: `Max ${MAX_PER_PART} bilder per del` }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ingen fil" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Filen är för stor (max 10 MB)" }, { status: 400 });
  }
  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return NextResponse.json({ error: "Endast JPEG, PNG, WebP eller AVIF" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "parts", id);
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const relUrl = `/uploads/parts/${id}/${filename}`;
  const created = await db.partImage.create({
    data: {
      partId: id,
      url: relUrl,
      alt: part.name,
      sortOrder: part._count.images,
    },
  });

  return NextResponse.json({
    id: created.id,
    url: created.url,
    alt: created.alt,
    sortOrder: created.sortOrder,
  });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const imageId = req.nextUrl.searchParams.get("imageId");
  if (!imageId) return NextResponse.json({ error: "imageId required" }, { status: 400 });

  const img = await db.partImage.findUnique({ where: { id: imageId } });
  if (!img || img.partId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.partImage.delete({ where: { id: imageId } });

  if (img.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", img.url.replace(/^\//, ""));
    await unlink(filePath).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
