# HANDOFF — 다음 세션에서 먼저 읽을 문서

최종 정리: 2026-10-02. 작업 위치: `/Users/jl/coding/User JavaScript and CSS`.

## 현재 상태

Chrome용 사용자 CSS v2.0.1을 저장하고 테스트 및 ZIP 내보내기를 완료했다. `typography-chrome.css`는 전체 사이트용, `claude-chrome.css`는 Claude용이다. `No.1.md`, `Claude.ai.md`도 동일한 CSS로 갱신했다. 원본은 `originals/`에 보관했다.

세션 시작 시 Git 저장소가 없어 `fatal: not a git repository (or any of the parent directories): .git`를 확인했다. 사용자가 현재 폴더에 저장소를 만들고 공개 GitHub에 게시하도록 승인했다. 로컬 Git과 공개 원격 https://github.com/lntp-k/user-javascript-and-css 를 생성했다. 작업 브랜치 `update/chrome-typography`를 `main`에 fast-forward 병합하고 push했다. 소스 커밋 `f5473f65334f7eb5ac3f6d9c5e9ea9fc490b4c2a`가 원격 main과 로컬 HEAD에 일치함을 `git ls-remote`로 확인했다. 이 인계 문서의 후속 기록 커밋은 해당 소스 커밋의 자손이다. 최신 SHA는 `git ls-remote origin refs/heads/main`과 `git rev-parse HEAD`로 비교한다.

## 검증된 결과

- 설치 Google Chrome 154.0.8037.93의 분리된 headless 프로필에서 측정했다.
- 24회 원본/수정본/테마 속성 없는 렌더링, 수정본 검사 320개 통과.
- 실제 MDN 페이지 162개, KaTeX 페이지 417개 검사 통과. 수식 폰트는 처음 100개 요소를 샘플링했다.
- 총 기록된 통과 검사 899개. 본문 18px, 줄 간격 30.6px (루트 16px 기준).
- 실제 글꼴: Pretendard-Regular, Pretendard-Bold, 코드 Menlo-Regular.
- 마무리 단계에서 두 테스트 스크립트의 `node --check` 통과.
- 상위 `/Users/jl/coding/AGENTS.md`에 따라 `graphify update .` 최종 실행: 46 nodes, 37 edges, 9 communities. 첫 실행의 측정 JSON zero-node 경고 이후 생성물을 ignore하고 재갱신했다. 코드 그래프 갱신은 완료됐다. 문서의 의미 그래프 추출은 수행하지 않았다.
- 독립 Codex Sol 리뷰의 P2 (`font:` 축약 지정 덮어쓰기)를 수정하고 회귀 테스트를 통과했다. v2.0.1 독립 재리뷰에서 게시 승인, 남은 blocking finding 없음.

## 커밋 후보와 제외

커밋 대상은 CSS 두 파일, Markdown 소스 기록 두 파일, `tests/` 스크립트와 고정 CSS fixture, README, TEST-REPORT, HANDOFF, ADR 및 `.gitignore`이다. 테스트 스크립트는 이 Mac의 Chrome/번들 Playwright 경로에 의존한다.

`test-results/`의 측정값과 스크린샷, `exports/` ZIP, `originals/` 백업, `graphify-out/` 생성물은 소스 커밋에서 제외한다. `.gitignore`에 등록했고 삭제하지 않았다. `tests/fixtures/`의 원본 CSS만 비교 테스트 입력으로 포함한다. 테스트 데이터는 합성 문자열과 공개 웹페이지에서 수집한 내용이며, 로그인된 개인 대화는 수집하지 않았다.

## Not verified

- 실제 브라우저 확장 설치와 URL 매칭: 설정을 변경하지 않았다.
- Claude 실제 로그인 대화 화면: 공개 페이지 접근에서 HTTP 403, 우회하지 않았다.
- 별도 Windows/서버 설치본: 설치 위치가 지정되지 않아 원격 호스트를 조사하지 않았다. Mac의 coding 및 Codex worktrees 하위 4단계 폴더 검색에서 같은 이름의 폴더는 현재 위치만 발견했다. `git worktree list`도 현재 위치 하나다. 이는 전체 호스트의 중복 부재를 증명하지 않는다.
- CSS 전용 린터: 프로젝트에 설정/설치된 린터가 없다. Chrome 파싱과 계산된 스타일 검사로 확인했다.

## 다음 작업

1. 공개 GitHub `main`과 로컬 HEAD를 확인하고 필요한 변경만 이어간다.
2. 설치하려면 기존 확장 CSS를 v2.0.1으로 교체하고 URL 패턴을 설정한다. 전체 사이트용을 쓰면 Claude용을 중복 활성화할 필요는 없다.
3. 사용자가 접근 가능한 Claude 대화 화면에서 코드·수식·버튼을 추가 검증한다.
4. 추가 운영 체크아웃/복제본이 지정되면 확인하고 dirty/ahead 작업 디렉터리는 덮어쓰지 않는다.

현재는 파일을 저장하는 사용자 CSS 도구이므로 이 폴더를 소비하는 서비스/daemon은 식별되지 않았고 재시작을 수행하지 않았다. 확장 적용은 별도 남은 작업이다.

## 게시 기록

- 공개 GitHub 저장소 생성: 2026-10-02 12:12 KST. 현재 Mac 폴더를 그대로 사용했다.
- 소스 commit: 12:18:46–12:18:47 KST, `git commit -m 'Improve Chrome typography and preserve code, math, and explicit fonts'` 성공.
- main merge: 12:18:47 KST, `git merge --ff-only update/chrome-typography` 성공.
- push: 12:18:47 KST 시작, `git push -u origin main` 성공 응답 후 12:19:02 KST까지 원격 SHA와 PUBLIC 상태 확인 완료.
- `git diff --cached --check`, 두 테스트 스크립트 `node --check`, 로컬 Chrome 재검증 통과. 별도 필수 gate/hook은 없었으며 저장소 ruleset 목록은 비어 있었다.
- GitHub Actions는 검증·병합 판정 기준으로 사용하지 않았다. 로컬 테스트와 독립 Codex Sol 재리뷰 결과를 사용했다.
- 생성물은 Git에서 제외하고 `exports/chrome-typography-v2.0.1.zip`으로 보관했다. 기존 v2.0.0 ZIP도 로컬에 유지했다.
