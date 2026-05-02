import { NextResponse } from "next/server";
import { getRandomAnalysis } from "@/lib/mock-analysis";
import { DEFAULT_FILTERS, Filters, normalizeFilters } from "@/lib/filters";

export async function POST(request: Request) {
  // Имитация задержки AI-обработки (3-6 секунд)
  const delay = 3000 + Math.random() * 3000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  let filters: Filters = DEFAULT_FILTERS;
  try {
    const body = await request.json();
    if (body && body.filters) {
      filters = normalizeFilters({ ...DEFAULT_FILTERS, ...body.filters });
    }
  } catch {
    // тело пустое — используем дефолты
  }

  // TODO: Replace with real AI analysis (Claude API / OpenAI Vision)
  // const anthropic = new Anthropic();
  // const response = await anthropic.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 1024,
  //   messages: [{ role: "user", content: [
  //     { type: "image", source: { type: "base64", media_type: "image/png", data: base64Image } },
  //     { type: "text", text: `Проанализируй креатив с учётом параметров кампании: ${JSON.stringify(filters)}` }
  //   ]}]
  // });

  const result = getRandomAnalysis(filters);
  return NextResponse.json(result);
}
