---
name: "source-command-mimi-decide"
description: "(P&L 의사결정) 유지·개선·확장·중단을 결정하고 다음 반복을 시작합니다"
---

# source-command-mimi-decide

Use this skill when the user asks to run the migrated source command `mimi-decide`.

## Command Template

"미미" 루프의 **P&L 의사결정** 단계다. 목표: 데이터에 근거해 다음 행동을 정하고 루프를 한 바퀴 닫는다.

1. `node scripts/report.mjs` 와 `mimi/state.json` 을 본다.
2. 각 도구를 다음 중 하나로 분류한다:
   - **확장(scale)**: 수익·PV 좋음 → 비슷한 도구를 더 만든다(다음 기획 타깃).
   - **개선(improve)**: PV는 있는데 수익·체류 약함 → 콘텐츠·UX·내부링크 보강.
   - **유지(keep)**: 보통, 그대로 둔다.
   - **중단(kill)**: 트래픽 거의 없음 → 추가 투자 중단(페이지는 유지).
3. 결정을 `mimi/state.json` 의 `decisions` 에 `{ iteration, date, summary, nextFocus }` 로 append 한다.
4. `iteration` 을 +1, `currentStep` 을 `"plan"` 으로 바꾸고, 다음 기획에서 집중할 방향(`nextFocus`)을 한 줄로 정한다. `log` 에도 남긴다.
5. 마지막에 "한 바퀴 완료 🎉 — 다음: /mimi-plan (nextFocus: …)" 을 안내한다.
