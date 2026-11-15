import { NextResponse } from "next/server";
import { competitions } from "@/lib/demo-data";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = competitions.find((competition) => competition.slug === slug);
  if (!item) return NextResponse.json({ error: "Data lomba tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ data: item, demo: true, notice: "Data ini merupakan contoh untuk demonstrasi." });
}
