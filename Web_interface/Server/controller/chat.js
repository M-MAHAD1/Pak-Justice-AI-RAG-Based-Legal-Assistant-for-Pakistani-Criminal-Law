function normalizeUrl(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/\/+$/, "");
}

function getUpstreamChatUrl() {
  // Prefer env vars so the same code works for local + deploy.
  const envUrl =
    process.env.HF_CHAT_API_URL ||
    process.env.PAK_JUSTICE_AI_API_URL ||
    process.env.UPSTREAM_CHAT_API_URL;

  return normalizeUrl(envUrl) || "https://mmahad01-pak-justice-ai.hf.space/api/chat";
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function stringifyUpstreamError(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function extractAnswer(upstreamJson) {
  if (upstreamJson == null) return "";
  if (typeof upstreamJson === "string") return upstreamJson;

  // Common response keys across FastAPI / Spaces / custom APIs.
  const candidates = [
    upstreamJson.answer,
    upstreamJson.message,
    upstreamJson.response,
    upstreamJson.output,
    upstreamJson.result,
    upstreamJson.text,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }

  return "";
}

export const chat = async (req, res) => {
  try {
    // 🔥 CRITICAL FIX: Node.js ki default 120-second timeout ko disable kar diya
    if (req.setTimeout) req.setTimeout(0);
    if (res.setTimeout) res.setTimeout(0);

    const upstreamUrl = getUpstreamChatUrl();

    const body = req.body ?? {};
    const incomingMessages = Array.isArray(body.messages) ? body.messages : null;
    const prompt = typeof body.prompt === "string" ? body.prompt : "";

    const messages = incomingMessages?.length
      ? incomingMessages
      : prompt
        ? [{ role: "user", content: prompt }]
        : [];

    if (!messages.length) {
      return res.status(400).json({ message: "Provide 'messages' or 'prompt'" });
    }

    // Format data for FastAPI
    const currentQuery = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
    }));

    // 🔥 Timeout ko 10 Minutes (600,000 ms) set kar diya taake CPU araam se kaam kare
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600_000); 

    let upstreamResponse;
    try {
      upstreamResponse = await fetch(upstreamUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: currentQuery,
          history: history
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const upstreamText = await upstreamResponse.text().catch(() => "");
    const upstreamJson = safeJsonParse(upstreamText) ?? {};

    if (!upstreamResponse.ok) {
      const rawDetail = upstreamJson?.detail ?? upstreamJson?.message ?? upstreamJson?.error;
      const upstreamMessage =
        stringifyUpstreamError(rawDetail) ||
        (upstreamText && upstreamText.trim() ? upstreamText.trim().slice(0, 800) : "") ||
        `Upstream responded with ${upstreamResponse.status}`;
      return res.status(502).json({
        message: `Pak Justice AI request failed: ${upstreamMessage}`,
      });
    }

    // Jawab aur Source wapis React ko bhej dein
    return res.status(200).json({
      message: String(extractAnswer(upstreamJson) || "").trim(),
      source: upstreamJson?.source || null,
    });

  } catch (err) {
    const isAbort = err?.name === "AbortError";
    return res.status(isAbort ? 504 : 500).json({ 
        message: isAbort ? "Request timed out after 10 minutes." : "Chat failed to connect to upstream model." 
    });
  }
};