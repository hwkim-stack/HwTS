---
description: (발행) 업로드 체크리스트와 메타데이터로 영상을 발행 기록합니다
allowed-tools: Bash(node:*), Read, Edit
---
"미미 v2" 발행 단계.

1. 발행할 영상의 `content/videos/<id>/meta.txt` 와 script.md 를 점검한다(훅·자막·저작권·제목/썸네일).
2. 업로드 체크리스트를 안내한다:
   - 유튜브 채널 없으면 먼저 개설(무료) → state.json channels 에 기록
   - 제목/설명/해시태그/썸네일 적용, 쇼츠는 세로 9:16
   - 같은 영상을 틱톡/인스타 릴스에도 재활용(분배 채널 늘리기)
3. 발행 후: state.json 의 해당 영상 status 를 "published" 로, publishedAt·url 기록. currentStep 을 "analyze" 로.
4. 다음: 며칠~1주 뒤 /content-analyze (데이터가 쌓이면).
※ 실제 업로드는 사용자가 직접(플랫폼 로그인 필요). 너는 메타데이터·체크리스트·기록을 담당.
