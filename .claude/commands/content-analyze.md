---
description: (분석) 영상 성과를 metrics.csv에 반영하고 알고리즘 반응을 해석합니다
allowed-tools: Bash(node:*), Read, Edit
---
"미미 v2" 분석 단계.

1. 유튜브 스튜디오/틱톡 분석의 영상별 수치를 받아 `content/metrics.csv` 에 추가한다.
   - 형식: `videoId,date,platform,views,avgViewSec,ctr,revenue_krw`
   - 사용자가 표/숫자를 붙여넣으면 네가 CSV 줄로 변환해 추가.
2. `node scripts/content-report.mjs` 실행.
3. 해석 — 알고리즘이 보상하는 신호 위주로:
   - **평균 시청 지속/시청률**(가장 중요 — 훅·리텐션), 노출클릭률(CTR=썸네일/제목), 조회수
   - 어떤 니치·어떤 훅 유형이 끝까지 보게 했나? 초반 이탈이 큰 영상은 훅 문제.
4. 인사이트 3개 + "다음에 시도/중단할 것" 정리. currentStep 을 "decide" 로.
5. 다음: /content-decide.
