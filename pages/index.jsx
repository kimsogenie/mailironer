import { useMemo, useState } from "react";

const TONES = ["노멀", "정중하게", "매우 공손하게"];
const SITUATIONS = ["부탁", "재촉", "수정 요청", "일정 공유", "사과", "확인 요청"];

const DEFAULT_RESULT = {
  subject: "",
  body: "",
  summary: "",
};

export default function MailIronerApp() {
  const [activeTab, setActiveTab] = useState("iron");
  const [draft, setDraft] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [situation, setSituation] = useState(SITUATIONS[0]);
  const [result, setResult] = useState(DEFAULT_RESULT);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [copyState, setCopyState] = useState("");

  const [trashRecipients] = useState(["광고주님", "대행사 팀"]);
  const [trashSubject, setTrashSubject] = useState("");
  const [trashBody, setTrashBody] = useState("");
  const [trashResponse, setTrashResponse] = useState("");

  const isGenerateDisabled = useMemo(() => !draft.trim() || loading, [draft, loading]);

  async function handleGenerate() {
    if (!draft.trim()) {
      setFeedback("먼저 초안을 입력해 주세요.");
      return;
    }

    try {
      setLoading(true);
      setFeedback("다리는 중입니다...");
      setCopyState("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draft,
          tone,
          situation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "생성 중 오류가 발생했습니다.");
      }

      setResult({
        subject: data.subject || "",
        body: data.body || "",
        summary: data.summary || "",
      });
      setFeedback("깔끔하게 다려졌습니다.");
    } catch (error) {
      setFeedback(error.message || "생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    const text = `제목: ${result.subject}\n\n${result.body}\n\n한 줄 요약: ${result.summary}`;
    if (!result.subject && !result.body && !result.summary) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("복사 완료. 이제 보내도 안전합니다.");
    } catch (error) {
      setCopyState("복사에 실패했습니다. 다시 시도해 주세요.");
    }
  }

  function handleTrashSend() {
    const lines = [];
    if (trashBody.match(/말이 안|대체 왜|답답|최악|짜증|열받|어이없/i)) {
      lines.push("이 메일은 전송되지 않았습니다. 대신 평정심은 지켜졌습니다.");
      lines.push("직설적인 감정 표현이 많이 포함되어 있어요.");
    } else {
      lines.push("감정 배출 완료. 인간관계는 아직 무사합니다.");
    }

    lines.push("원하면 이 내용을 다리미 모드로 가져가 순화할 수 있어요.");
    setTrashResponse(lines.join(" "));
  }

  function moveTrashToIronMode() {
    const combined = [trashSubject ? `[제목 초안] ${trashSubject}` : "", trashBody].filter(Boolean).join("\n\n");
    setDraft(combined);
    setActiveTab("iron");
    setFeedback("감정 메모를 다리미 모드로 가져왔습니다.");
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-black/5 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-xl text-white shadow-sm">
                🧺
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">메일다리미</h1>
                <p className="text-sm text-neutral-500">보내기 전에, 한 번 다려보세요</p>
              </div>
            </div>

            <div className="hidden rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-500 md:block">
              하고 싶은 말 → 보낼 수 있는 말
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mb-4 flex w-full gap-2 rounded-2xl bg-neutral-200/70 p-1 sm:w-fit">
            <button
              onClick={() => setActiveTab("iron")}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                activeTab === "iron" ? "bg-white shadow-sm" : "text-neutral-500"
              }`}
            >
              다리미 모드
            </button>
            <button
              onClick={() => setActiveTab("trash")}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                activeTab === "trash" ? "bg-white shadow-sm" : "text-neutral-500"
              }`}
            >
              감정 쓰레기통
            </button>
          </div>

          {activeTab === "iron" ? (
            <>
              <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">하고 싶은 말</h2>
                      <p className="mt-1 text-sm text-neutral-500">거칠어도 괜찮아요. 초안 그대로 적어보세요.</p>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">입력</span>
                  </div>

                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="min-h-[320px] w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-[15px] leading-7 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300"
                    placeholder={`예시)
안녕하세요, 일정 공유를 계속 기다리고 있는데 아직 회신이 없어 확인 부탁드립니다.

또는 그냥 편하게 적으세요. 욕 포함 가능. 우리가 다립니다.`}
                  />

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <div className="mb-2 text-sm font-medium text-neutral-700">톤</div>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-300"
                      >
                        {TONES.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <div className="mb-2 text-sm font-medium text-neutral-700">상황</div>
                      <select
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-300"
                      >
                        {SITUATIONS.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerateDisabled}
                      className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "다리는 중입니다..." : "다리기"}
                    </button>

                    <button
                      onClick={() => setActiveTab("trash")}
                      className="text-sm text-neutral-500 underline underline-offset-4"
                    >
                      😤 감정 먼저 버리기
                    </button>
                  </div>

                  {feedback ? (
                    <div className="mt-4 rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
                      {feedback}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">다려진 메일</h2>
                      <p className="mt-1 text-sm text-neutral-500">오른쪽에는 보낼 수 있는 형태의 메일이 표시됩니다.</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600">결과</span>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">Subject</div>
                      <div className={`text-sm whitespace-pre-wrap ${result.subject ? "text-neutral-800" : "text-neutral-400"}`}>
                        {result.subject || "메일 제목이 여기에 표시됩니다"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">Body</div>
                      <div className={`min-h-[220px] whitespace-pre-wrap text-sm leading-7 ${result.body ? "text-neutral-800" : "text-neutral-400"}`}>
                        {result.body ||
                          `안녕하세요,\n\n다려진 메일 본문이 여기에 표시됩니다.\n\n감정은 걷어내고, 필요한 내용은 남긴 결과물이 이 영역에 들어옵니다.\n\n감사합니다.`}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">Summary</div>
                      <div className={`text-sm whitespace-pre-wrap ${result.summary ? "text-neutral-800" : "text-neutral-400"}`}>
                        {result.summary || "한 줄 요약이 여기에 표시됩니다"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleCopy}
                      disabled={!result.subject && !result.body && !result.summary}
                      className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      복사하기
                    </button>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerateDisabled}
                      className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      다시 다리기
                    </button>
                  </div>

                  {copyState ? (
                    <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{copyState}</div>
                  ) : null}
                </div>
              </section>

              <section className="mt-4 rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-4 text-sm text-neutral-500 shadow-sm">
                지금 버전은 Claude API로 실제 생성까지 연결된 v0.2입니다.
              </section>
            </>
          ) : (
            <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">감정 쓰레기통</h2>
                  <p className="mt-1 text-sm text-neutral-500">여긴 진짜 전송되지 않아요. 하고 싶은 말을 한 번 쏟아내고 가세요.</p>
                </div>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-600">페이크 전송</span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {trashRecipients.map((person) => (
                  <span key={person} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                    {person}
                  </span>
                ))}
              </div>

              <div className="grid gap-4">
                <input
                  value={trashSubject}
                  onChange={(e) => setTrashSubject(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-neutral-300"
                  placeholder="제목을 적어보세요"
                />

                <textarea
                  value={trashBody}
                  onChange={(e) => setTrashBody(e.target.value)}
                  className="min-h-[260px] w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-[15px] leading-7 outline-none transition placeholder:text-neutral-400 focus:border-neutral-300"
                  placeholder="여긴 안 보내집니다. 정말 하고 싶은 말을 적어보세요."
                />

                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                  📎 첨부파일: final_final_really_final_v3.pdf
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={handleTrashSend}
                    className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
                  >
                    보내기
                  </button>

                  <button
                    onClick={moveTrashToIronMode}
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    다리미 모드로 보내기
                  </button>
                </div>

                {trashResponse ? (
                  <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                    {trashResponse}
                  </div>
                ) : null}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
