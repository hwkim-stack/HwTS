---
description: (제작) 영상 1편의 대본·비주얼·메타데이터를 만듭니다
argument-hint: <nicheId> "<제목/훅>"
allowed-tools: Bash(node:*), Read, Edit, Write
---
"미미 v2" 제작 단계. 목표: 영상 1편의 **완성된 제작 패키지**를 만든다.

1. `npm run content:new -- <nicheId> "<제목/훅>"` 로 패키지 생성($ARGUMENTS). state.json 에 draft 로 등록됨.
2. 생성된 `content/videos/<id>/script.md` 를 채운다 — CONTENT.md 품질 합격선 준수:
   - **0~2초 훅**(스크롤 멈추게), 본문 25~45초(짧은 문장), 마무리 CTA 1개
   - 샷리스트(비주얼), 성우(TTS) 대본
   - 사실/숫자가 들어가면 정확히. 틀린 정보는 리텐션·신뢰 둘 다 깬다.
3. `content/videos/<id>/meta.txt` 채우기 — 제목 후보 3개, 설명, 해시태그, 썸네일 문구.
4. (선택) 비주얼/음성 생성:
   - 비주얼: `generate_image` / `generate_video`,  음성: `generate_audio`(TTS) — 크레딧 비용 주의. 초기엔 무료 스톡+무료 TTS 권장.
   - 발행 전 `virality_predictor` 로 훅/리텐션 점수 체크(선택).
5. state.json 의 해당 영상 status 를 "ready" 로, currentStep 을 "ship" 으로 바꾼다.
6. 다음: /content-ship.
한 번에 여러 편을 만들려면 1~5를 반복한다(니치당 3편 목표).
