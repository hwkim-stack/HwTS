# 🐣 ToolSeed — 미미(Mimi) 자동 수익 루프

무료 유틸리티 도구 사이트 + 그것을 굴리는 **"미미" 루프**.
[mimi-seed-sdk](https://github.com/jeonghwanko/mimi-seed-sdk)(모바일 앱 운영 자동화 MCP)에서 영감을 받아, **웹 + AdSense + API 키 없이** 같은 아이디어를 구현했다.

기획 → 개발 → 운영 → 데이터 분석 → P&L 의사결정 → 다시 기획.
판단은 Claude Code 구독의 `/mimi-*` 슬래시 명령으로, 기계적인 일은 Node 스크립트로.

## 빠른 시작
```bash
npm run dev      # 빌드 + http://localhost:8080 미리보기
npm run report   # 수익(치킨) 대시보드
```
아직 의존성 설치도 필요 없다(전부 Node 내장 모듈, `npm install` 불필요).

## 루프 명령 (Claude Code에서)
| 명령 | 단계 |
|---|---|
| `/mimi-loop` | 지금 어디인지 + 다음 할 일 안내 |
| `/mimi-status` | 수익·상태 대시보드 |
| `/mimi-plan` | 기획: 다음 도구 1개 결정 |
| `/mimi-build` | 개발: 도구 구현 + 빌드 |
| `/mimi-ship` | 운영: 배포 + SEO/AdSense |
| `/mimi-analyze` | 분석: 수익 데이터 해석 |
| `/mimi-decide` | P&L 의사결정 → 다음 반복 |

## 구조
```
src/tools/*.mjs      도구 1개 = 파일 1개 (빌더가 자동 스캔)
src/templates/       페이지 템플릿(레이아웃·홈·도구)
src/assets/          CSS·JS·favicon
scripts/             build · serve · report · new-tool
mimi/                config.json · state.json · metrics.csv
.claude/commands/    /mimi-* 슬래시 명령
dist/                빌드 산출물
```

## 새 도구 추가
```bash
npm run new -- bmi-calculator "BMI 계산기"   # 스캐폴드
# src/tools/bmi-calculator.mjs 를 채운 뒤
npm run build && npm run serve
```
또는 그냥 `/mimi-build` 에게 시키면 된다.

## GitHub Pages 배포
`.github/workflows/deploy.yml` 가 `main` 브랜치에 푸시될 때마다 자동 빌드·배포한다. basePath/baseUrl 은 저장소 이름으로 자동 결정(프로젝트 사이트 → `/<repo>`, `<user>.github.io` → 루트).

1. GitHub에서 빈 저장소 생성 (예: `mimi-toolseed`).
2. 로컬에서 연결 후 푸시:
   ```bash
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages → Build and deployment → Source: GitHub Actions** 선택.
4. **Actions** 탭에서 배포 완료 후 `https://<USER>.github.io/<REPO>/` 접속.
5. (선택) 커스텀 도메인: `mimi/config.json` 의 `cname` 에 도메인, `basePath` 를 `""` 로 설정 → 재빌드/푸시. AdSense 신청은 이 단계 이후 권장.

## 돈에 대한 솔직한 이야기
스크립트가 돈을 만들지 않는다. **검색 트래픽 × 도구 수 × 광고 RPM** 이 만든다.
레버리지는 "거의 0원의 비용으로 작은 도구를 꾸준히 늘리는 것". 자세한 계산·타임라인·AdSense 세팅은 [MIMI.md](MIMI.md) 참고.

라이선스/원작자 주의: mimi-seed-sdk 는 PolyForm Noncommercial 라이선스다. 이 저장소는 그 코드를 포함하지 않고 *아이디어(루프)* 만 참고한 별도 구현이다.
