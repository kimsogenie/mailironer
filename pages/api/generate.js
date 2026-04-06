function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (nestedError) {
      return null;
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY가 설정되지 않았습니다. Vercel Environment Variables에 추가해 주세요.",
    });
  }

  const { draft, tone, situation } = req.body || {};

  if (!draft || !draft.trim()) {
    return res.status(400).json({ error: "초안이 비어 있습니다." });
  }

  const developerPrompt = [
    "너는 한국어 비즈니스 이메일을 정리하는 전문 에디터다.",
    "사용자가 거칠게 작성한 초안을 광고주/클라이언트에게 보낼 수 있는 자연스럽고 명확한 한국어 이메일로 다듬어라.",
    "결과는 반드시 JSON으로만 반환한다.",
    '{\"subject\":\"\", \"body\":\"\", \"summary\":\"\"}',
    "규칙:",
    "- 과도한 감정 표현 제거",
    "- 요청 사항과 맥락을 명확하게 정리",
    "- tone과 situation을 반영",
    "- body는 실제로 바로 보낼 수 있는 비즈니스 이메일 형식",
    "- summary는 한 줄로 짧게 작성",
    "- 설명 문장, 코드블록, 마크다운 금지",
  ].join("\n");

  const userPrompt = [
    `톤: ${tone}`,
    `상황: ${situation}`,
    "",
    "[초안]",
    draft,
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "developer", content: developerPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message || "OpenAI 요청 중 오류가 발생했습니다.";
      return res.status(response.status).json({ error: message });
    }

    const text = data?.choices?.[0]?.message?.content || "";
    const parsed = safeParseJson(text);

    if (!parsed) {
      return res.status(500).json({
        error: "AI 응답을 해석하지 못했습니다. 다시 시도해 주세요.",
      });
    }

    return res.status(200).json({
      subject: parsed.subject || "",
      body: parsed.body || "",
      summary: parsed.summary || "",
    });
  } catch (error) {
    return res.status(500).json({
      error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}
