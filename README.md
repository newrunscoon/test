# cursor-demo

사용자 데이터에서 이메일을 추출·검증하는 Node.js 유틸리티 프로젝트입니다.

## 릴리스 노트

### v1.1.0 (2026-06-09)

사용자 데이터에서 이메일을 추출·검증하는 유틸리티와 공통 검증 모듈을 추가했습니다.

#### ✨ 기능

- **이메일 유틸** (`src/email.js`)
  - `extractEmails` — 사용자 배열에서 이메일 주소 추출
  - `isValidEmail` — RFC 5322 형식 검증
  - `getValidEmails` — 유효한 이메일만 반환
- **검증 유틸** (`Docs/validator.js`)
  - `filterValid` — 검증 통과 항목만 필터링
  - `partitionValid` — 통과·실패 항목 분리
- **진입점** — `src/index.js`에서 `getValidEmails` export
- **테스트** — `npm test`로 8건 단위 테스트 실행

#### 🧹 기타

- `package.json`을 ES Modules(`"type": "module"`)로 전환
- `npm test` 스크립트 추가

## 사용법

```bash
npm test
```

## 변경 이력

자세한 변경 내역은 [CHANGELOG.md](./CHANGELOG.md)를 참고하세요.
