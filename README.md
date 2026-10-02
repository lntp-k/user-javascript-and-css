# Chrome Typography v2.0.1

2026-10-02 업데이트. Chrome의 사용자 CSS 확장 프로그램에 넣을 순수 CSS입니다.

## 적용

1. 전체 사이트용은 `typography-chrome.css` 내용을 CSS 입력란에 붙여 넣고 URL 패턴을 `*://*/*`로 설정합니다.
2. Claude만 사용하려면 `claude-chrome.css`를 붙여 넣고 URL 패턴을 `https://claude.ai/*`로 설정합니다.
3. 기존 v1 CSS는 교체합니다. 전체 사이트용을 이미 쓰는 경우 Claude용을 추가로 켤 필요는 없습니다.

`.css` 파일 전체를 복사하면 됩니다. `No.1.md`, `Claude.ai.md`는 기존의 URL + 구분선 + CSS 기록 형식을 유지한 문서이며, 문서 전체를 CSS 입력란에 붙여 넣으면 안 됩니다.

## 변경

- `@-moz-document` 래퍼를 제거해 Chrome이 직접 파싱하도록 수정했습니다.
- 설치된 일반 Pretendard도 사용할 수 있도록 폰트 대체 목록을 보완했습니다. 외부 폰트 다운로드는 없습니다.
- 모든 `div`·`span`을 덮어쓰는 규칙을 제거했습니다. 본문 요소와 폰트 상속을 중심으로 적용합니다.
- 코드·구문 강조 자손·키보드 표기·샘플 출력에 고정폭 폰트를 적용합니다.
- KaTeX, MathJax, MathML, 에디터, 알려진 아이콘 클래스, 명시적 폰트 지정과 serif 클래스는 본문 폰트 강제 규칙에서 제외합니다.
- v2.0.1은 인라인 `font:` 축약 지정도 보호합니다. CSS의 속성 선택자 한계 때문에 `style` 문자열에 `font`가 포함된 영역과 자손은 보수적으로 제외합니다.
- 글자색·배경색·굵기·헤딩 크기·입력 UI 크기·애니메이션의 전역 강제 변경을 제거했습니다.
- 읽기 영역(`article`, `.markdown-body`, `.prose`, `.post-content`, `.medium-content`, `[data-typo-reader]`)의 문단·목록·정의 목록에 `1.125rem`, 줄 간격 `1.7`을 적용합니다. 기본 루트 크기가 16px이면 본문은 18px입니다.
- 한국어 읽기 영역에는 `keep-all`을 적용하고 긴 문자열은 필요한 경우 줄바꿈합니다. 긴 코드 블록은 가로 스크롤을 사용합니다.
- Claude용은 `data-theme='claude'` 속성에 의존하지 않습니다.

사이트가 자체 폰트를 높은 우선순위로 지정한 span, Shadow DOM, iframe 내용에는 이 CSS가 모두 적용된다고 보장할 수 없습니다. CSS만으로 모든 사이트의 원래 serif·아이콘 폰트를 자동 판별할 수는 없습니다. 특수 사이트는 별도 제외 규칙을 추가해야 할 수 있습니다.

## 조정

파일 위쪽 `--ujc-typo-reader-size`와 `--ujc-typo-reader-leading`으로 읽기 크기와 줄 간격을 조절할 수 있습니다. 앱 UI 전체의 크기를 변경하지 않습니다.

## 검증과 원본

검증 결과는 `TEST-REPORT.md`에 기록했습니다. 원시 측정값(`test-results/`), 백업(`originals/`), ZIP(`exports/`)은 로컬 생성물로 Git에서 제외합니다. 원본 CSS 비교 테스트 입력은 `tests/fixtures/`에 포함돼 새 체크아웃에서도 사용할 수 있습니다. 사용자 브라우저의 확장 프로그램 설정은 변경하지 않았습니다. 다음 세션에서는 `HANDOFF.md`를 먼저 읽습니다.

이 컴퓨터에서 재실행:

```sh
node tests/chrome-review.cjs
node tests/chrome-live.cjs
```

테스트는 Codex 번들 Playwright와 `/Applications/Google Chrome.app`을 사용하며 사용자 브라우저 프로필과 분리된 headless Chrome을 실행합니다. 웹사이트 검사에는 인터넷 연결이 필요합니다. 라이브 페이지 접근 실패는 보고서에 기록하며 접근 제한을 우회하지 않습니다.
