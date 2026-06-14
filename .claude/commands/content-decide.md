---
description: (결정) 니치 더블다운·개선·중단을 정하고 다음 반복을 시작합니다
allowed-tools: Bash(node:*), Read, Edit
---
"미미 v2" P&L 의사결정 단계. 목표: 데이터로 다음 행동을 정하고 루프를 닫는다.

1. `node scripts/content-report.mjs` 와 `content/state.json` 을 본다.
2. 각 니치를 분류한다(평균 시청률·조회·수익 기준):
   - **확장(scale)**: 알고리즘이 미는 니치 → 이 포맷으로 더 많이 만든다(다음 기획 집중).
   - **개선(improve)**: 가능성은 보이나 약함 → 훅/길이/썸네일만 바꿔 재시도.
   - **중단(kill)**: 반응 없음 → 투자 중단.
3. experiment.niches 의 각 status 를 갱신하고, 결정을 `decisions` 에 `{iteration,date,summary,nextFocus}` 로 append.
4. iteration +1, currentStep "plan" 로, nextFocus(다음에 집중할 니치/포맷) 한 줄 기록. log 에도 남김.
5. 필요하면 새 실험(experiment)으로 교체. 마지막에 "한 바퀴 완료 — 다음: /content-plan (nextFocus: …)" 안내.
