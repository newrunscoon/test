# 릴리스 노트 작성

`.cursor/skills/release-notes/SKILL.md` 스킬을 읽고, 마지막 태그(없으면 초기 커밋) 이후 변경 사항으로 릴리스 노트를 작성해줘.

## 절차

1. `git tag --sort=-v:refname`, `git log --oneline --no-merges`, `git diff --stat`로 변경 범위를 파악한다.
2. `npm test`를 실행하고, 실패 시 릴리스 노트 작성을 중단하고 실패 원인을 보고한다.
3. Conventional Commits 접두사로 변경을 분류한다.
4. semver 기준으로 다음 버전을 제안한다 (`package.json`의 `version` 참고).
5. 스킬의 출력 형식에 맞춰 릴리스 노트와 `CHANGELOG.md`에 넣을 `[Unreleased]` 블록을 작성한다.

## 보고 형식

아래 순서와 형식으로 응답한다.

### 1. 분석 범위

- 기준: `{base}` → `HEAD`
- 커밋 수, 변경 파일 요약

### 2. 테스트 결과

- 실행 명령: `npm test`
- 통과/실패 여부

### 3. 버전 제안

```
현재 {current} → 제안 {next} ({이유})
```

### 4. 릴리스 노트

스킬 §3.1 형식의 사용자용 릴리스 노트 전문

### 5. CHANGELOG 항목

`CHANGELOG.md`의 `[Unreleased]`에 추가할 블록

### 6. 다음 단계

- CHANGELOG 반영, `package.json` 버전 bump, 태그·GitHub Release 생성 중 사용자가 원하는 작업을 bullet로 제안한다.

## 금지

- 사용자가 요청하기 전까지 CHANGELOG·`package.json` 수정, 커밋, 태그, 푸시, Release 생성을 하지 않는다.
- 커밋에 없는 변경 내용을 추측해 적지 않는다.
