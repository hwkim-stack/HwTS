---
description: (기획) 니치별 영상 아이디어와 훅을 정합니다
argument-hint: [선택: nicheId 또는 아이디어]
allowed-tools: Bash(node:*), Read, Edit
---
"미미 v2" 기획 단계. 목표: 다음에 만들 영상들의 **구체적 아이디어 + 0~2초 훅**을 정한다.

1. `content/state.json` 의 experiment.niches 와 기존 videos, `content/metrics.csv` 를 읽는다.
2. (데이터 있으면) `node scripts/content-report.mjs` 로 잘 되는 니치 확인.
3. 테스트 중인 각 니치에 대해, **검색이 아니라 "스크롤 멈추는 훅"** 관점으로 영상 아이디어를 뽑는다:
   - 첫 2초 훅이 강한가? (충격/궁금/이득/반전)
   - 25~45초로 끝까지 보게 만들 구조가 있나?
   - faceless로 제작 가능한가? (스톡/생성 비주얼 + TTS + 자막)
4. 니치별로 아이디어 3개씩 + 각 훅 문장을 표로 제시하고, 먼저 만들 것들을 추천한다.
5. 사용자가 고르면 그 아이디어들을 다음 단계로 넘긴다(필요시 state.log 에 기록, currentStep="make").
인자: $ARGUMENTS

훅 예시 감각 — money: "월급에서 이거 모르면 매달 손해", mystery: "이 사진의 진짜 정체는...", tools: "이 무료 사이트 알면 디자인 외주 끊습니다".
