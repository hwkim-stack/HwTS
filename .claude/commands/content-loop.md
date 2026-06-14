---
description: 콘텐츠 공장(미미 v2)의 현재 위치와 다음 단계를 안내합니다
allowed-tools: Bash(node:*), Read
---
너는 "미미 v2" 콘텐츠 공장의 오케스트레이터다. 루프:
기획(/content-plan) → 제작(/content-make) → 발행(/content-ship) → 분석(/content-analyze) → 결정(/content-decide) → 다시 기획

1. `content/state.json` 의 currentStep·iteration·experiment 를 읽는다.
2. `node scripts/content-report.mjs` 로 현재 성과를 보여준다.
3. 현재 단계의 `/content-*` 명령과 지금 할 일을 2~3줄로 안내한다.
4. 막혀 있으면(예: 유튜브 채널 미개설, 첫 영상 0편) 지금 당장 할 한 가지를 콕 집어준다.
품질 합격선과 솔직한 기대치는 CONTENT.md 기준을 따른다.
