function extractJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    // 코드블록 안 JSON 추출
    const codeBlockMatch = text.match(/```json\s*([\s\S]*?)```/i);
    if (codeBlockMatch?.[1]) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch (nestedError) {}
    }

    // 첫 { ... } 구간 추출
    const match = text.match(/\{[\s\S]*\}/);
    if (match?.[0]) {
      try {
        return JSON.parse(match[0]);
      } catch (nestedError) {}
    }

    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";

  if (!apiKey) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY가 설정되지 않았습니다. Vercel Environment Variables에 추가해 주세요.",
    });
  }

  const { draft, tone, situation } = req.body || {};

  if (!draft || !draft.trim()) {
    return res.status(400).json({ error: "초안이 비어 있습니다." });
  }

  const systemPrompt = `
너는 한국어 비즈니스 이메일을 정리하는 전문 에디터다.
사용자가 거칠게 작성한 초안을 광고주/클라이언트에게 보낼 수 있는 자연스럽고 명확한 한국어 이메일로 다듬어라.
반드시 JSON만 출력하라.
설명 문장, 마크다운, 코드블록은 절대 출력하지 마라.

반환 형식:
{
  "subject": "메일 제목",
  "body": "메일 본문",
  "summary": "한 줄 요약"
}

규칙:
- 과도한 감정 표현 제거
- 요청 사항과 맥락을 명확하게 정리
- tone과 situation을 반영
- body는 실제로 바로 보낼 수 있는 비즈니스 이메일 형식
- summary는 짧고 명확한 한 줄
`.trim();

  const userPrompt = `
톤: ${tone}
상황: ${situation}

[초안]
${draft}
`.trim();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1200,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Claude raw response:", JSON.stringify(data));

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.message ||
        "Anthropic 요청 중 오류가 발생했습니다.";
      return res.status(response.status).json({ error: message });
    }

    const text =
      data?.content
        ?.filter((item) => item?.type === "text")
        ?.map((item) => item?.text || "")
        ?.join("\n") || "";

    console.log("Claude text:", text);

    const parsed = extractJson(text);

    if (!parsed) {
      return res.status(500).json({
        error: `AI 응답을 해석하지 못했습니다. 응답 원문: ${text.slice(0, 300)}`,
      });
    }

    return res.status(200).json({
      subject: parsed.subject || "",
      body: parsed.body || "",
      summary: parsed.summary || "",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: error?.message || "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
}
