# SURA 소개서 수정 결과 · 2026-10-27

`kimjingun-stack/sura-bbq-bar` / `feature/profile-v2`. 기존 블랙·골드 디자인과 사진 자산을 유지하면서 한 마스터에서 버전별 HTML을 생성하도록 변경했다. 사용자의 추가 요청에 따라 사진 중심 간략본을 추가했다. 프로덕션 병합·배포 및 Supabase 변경은 하지 않았다.

## 구현한 항목

- 본문: 브랜드 표기, 설립/첫 매장 구분, 이름의 의미, 라이브 그릴 표현, 가치 카드, 한 상 구성, 소스 목록, Chicken Steak 자카르타 표시, 방문 상황, 리뷰 출처줄, 협업 사례, CEO 경력, 조직 기능/조직도 분리, 도시 검토 표시, 연락처 원장 연결.
- Google 평점: CEO의 추가 확정에 따라 5.0 지점 3곳으로 수정. 총 좌석·리뷰 합계와 지점별 원장 일치 검사 추가.
- 상세 보기: 최소 44px 버튼, 섹션/카드 트리거, 매장·메뉴·협업·대표 상세, 해시 직접 열기, 닫기 버튼, ESC, 포커스 복귀·트랩, 배경 inert, 인쇄 시 섹션별 패널 전개.
- 빌드: `data-ver` 정적 제거, 사용 키만 번역 사전으로 포함, 숫자/날짜/연락처 바인딩, null 비노출, 비공개 Fact Sheet 생성.
- 투자: 과거 JV 조건 미사용, 현재 방식은 빈 값, 재무 항목은 데이터 룸 안내. 서버 토큰 검증·404·no-store·noindex·no-referrer. 실제 토큰과 운영 환경변수는 변경하지 않았다.
- 사진 간략본: 표지(떡갈비 근접 사진) → 시그니처 → 라이브 그릴 → 공간 → 지역 협업 → 팀/연락처. 한/영 각 6장 가로 A4 PDF.
- Executive: 메뉴·공간 사진과 브랜드 포지셔닝 / 매장·검증 기준일·하이라이트·파트너 가치·연락처. 한/영 각 2장 세로 A4 PDF.

## 변경 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 원본 섹션 ID를 유지하는 영문 마스터, 버전 태그, 사실 바인딩, 신규 상세 패널 및 간략본 |
| `data/facts.json`, `data/facts.md` | 단일 사실 원장, 자동 생성 Fact Sheet |
| `data/i18n.json` | EN/KO/ID/ZH 사전, 버전 빌드 시 필요한 키만 인라인 |
| `data/confirm-list.md` | 미확정 사실·원문·자산 목록 |
| `assets/profile-details.js` | 모달·공유 해시·접근성·인쇄 동작 |
| `build/build.mjs`, `build/lib.mjs`, `build/check.mjs`, `build/manifest.json` | 정적 빌드·사실/i18n 검사·결과 구성표 |
| `api/investors.mjs`, `vercel.json` | 투자판 서버 토큰 게이트와 공개 출력 분리 |
| `tests/` | 보안/구조 검사, 로컬 서버, 98개 화면 검증, PDF 출력, Vercel 산출물 검증 |
| `.github/workflows/profile.yml` | i18n·사실·빌드·구조/보안 테스트 CI |
| `docs/qa/` | 대표 화면 14장과 검증 결과 JSON |

## 번역 키

- 기존 마스터 사용 키: 244개.
- 수정 마스터 사용 키: 319개.
- 새 키: **91개**, 삭제한 기존 키: 16개.
- 모든 사용 키의 4개 언어 존재 검사 통과. 브랜드 고유 명칭·메뉴 정식 명칭·주소·날짜 등의 원장 값은 공통 사용한다.

## 버전별 구성

| 버전 | URL | 화면 구성 |
|---|---|---|
| General | `/` | 9개 장: cover, story, philosophy, special, signature, guests, ratings(voices/recognition 포함), stores, journey 원칙 |
| Leasing | `/leasing/` | 15개 장: General 기반 + glance, system, partners, leadership, organization, 리싱 부록. 고객 구성/객단가 허용 |
| Investment | `/investors/` | Leasing 15개 장 + 투자 골격 1개. 토큰 없으면 404 |
| Partnership | `/partners/` | 공통 브랜드, stores, 선택 운영 부문, partners, 파트너 가치, 협업 체크리스트 예약 영역: 10개 장 |
| Career | `/careers/` | 공통 브랜드, stores, system, leadership, organization, journey, Grow with SURA: 10개 장 |
| Executive | `/executive/` | 2개 화면 / A4 2장 |
| Visual brief | `/brief/` | 사진 중심 6개 화면 / 가로 A4 6장 |
| Fact Sheet | 공개 URL 없음 | `data/facts.json` + `data/facts.md` |

