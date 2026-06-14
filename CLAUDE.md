# CLAUDE.md — 미미(Mimi) 루프 프로젝트

이 저장소는 **AdSense 수익형 유틸리티 도구 사이트**(`ToolSeed`)와, 그것을 운영하는 **"미미" 자동 수익 루프**다.
영감: mimi-seed-sdk (앱스토어 운영 자동화 MCP). 차이점: 여기서는 **앱이 아니라 웹**이고, **Anthropic API 키를 쓰지 않는다.**

## 핵심 원칙
- **API 키 금지.** AI 판단이 필요한 단계는 사용자가 Claude Code(구독제)에서 `/mimi-*` 슬래시 명령으로 직접 실행한다. 코드에서 Anthropic/OpenAI API를 호출하지 말 것.
- **결정 단계 = 슬래시 명령**(`.claude/commands/`), **단순 작업 = Node 스크립트**(`scripts/`).
- **사이트는 100% 정적**. 도구는 순수 클라이언트 JS만. 외부 라이브러리·네트워크 호출·백엔드 금지(무료 호스팅 + AdSense 호환).

## 루프 (기획→개발→운영→분석→P&L→기획)
| 단계 | 명령 | 하는 일 |
|---|---|---|
| 기획 | `/mimi-plan` | 다음에 만들 도구 1개 결정 → `state.json.plan` |
| 개발 | `/mimi-build` | 도구 구현 + `npm run build` |
| 운영 | `/mimi-ship` | 빌드·배포·sitemap/AdSense 체크 |
| 분석 | `/mimi-analyze` | `metrics.csv` 갱신 + 성과 해석 |
| 의사결정 | `/mimi-decide` | 유지·개선·확장·중단 → iteration+1 |
상태는 항상 `mimi/state.json` 에 기록한다(`currentStep`, `iteration`, `tools`, `plan`, `decisions`, `log`).

## 파일 지도
- `src/tools/*.mjs` — 도구 1개 = 파일 1개. `{ slug, title, icon, order, description, keywords, body, content, faq, script }` 를 default export. 빌더가 디렉터리를 스캔하므로 파일만 추가하면 됨.
- `src/templates/` — `layout.mjs`(공용 셸·광고 슬롯), `home.mjs`, `tool.mjs`.
- `src/assets/` — `styles.css`, `main.js`(테마·검색), `favicon.svg`. 빌드 시 `dist/assets/` 로 복사.
- `scripts/` — `build.mjs`, `serve.mjs`, `report.mjs`, `new-tool.mjs`.
- `mimi/` — `config.json`(사이트·AdSense·경제 지표), `state.json`(루프 상태), `metrics.csv`(수익 데이터).
- `dist/` — 빌드 산출물(gitignore).

## 명령
```
npm run build     # src → dist
npm run serve     # http://localhost:8080 미리보기
npm run dev       # build + serve
npm run report    # P&L·치킨 지표 대시보드
npm run new -- <slug> "<제목>"   # 새 도구 스캐폴드
```

## 새 도구 작성 규칙 (중요)
1. `script` 필드 안에서는 **백틱(`) 금지**, 따옴표만 사용(빌드 템플릿이 백틱 템플릿이라 충돌).
2. `script` 안에 `</script>` 문자열이 들어가지 않게.
3. 정규식의 백슬래시는 `.mjs` 소스에서 `\\` 로 이스케이프(예: `/\\s/g` → 출력 `/\s/g`).
4. `faq` 는 2개 이상(FAQ JSON-LD 자동 생성 → 검색 노출에 유리).
5. 작성 후 반드시 `npm run build` 로 에러 확인, `npm run serve` 로 동작 확인.
