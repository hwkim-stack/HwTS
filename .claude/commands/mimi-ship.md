---
description: (운영) 사이트를 빌드하고 배포 단계를 안내/실행합니다
argument-hint: [선택: 배포 대상 - github | vercel | cloudflare | netlify]
allowed-tools: Bash(node:*), Bash(npx:*), Read, Edit
---
"미미" 루프의 **운영(배포)** 단계다.

1. `npm run build` 로 dist/ 를 최신화한다(sitemap.xml·robots.txt·ads.txt 자동 갱신).
2. `mimi/config.json` 의 `baseUrl` 과 `adsense.publisherId` 가 실제 값인지 확인한다. 비어 있거나 example.com / XXXX 면 채우라고 먼저 안내한다.
3. 배포 대상($ARGUMENTS, 없으면 물어봄)에 맞춰 명령을 안내·실행한다:
   - **GitHub Pages**: dist/ 를 게시(Actions 또는 gh-pages 브랜치). 저장소가 없으면 `git init` 후 안내.
   - **Vercel**: `npx vercel deploy --prod dist`
   - **Cloudflare Pages**: `npx wrangler pages deploy dist`
   - **Netlify**: `npx netlify deploy --prod --dir dist`
4. 배포 후 체크리스트를 안내한다:
   - Google Search Console 에 사이트 등록 + `sitemap.xml` 제출
   - AdSense 미승인 시: 도메인 연결 → 콘텐츠 충분히 쌓기 → 신청 → 승인 후 `config.json` 의 publisherId/슬롯 채우고 재빌드
5. `mimi/state.json` 에서 방금 배포한 도구의 status 를 `"live"` 로 바꾸고, `currentStep` 을 `"analyze"` 로 바꾼다. `log` 에 배포 기록을 남긴다.
6. 마지막에 "다음: /mimi-analyze (며칠 뒤 데이터가 쌓이면)" 을 안내한다.