원본의 16개 앵커 ID는 유지했다. voices와 recognition은 ratings 장 안에 묶어 일반판 분량을 줄였다. 각 빌드 파일은 1MB 미만이며 정확한 크기는 [manifest](../build/manifest.json)에 있다.

## 검증 결과

- `npm run check:i18n`: 사용 키 319개 × 4개 언어, 누락 0.
- `npm run check:facts`: 본문과 번역의 수치 하드코딩 검사 통과. 스타일·SVG 좌표·실행 코드 제외.
- `npm run build`: HTML 7종, Fact Sheet 생성.
- `npm test`: 보안/버전 유출/고유 ID/상세 타깃/사실 전파/원장 합계 검사 6건 통과.
- Playwright: 전체 98개 화면 0 failures. EN/KO 1440·1024·768·390·360, ID/ZH 1440·390. 이미지 누락·가로 넘침·콘솔 오류·키 누락 0.
- 사진/Executive/투자판 최종 수정 후 42개 화면 재검증. 평점 바인딩 정리 후 해당 3개 버전 재검증 결과도 별도 기록.
- 모든 상세 버튼의 Enter 열기, ESC 닫기, 포커스 복귀, 공유 해시, 인쇄 패널 이동 검사 통과.
- PDF: 한/영 사진 간략본 각 6장, 한/영 Executive 각 2장. 전 페이지 렌더링으로 정렬·잘림·여분 페이지를 확인했다.
- Vercel CLI의 preview 대상 로컬 빌드 통과. function `filePathMap`을 복원하여 토큰 없음/오류 404, 유효한 로컬 테스트 토큰 200을 확인. 공개 산출물에 data/private/investment 디렉터리 없음. 원격 프로덕션 배포 결과를 뜻하지 않는다.

[전체 98개 결과](qa/results-98.json) · [최종 42개 결과](qa/results-final-42.json)

## 대표 스크린샷

| 버전 | EN 1440 | KO 390 |
|---|---|---|
| General | [화면](qa/general-en-1440.jpg) | [화면](qa/general-ko-390.jpg) |
| Leasing | [화면](qa/leasing-en-1440.jpg) | [화면](qa/leasing-ko-390.jpg) |
| Investment | [화면](qa/investment-en-1440.jpg) | [화면](qa/investment-ko-390.jpg) |
| Partnership | [화면](qa/partnership-en-1440.jpg) | [화면](qa/partnership-ko-390.jpg) |
| Career | [화면](qa/career-en-1440.jpg) | [화면](qa/career-ko-390.jpg) |
| Executive | [화면](qa/executive-en-1440.jpg) | [화면](qa/executive-ko-390.jpg) |
| Visual brief | [화면](qa/brief-en-1440.jpg) | [화면](qa/brief-ko-390.jpg) |

## 자료가 없어 남긴 부분

이 PR은 **Draft**다. 제공된 Canva는 47페이지의 과거 `SURA Intro&Franchising V2.3（En)의 사본`이며, 지시서가 참조한 20페이지 브리프와 다르다. 다음은 임의 작성하지 않았다.

- 브리프 원문 그대로의 문단·가치 설명·메뉴 상세 설명.
- 대표 인사말 3문단.
- 부록 A 요구사항의 값과 부록 B 체크리스트 9항목 원문.
- 공식 지도 링크·면적·미확정 층/구역·지점 사진.
- 현재 투자 방식, 데이터 룸 PDF, 실제 접근 토큰 설정.
- Grab 증빙, 리뷰별 permalink, 판매량 근거, 공식 연락처 승인.

기존 운영 수치 중 CEO 원장의 명시적 수치로 매핑되지 않은 조각은 `legacy_numeric_claims`에 원문 키와 출처를 보존했다. 모두 같은 facts.json에서 읽지만, 의미별 통합과 승인 확인이 더 필요하다. 새로 검증한 실적처럼 표시하지 않는다. 완전한 원문 반영과 게시 승인은 [확인 목록](../data/confirm-list.md)을 기준으로 이어가야 한다.
