export default function MailIronerApp() {
  const tones = ["노멀", "정중하게", "매우 공손하게"];
  const situations = ["부탁", "재촉", "수정 요청", "일정 공유", "사과", "확인 요청"];

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-black/5 bg-white/90 px-5 py-4 shadow-sm backdrop-blur">
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
              거친 초안 → 보낼 수 있는 말
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mb-4 flex w-full gap-2 rounded-2xl bg-neutral-200/70 p-1 sm:w-fit">
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-medium shadow-sm">다리미 모드</button>
            <button className="rounded-2xl px-4 py-2 text-sm font-medium text-neutral-500">감정 쓰레기통</button>
          </div>

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
                className="min-h-[320px] w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-[15px] leading-7 outline-none ring-0 transition placeholder:text-neutral-400 focus:border-neutral-300"
                placeholder={"예시)\n안녕하세요, 일정 공유를 계속 기다리고 있는데 아직 회신이 없어 확인 부탁드립니다.\n\n또는 그냥 편하게 적으세요. 욕 포함 가능. 우리가 다립니다."}
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-neutral-700">톤</div>
                  <select className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-300">
                    {tones.map((tone) => (
                      <option key={tone}>{tone}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium text-neutral-700">상황</div>
                  <select className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-300">
                    {situations.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95">
                  다리기
                </button>
                <button className="text-sm text-neutral-500 underline underline-offset-4">
                  😤 감정 먼저 버리기
                </button>
              </div>
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
                  <div className="text-sm text-neutral-400">메일 제목이 여기에 표시됩니다</div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">Body</div>
                  <div className="min-h-[220px] whitespace-pre-wrap text-sm leading-7 text-neutral-400">
                    안녕하세요,{"\n\n"}
                    다려진 메일 본문이 여기에 표시됩니다.{"\n\n"}
                    감정은 걷어내고, 필요한 내용은 남긴 결과물이 이 영역에 들어옵니다.{"\n\n"}
                    감사합니다.
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">Summary</div>
                  <div className="text-sm text-neutral-400">한 줄 요약이 여기에 표시됩니다</div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95">
                  복사하기
                </button>
                <button className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                  다시 다리기
                </button>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-4 text-sm text-neutral-500 shadow-sm">
            이 버전은 v0.1 UI 초안입니다. 카피와 옵션은 이후 자유롭게 바꿀 수 있게 설계합니다.
          </section>
        </main>
      </div>
    </div>
  );
}

