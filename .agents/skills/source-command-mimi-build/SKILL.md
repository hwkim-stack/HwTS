---
name: "source-command-mimi-build"
description: "(개발) 기획된 도구를 실제로 구현하고 사이트를 다시 빌드합니다"
---

# source-command-mimi-build

Use this skill when the user asks to run the migrated source command `mimi-build`.

## Command Template

"미미" 루프의 **개발** 단계다. 목표: `mimi/state.json` 의 `plan` 에 적힌 도구를 완성한다.

1. `mimi/state.json` 의 `plan` 을 읽는다. 비어 있으면 먼저 `/mimi-plan` 을 하라고 안내하고 멈춘다.
2. `npm run new -- <slug> "<제목>"` 으로 스캐폴드를 만든다.
3. `src/tools/<slug>.mjs` 를 채운다. **규칙(반드시 준수)**:
   - 모든 동작은 순수 클라이언트 JS. 외부 라이브러리·네트워크 호출 금지.
   - `script` 필드 안에서는 **백틱(\`) 사용 금지**, 따옴표만 사용(빌드 템플릿과 충돌).
   - `script` 안에 문자열 `</` + `script>` 가 들어가지 않게 한다.
   - description·keywords·body·content·faq(2개 이상)를 SEO 관점의 자연스러운 한국어로 작성.
   - 기존 도구(`src/tools/*.mjs`)의 구조·클래스명(.panel/.result/.stat 등)을 그대로 따라 일관성 유지.
4. `npm run build` 를 실행해 에러가 없는지 확인한다(에러 나면 고친다).
5. `npm run serve` 로 띄워 동작을 직접 점검한다(엣지 케이스 1~2개 포함).
6. `mimi/state.json` 의 `tools` 배열에 `{ slug, title, status: "built", iteration, createdAt }` 를 추가하고, `plan` 을 비우고, `currentStep` 을 `"ship"` 으로 바꾼다.
7. 마지막에 "다음: /mimi-ship" 을 안내한다.
