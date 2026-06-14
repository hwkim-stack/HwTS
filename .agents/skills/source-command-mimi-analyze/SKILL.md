---
name: "source-command-mimi-analyze"
description: "(데이터 분석) metrics.csv를 갱신하고 도구별 성과를 분석합니다"
---

# source-command-mimi-analyze

Use this skill when the user asks to run the migrated source command `mimi-analyze`.

## Command Template

"미미" 루프의 **데이터 분석** 단계다.

1. 사용자에게 AdSense / Google Search Console 의 최신 수치를 요청한다. 표나 숫자를 붙여넣으면 네가 직접 `mimi/metrics.csv` 형식으로 변환해 추가한다.
   - 형식: `date,slug,pageviews,clicks,revenue_krw` (하루 1줄, 도구 slug 별).
   - 날짜는 YYYY-MM-DD, 수익은 원 단위 정수.
2. `node scripts/report.mjs` 를 실행한다.
3. 결과를 해석한다:
   - 수익 상위/하위 도구
   - RPM(1000 PV당 수익)이 높은/낮은 도구
   - PV는 많은데 수익이 낮은 도구(개선 후보), PV가 거의 없는 도구(SEO 부진)
4. 핵심 인사이트 3가지 + "다음에 시도할 만한 것"을 요약한다.
5. `currentStep` 을 `"decide"` 로 바꾸고 `log` 에 한 줄 남긴다.
6. 마지막에 "다음: /mimi-decide" 를 안내한다.
