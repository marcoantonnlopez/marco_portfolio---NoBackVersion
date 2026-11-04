import { NextRequest, NextResponse } from "next/server";
import { CHAT_SYSTEM_PROMPT } from "@/lib/portfolio-knowledge";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

// Tried in order. The newest model is sometimes briefly overloaded (503
// "high demand") right after release, so we fall back to slightly older /
// lighter models instead of failing the whole request.
const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"];
const MAX_HISTORY_MESSAGES = 16; // keep requests small & fast
const MAX_MESSAGE_LENGTH = 1500;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured yet (missing GEMINI_API_KEY)." },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  // Basic sanitation: cap history length and per-message size to control cost/abuse.
  const trimmed = messages
    .slice(-MAX_HISTORY_MESSAGES)
    .filter((m) => m && (m.role === "user" || m.role === "model") && typeof m.text === "string")
    .map((m) => ({ role: m.role, text: m.text.slice(0, MAX_MESSAGE_LENGTH) }));

  if (trimmed.length === 0) {
    return NextResponse.json({ error: "No valid messages provided." }, { status: 400 });
  }

  const contents = trimmed.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  const requestBody = JSON.stringify({
    systemInstruction: {
      role: "system",
      parts: [{ text: CHAT_SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 500,
    },
  });

  let lastStatus = 0;
  let lastErrText = "";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      if (!res.ok) {
        lastStatus = res.status;
        lastErrText = await res.text();
        console.error(`Gemini API error (${model}):`, res.status, lastErrText);
        // 503 (overloaded) or 429 (rate limited) -> worth trying the next
        // model in the list; anything else, fail fast.
        if (res.status === 503 || res.status === 429) continue;
        break;
      }

      const data = await res.json();
      const reply: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        return NextResponse.json(
          { error: "The assistant couldn't generate a reply. Please try again." },
          { status: 502 }
        );
      }

      return NextResponse.json({ reply });
    } catch (err) {
      console.error(`Chat route error (${model}):`, err);
      lastStatus = 0;
      lastErrText = err instanceof Error ? err.message : String(err);
    }
  }

  console.error("All Gemini models failed:", lastStatus, lastErrText);
  return NextResponse.json(
    { error: "The assistant is temporarily unavailable. Please try again shortly." },
    { status: 502 }
  );
}
