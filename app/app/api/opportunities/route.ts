import { NextRequest, NextResponse } from "next/server";
import { competitions } from "@/lib/demo-data";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase().trim();
  const category = searchParams.get("category");
  const fee = searchParams.get("fee");
  const mode = searchParams.get("mode");
  const results = competitions.filter((item) => {
    const queryMatch = !q || [item.title, item.organizer, item.category, item.discipline, item.summary].join(" ").toLowerCase().includes(q);
    return queryMatch && (!category || category === "Semua" || item.category === category) && (!fee || item.feeStatus === fee) && (!mode || item.mode === mode);
  });
  return NextResponse.json({ data: results, count: results.length, demo: true, notice: "Seluruh data yang tersedia merupakan contoh untuk demonstrasi." });
}
