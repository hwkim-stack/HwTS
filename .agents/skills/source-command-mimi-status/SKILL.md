---
name: "source-command-mimi-status"
description: "미미 루프 상태와 수익(치킨) 대시보드를 보여줍니다"
---

# source-command-mimi-status

Use this skill when the user asks to run the migrated source command `mimi-status`.

## Command Template

1. `node scripts/report.mjs` 를 실행해 P&L·치킨 지표를 출력한다.
2. `mimi/state.json` 을 읽어 iteration, currentStep, 각 도구의 status 를 한눈에 표로 요약한다.
3. 마지막에 다음에 실행할 `/mimi-*` 명령어 하나를 추천한다.
