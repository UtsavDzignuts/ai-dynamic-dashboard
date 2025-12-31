import { NextRequest, NextResponse } from "next/server";
import { interpretMultiplePrompts } from "@/lib/ai-interpreter";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    // Use multi-prompt interpreter to handle multiple datasets/components
    const interpretations = await interpretMultiplePrompts(prompt);
    return NextResponse.json(interpretations);
  } catch (error) {
    console.error("Interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to interpret prompt" },
      { status: 500 }
    );
  }
}
