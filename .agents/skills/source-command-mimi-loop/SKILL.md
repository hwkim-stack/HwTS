---
name: "source-command-mimi-loop"
description: "미미 루프의 현재 위치를 파악하고 다음에 실행할 단계를 안내합니다"
---

# source-command-mimi-loop

Use this skill when the user asks to run the migrated source command `mimi-loop`.

## Command Template

너는 "미미" 자동 수익 루프의 오케스트레이터다. 루프 순서:
기획(/mimi-plan) → 개발(/mimi-build) → 운영(/mimi-ship) → 분석(/mimi-analyze) → 의사결정(/mimi-decide) → 다시 기획

할 일:
1. `mimi/state.json` 을 읽어 `currentStep` 과 `iteration` 을 확인한다.
2. `node scripts/report.mjs` 를 실행해 현재 수익·치킨 지표를 보여준다.
3. `currentStep` 에 해당하는 `/mimi-*` 명령어가 무엇인지 한 줄로 안내하고, 그 단계에서 무엇을 하는지 2~3줄로 요약한다.
4. 사용자가 원하면 그 단계를 바로 이어서 진행한다.

데이터가 없거나 막혀 있으면, 지금 당장 해야 할 한 가지(예: 도메인 연결, AdSense 신청, 첫 배포)를 콕 집어 알려준다.
