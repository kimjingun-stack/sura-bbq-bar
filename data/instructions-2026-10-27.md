# SURA Brand Profile — Codex 작업 지시서
버전 2026-10-27 · 작성: CEO Office · 적용 저장소: `kimjingun-stack/sura-bbq-bar` (main → Vercel 자동 배포, www.sura-korea.com)

---

## 0. 작업 환경과 규칙

- 현재 `index.html`은 단일 파일 반응형 페이지다. 텍스트는 `data-i18n="키"` 속성과 `<script>` 안의 `window.SURA_I18N = {ko:{}, id:{}, zh:{}}` 사전으로 4개 언어(EN 기본 + KO/ID/ZH)를 전환한다. 영문은 HTML 안에 직접 쓰고, 나머지 3개 언어는 사전에 같은 키로 넣는다.
- 상세 팝업은 `#dlg`(모달) + `#dtStore`(숨김 패널 보관소) 구조다. 열기 트리거는 `data-detail="키"`, 패널은 `<div class="dt" id="dt-키">`. 이 구조를 그대로 확장한다.
- 영상·사진은 `assets/brand/`에 파일로 둔다. HTML에 base64로 넣지 않는다.
- 디자인 시스템(블랙 & 골드, CSS 토큰, 폰트, 간격)은 바꾸지 않는다. 골드는 KPI 숫자·라벨·헤어라인·핵심 단어·버튼에만 쓴다.
- 작업은 `feature/profile-v2` 브랜치에서 하고, 완료 후 PR을 연다. `main`에 직접 푸시하거나 force push 하지 않는다.
- 검증 너비 1440 / 1024 / 768 / 390 / 360. 가로 스크롤 0, 콘솔 오류 0, 4개 언어 모두에서 누락 키 0 (아래 §7 스크립트).
- 사실·숫자는 §6의 `data/facts.json`에서만 가져온다. 본문에 숫자를 직접 타이핑하지 않는다.
- 확인되지 않은 정보는 추정으로 채우지 않는다. `data/confirm-list.md`에 남기고 자리를 비워 둔다. 가상의 후기·실적·수상을 만들지 않는다.

---

## 1. 작업 범위 (3개 과제)

| 과제 | 내용 | 산출물 |
|---|---|---|
| A | 브리프(§2·§3)에 맞춰 본문 수정·보강 | `index.html` 본문 + 4개 언어 사전 |
| B | "자세히 보기" 버튼 체계 — 어디를 누르면 상세가 열리는지 한눈에 보이게 | 버튼 컴포넌트 + 상세 패널 확장 |
| C | Shen 회장 요청 다중 버전 체계 — 하나의 마스터에서 7종 생성 | `data/facts.json`, `build/` 생성 스크립트, 버전별 URL |

---

## 2. 결정 우선순위와 충돌 정리 (반드시 먼저 읽을 것)

브리프 원고(2026-10 「SURA 브랜드 소개서 제작 브리프 및 본문 원고」)와 CEO가 이번 달 확정한 사항이 다른 곳이 있다. **원칙: CEO 확정 사항 > 브리프 > 기존 V7 소개서.** 아래 표의 "적용" 열대로 처리하고, 바꾸고 싶으면 CEO가 표만 고치면 된다.

| # | 항목 | 브리프 | CEO 확정 | 적용 |
|---|---|---|---|---|
| 1 | 브랜드 표기 | "SURA Stylish BBQ Bar" 유지, 설명문 "Korean Hamburg Steak & Live Grill Dining" | "SURA — Korean Hamburg Steak"로 통일 | **CEO.** 표지·헤더·푸터는 `SURA / Korean Hamburg Steak`. 02페이지 본문 한 줄에만 "Korean Hamburg Steak & Live Grill Dining"을 설명문으로 허용 |
| 2 | 시작 연도 | 2024년 첫 매장 (2023 대표 이전과 구분) | 2023 설립 · 2024.9 1호점 | **둘 다 충족.** "Founded 2023 · First store September 2024"로 표기. "2023년부터 운영"이라고 쓰지 않음 |
| 3 | 시그니처 메뉴 | Wagyu Hamburg · Royal Tteokgalbi · Chicken Steak(수라바야 미판매) | Wagyu Steak · Tteokgalbi · Cheese Wagyu Steak 세트 Rp 209,000 | **CEO.** 세트 3종 유지. Chicken Steak는 "추가 대표 메뉴"로 별도 카드, "자카르타 매장 판매"로 표기. 가격에는 "1세트 기준 · 세금·서비스료 포함 여부" 각주 — 포함 여부는 확인 목록 |
| 4 | 식재료 표현 | 승인된 사양만 (와규 등급·원산지 추정 금지) | 100% 와규("Japanese" 금지), 자포니카 쌀, 오메가3 계란, 기성 제품 미사용 | **CEO 문구 유지.** 단 "Omega-3"에 건강 효능을 붙이지 않음. 사양 확인은 목록에 |
| 5 | 타깃 고객 | 25~40 여성·커플·친구·가족, 비율로 쓰지 않음 | 25~45 여성·다세대 가족·화교·무슬림 10~20%·객단가 230~260K | **버전별 분리.** 일반판(V1)은 브리프대로 비율 없이; 리싱판(V2)·투자판(V3)에는 객단가와 고객 구성 유지 |
| 6 | 매장명 | Lotte Shopping Avenue | Lotte Mall | **"Lotte Mall Jakarta"** (구글 등록명 기준). 확인 목록에 공식 명칭 1건 |
| 7 | 웹사이트 | surafromkorea.com | — | **sura-korea.com** (실제 도메인) |
| 8 | 라이브 키친 범위 | 그릴·완성 장면만. 전처리·CK까지 고객 앞이라고 쓰지 않음 | 전 과정을 고객이 봄 | **브리프 기준으로 문구 조정:** "From grilling and torching to plating" — "preparation"이라는 단어 제거 |
| 9 | 중앙주방 범위 | 모든 원재료·메뉴 생산으로 추정 금지 | 소스·양념·반찬·디저트 생산 | CEO 문구 유지. "모든 메뉴"라는 표현 금지 |
| 10 | 할랄 | 인증 획득 기재 금지 | 준비하지 않음 | 일치. 어디에도 할랄 언급 없음 |
| 11 | 누적 판매 100만 | 스테이크 개수, 증빙 후 사용 | — | 증빙 전까지 **비노출.** facts.json에 `steaks_sold: null`로 두고 값이 들어오면 자동 노출 |
| 12 | 리뷰 인용 | 원문·링크·지점·수집일 필수 | 원문 6개 사용 | 각 카드에 "Google · Lotte Mall · 2026-10-26" 출처줄과 구글 지도 링크 추가 |
| 13 | 조직 | 기능 6개 간결 소개 | 조직도(점장 5명 실명, 나머지 직함) | **버전별 분리.** V1·Executive는 기능 6개 리스트, V2·V5는 조직도 |
| 14 | 운영 시스템 | 시행 중인 것만. 구축 과제를 완성으로 쓰지 않음 | Manager 앱·CK·마케팅·HR·재무·Fitout | 유지하되 각 항목 옆에 `status: live` 확인. 확인 안 된 항목은 확인 목록 |
| 15 | 연락처 | 승인된 사업 창구 | CEO 직통 | **확인 목록.** 승인 전까지 CEO 이메일·WhatsApp 유지 |
| 16 | 투자 방식 | 부록 C: 기존점 실적과 신규점 가정 분리, 지분·협상 내용 비공개 | 과거 JV 안(55:45 등)은 변경됨 | **과거 숫자 전부 삭제.** §5-C 참조. 현재 방식은 CEO·Chairman 확인 전까지 자리만 둠 |

---

## 3. 과제 A — 본문 수정 (섹션별)

기존 16개 섹션 id를 유지하고, 브리프의 20페이지 원고를 아래처럼 흡수한다. 괄호 안은 브리프 페이지 번호. 영문 마스터를 쓰고 KO/ID/ZH는 사전에 추가한다 (한국어 원고는 브리프 문장을 그대로 쓴다).

| 섹션 id | 변경 |
|---|---|
| `cover` (P01) | 라벨 `BRAND PROFILE · OCTOBER 2026` 유지. 부제 `Korean Hamburg Steak`. 태그라인 `The Taste of Happiness Crafted with Care.` 아래 한국어판에서만 보조 문구 "정성으로 빚은 행복의 맛" 1줄 추가 (`data-i18n="cover.sub.ko"`, EN/ID/ZH는 빈 값 → 숨김) |
| `glance` (P02) | 헤드라인 추가: "Where Korean grill meets a table set with care." / 한국어 "한국식 그릴 요리와 정성스러운 한 상이 만나는 곳." 본문 1문단(브리프 P02) 추가. KPI 6개 유지. 노출 숫자는 facts.json |
| `story` (P03) | 제목 "The meaning in our name" / "이름에 담긴 마음". 본문을 브리프 P03으로 교체 (수라 = 임금께 올리는 식사 → 오늘의 식탁). **궁중 레시피 계승·재현 표현 삭제.** "once served to royalty" 문구 제거 |
| `philosophy` (P04) | 인용문 유지. 아래에 **4가지 가치 카드** 추가: Care / Enjoyment / Hospitality / Consistency (브리프 표 그대로). 기존 Belief/Vision 2열은 Vision만 남기고 Belief는 가치 카드로 대체 |
| `special` (P09·P10) | 카드 1 "Live Grill": 문구를 §2-8대로 조정. 카드 2 "Ingredients" 유지. 카드 3 "Space": 브리프 P10 문구 — 바 좌석과 함께 식사하는 좌석, 매장마다 다른 좌석·시설을 공통으로 쓰지 않음 |
| `signature` (P06·P07·P08) | 세트 3종 + 가격 유지. **새 서브블록 2개 추가**: ① "The SURA Table" — 메인·밥·국·반찬(김치·감자샐러드·매실토마토·허니펌킨)·소스·계란 구성표 (브리프 P07), 밥·국 리필만 명시 ② "Six sauces" — 소금&마늘 / 쌈장 / 유자마요 / 삼발 / 매콤 시즈닝(정식 명칭 확인 목록: 기존 기록 "Ganfen") / 6번째 명칭 확인. Chicken Steak는 추가 메뉴 카드 + "Jakarta stores" 표기 |
| `guests` (P05) | 헤드라인 "A day you want a good meal together." 본문 브리프 P05. 방문 상황 4행 표(핵심 타깃·친구/커플·가족·혼자/둘) 추가. **V1에서는 비율·객단가 숨김**, V2·V3에서만 표시 (`data-ver="leasing investment"` 속성으로 제어, §5) |
| `ratings` (P14) | 표 유지 + 각주에 "Verified 2026-10-26 · Google Maps" + 매장별 지도 링크. 누적 판매 100만은 facts.json 값이 있을 때만 렌더 |
| `voices` (P14) | 카드마다 출처줄 "Google Review · {store} · 2026-10-26" + 링크. 번역 병기 유지 |
| `recognition` (P18) | 유지. 유료 협찬 콘텐츠와 독립 매체를 구분: TikTok·Threads 행에 "creator content" 명시, Grab·detikFood·What's New는 "media & platform" |
| `stores` (P12·P13) | 카드에 층·구역·지도 링크 추가 (facts.json). 사진 슬롯 5개는 비어 있으면 "사진 자리" 라벨 유지. 수라바야 성과 밴드 유지 |
| `system` (P11·P16) | 현행 구조 유지. 서비스 표준 카드의 6단계 유지 + 브리프 P11 "고객 경험의 흐름" 5단계는 상세 팝업 상단에 요약으로 추가. 각 부문 카드 상단에 아주 작은 라벨 "In operation" (facts.json `status`) |
| `partners` (P17) | Bu Rudy 카드에 브리프 P17 본문(서로의 맛과 문화를 존중하는 만남)과 사례표(Partner / Pairing / Guest Experience / Shared Value) 상세 팝업 추가. **촬영 예정 영상은 언급 금지** |
| `leadership` (P15) | CEO 소개를 브리프 P15 원고로 교체 (2008 해외 외식업 → 2023 인도네시아 → 2024 SURA). "6개 브랜드 1위" 문구는 확인 전까지 삭제. **대표 인사말** 3문단을 상세 팝업으로 추가 (인용 표시 없이 "Message from the Founder"). Chairman 소개 유지 |
| `organization` | V1·Executive: 기능 6개 리스트(브랜드·메뉴 / 매장 운영·서비스 / 중앙주방·공급 / 마케팅·고객 경험 / 출점·공간 기획 / 경영 지원). V2·V5: 현행 조직도 |
| `journey` (P12·P19·P20) | 타임라인 유지. "Expansion principle" 유지. 도시 목록은 facts.json `expansion.under_review`에서 가져오되 **"검토 중"으로 표기**, 확정 계약이 있는 도시만 "확정". 파트너 가치 4개(명확한 메뉴 정체성 / 공간에서 경험하는 매력 / 다점포 운영 경험 / 협업을 통한 고객 접점) 블록 추가. 푸터 연락처는 facts.json |

새로 필요한 i18n 키는 `섹션.항목` 규칙을 따른다 (예: `phil.v1.t`, `sig.table.rice`, `gu.row2.who`). 모든 새 키는 4개 언어 모두 채운다.

---

## 4. 과제 B — "자세히 보기" 버튼 체계

현재 문제: 카드 전체가 클릭 영역이고 하단에 작은 골드 텍스트 "Details"만 있어 누를 수 있다는 것이 드러나지 않는다.

### 4.1 버튼 컴포넌트
- 공통 클래스 `.btn-more`: 높이 44px, 좌우 패딩 18px, 1px 골드 테두리(`rgba(212,175,103,0.55)`), 투명 배경, 골드 텍스트 13px/600/자간 0.06em, 라운드 999px, 우측에 화살표 아이콘. Hover: 배경 `rgba(212,175,103,0.12)`, 테두리 골드 100%. Focus-visible 링 유지. 터치 영역 44×44 이상.
- 라벨은 i18n: EN `See details` / KO `자세히 보기` / ID `Lihat detail` / ZH `查看详情`.
- 카드 안에서는 항상 **카드 하단 왼쪽**, 본문과 16px 간격. 카드 전체 클릭은 유지하되 커서 포인터는 버튼에만.
- 섹션 단위로 긴 원고가 있는 곳(`story`, `signature`, `guests`, `stores`, `partners`, `leadership`, `journey`)은 섹션 헤더 오른쪽(모바일은 헤더 아래)에 `.btn-more.btn-more--section` "전체 내용 보기 / Read the full story"를 둔다.
- 섹션 12 인트로의 "Tap any card for details" 문장은 삭제한다 (버튼이 대신한다).

### 4.2 상세 패널 추가 (기존 9개 + 아래 신규)
| 트리거 | 패널 id | 내용 |
|---|---|---|
| story 섹션 버튼 | `dt-story` | 이름의 의미 전문 + 보조 메시지 |
| signature 세트 카드 | `dt-sig-set` | 3종 메뉴 각 설명(브리프 P06) + 즐기는 법 |
| signature "The SURA Table" | `dt-sig-table` | 한 상 구성표 전체 + 리필 범위 |
| signature "Six sauces" | `dt-sig-sauce` | 소스 6종 설명 + Bu Rudy 삼발은 기간 한정 협업으로 구분 |
| guests 섹션 버튼 | `dt-guests` | 방문 상황 4행 표 |
| stores 카드 5개 | `dt-store-{id}` | 매장명·몰·도시·층/구역·오픈·좌석·지도 링크·대표 사진·(V2만) 면적 |
| partners 카드 2개 | `dt-partner-spikoe`, `dt-partner-burudy` | 사례표 + 기간 + 제공 방식 |
| leadership CEO 카드 | `dt-ceo` | 경력 전문 + 대표 인사말 |
| journey 섹션 버튼 | `dt-journey` | 연혁 표 + 파트너 가치 4개 전문 + 검토 도시 |

### 4.3 모달 동작
- 열릴 때 `#dlg` 상단 라벨을 섹션명으로, 제목을 패널의 `[data-dt-title]`로 채운다 (현행 로직 유지).
- 패널 하단에 "닫기" 보조 버튼(`.btn-more`, 모바일에서 엄지 닿는 위치) 추가. ESC·바깥 클릭 유지.
- URL 해시 `#detail=키`로 직접 열리게 하고 닫으면 해시 제거 (공유 링크용).
- 인쇄 시 모든 패널을 해당 섹션 끝에 펼쳐서 출력 (`@media print`에서 `#dtStore`를 표시하고 섹션 순서대로 이동).

---

## 5. 과제 C — 다중 버전 체계 (Shen 회장 요청)

하나의 디자인 마스터와 하나의 사실 원장에서 7종을 생성한다. 버전마다 따로 만들지 않는다.

### 5.1 버전 정의
| 코드 | 이름 | 독자 | 분량(화면 기준 섹션 수) | 우선 | URL |
|---|---|---|---|---|---|
| `general` | Brand Profile — General (V1) | 고객·언론·일반 파트너 | 8~10 | P1 | `/` (홈페이지 기본) |
| `leasing` | Leasing Profile (V2) | 몰 리싱·상업 부동산 | 14~16 (현행 전체) | P1 | `/leasing/` |
| `investment` | Investment Profile (V3) | 단일점·전략·재무 투자자 | 14~18 | P1 | `/investors/` — `noindex`, 토큰 링크, 재무 수치는 본문에 넣지 않고 별도 PDF 첨부 |
| `partnership` | Partnership Profile (V4) | 공급사·협업 브랜드 | 8~10 | P2 | `/partners/` |
| `career` | Career Profile (V5) | 임원·지역 매니저·핵심 인재 | 8~10 | P2 | `/careers/` |
| `executive` | Executive Profile | 첫 상담·WhatsApp·이메일 | 2 화면 | P1 | `/executive/` + A4 2장 PDF |
| `factsheet` | Brand Fact Sheet | 내부 단일 자료 | — | P1 | `data/facts.json` + `data/facts.md` 자동 생성 (비공개) |

### 5.2 구현 방식
- 섹션·카드·문단에 `data-ver="general leasing ..."` 속성을 둔다. 속성이 없으면 모든 버전에 표시. 빌드 스크립트(`build/build.mjs`, Node)가 버전별로 DOM을 잘라 `dist/{version}/index.html`로 출력한다. 런타임 JS로 숨기지 않는다 (소스 보기로 다른 버전 내용이 노출되면 안 됨).
- 버전별 표지 라벨: `BRAND PROFILE` / `LEASING PROFILE` / `INVESTMENT PROFILE` / `PARTNERSHIP PROFILE` / `CAREER PROFILE` / `EXECUTIVE PROFILE` + 공통 `OCTOBER 2026`.
- 모든 버전 푸터에 `버전 코드 · v{semver} · Updated {facts.updated_at} · Owner {facts.owner[version]}` 를 작게 표기한다.
- Vercel 설정: `vercel.json`에 `/leasing` 등 경로를 `dist/` 하위로 라우팅. `/investors/`는 `X-Robots-Tag: noindex` 헤더 + `?k=토큰` 없으면 404.
- 언어 4개는 모든 버전에 공통. 단 `investment`는 EN·ZH 우선, `career`는 EN·ID 우선 — 나머지 언어도 키는 채운다.

### 5.3 버전별 모듈 구성
공통(모든 버전): cover · story · philosophy · special · signature · stores(요약) · contact

| 버전 | 추가 모듈 | 제외 |
|---|---|---|
| general | guests(비율 없음) · ratings · voices · recognition · journey(원칙만) · 조직 기능 6개 | system 상세, 객단가, 조직도, 투자 |
| leasing | glance KPI 전체 · guests(객단가·구성 포함) · ratings · voices · recognition · stores 상세(층·면적·좌석) · 수라바야 회전율 · system 전체 · partners · organization 조직도 · journey(도시·원칙) · **부록 A 리싱 요구사항 표** (브리프 §4-A 표를 그대로 섹션화: 입지·공간·도면·전력·배기·기타·운영·실적·협의 조건) | 투자 |
| investment | leasing 전체 + **투자 섹션**(§5-C) + 리스크·실행 체계 + 데이터 룸 안내 | 없음 |
| partnership | stores · system(CK·마케팅·구매) · partners 사례 2개 · **협업 제안 체크리스트 9항목**(브리프 §4-B) · 파트너 가치 4개 | ratings 세부, 조직도, 투자 |
| career | philosophy 가치 4개 · system(HR·교육·승진 경로·서비스 표준) · organization 조직도 · stores · journey · **"Grow with SURA"** 블록(온보딩·30일·분기 교육·내부 승진, 급여·승진 약속 금지) | 객단가, 투자, 리싱 요구사항 |
| executive | 화면 1: 포지셔닝 한 줄 + 세트 메뉴 사진 + 대표 매장 사진 / 화면 2: 매장 지도 5개 · 핵심 하이라이트 4개(평점·리뷰 수·Grab·수라바야 회전율) · 협업 방향 · 연락처 | 그 외 전부 |

### 5.4 투자판(V3) 투자 섹션 — 현재 방식 반영 지침
- 과거 Canva 버전·2026년 4~5월 JV 제안서의 숫자(총투자 3B, 55:45 출자, 65:35 지분, 로열티 0, EBITDA 전액 배분, 회수 945 juta, Plan A/B, 회수 10~16개월 등)는 **전부 삭제**한다. 어떤 수치도 재사용하지 않는다.
- 섹션 골격만 만든다 (브리프 §4-C + Shen 플랜 V3 목록):
  1. Market opportunity 2. Business model 3. Unit economics (기존점 실제 실적 — 기간·매장·세금 포함 기준 명시) 4. New-store investment model (신규점 가정, 기존점 실적과 분리) 5. Profitability & payback (가정 명시) 6. Standardization & replicability 7. Expansion strategy 8. Management 9. Capital requirement & return scenarios 10. Governance & reporting 11. Execution risks
- 각 항목의 숫자 칸은 `facts.json → investment.*`에서 읽고, 값이 `null`이면 "Available in data room" 문구로 렌더한다.
- **현재 투자 방식 입력란**(CEO·Chairman 확인 후 채움): `investment.model_summary` — 예: "신규 출점은 직영 우선, 도시·파트너별 JV는 개별 협의" 같은 한 문단. 확인 전에는 비워 둔다.
- 민감 수치(지분·협상 조건·개별 투자자 조건)는 어떤 버전에도 넣지 않는다. 별도 PDF(데이터 룸)만.

---

## 6. 사실 원장 `data/facts.json` (단일 출처)

```json
{
  "version": "2026.10.1",
  "updated_at": "2026-10-27",
  "owner": {"general":"Marketing","leasing":"CEO Office","investment":"Chairman","partnership":"Marketing","career":"HR","executive":"CEO Office"},
  "brand": {"name":"SURA","category":"Korean Hamburg Steak","tagline":"The Taste of Happiness Crafted with Care.","tagline_ko":"정성으로 빚은 행복의 맛","founded":2023,"first_store":"2024-09","entity":"PT. SURA AND BIXI RESTAURANT MANAGEMENT","website":"https://www.sura-korea.com","positioning":"Premium Korean Dining"},
  "kpi": {"stores":5,"seats":376,"staff":140,"google_reviews":21896,"google_avg":4.98,"stores_at_5":4,"reviews_verified_at":"2026-10-26","grab_award":{"title":"Top 10 Most Favorite Asian Dining","year":2026,"evidence":null},"steaks_sold":null,"members":50000,"instagram":16000,"tiktok":19000,"target_2027_stores":15},
  "stores": [
    {"id":"puri","name":"Lippo Mall Puri","city":"Jakarta","area":"West Jakarta","opened":"2024-09","seats":100,"floor":null,"zone":null,"map":"https://maps.google.com/?cid=...","rating":5.0,"reviews":10127,"manager":"Imam"},
    {"id":"lotte","name":"Lotte Mall Jakarta","city":"Jakarta","area":"South Jakarta","opened":"2024-10","seats":58,"floor":null,"zone":null,"map":"","rating":4.9,"reviews":6822,"manager":"Yazid"},
    {"id":"gandaria","name":"Gandaria City","city":"Jakarta","area":"South Jakarta","opened":"2025-09","seats":80,"floor":null,"zone":null,"map":"","rating":5.0,"reviews":2664,"manager":"Deka"},
    {"id":"smkg","name":"Summarecon Mall Kelapa Gading","city":"Jakarta","area":"North Jakarta","opened":"2025-10","seats":80,"floor":null,"zone":null,"map":"","rating":5.0,"reviews":2064,"manager":"Intan"},
    {"id":"pakuwon","name":"Pakuwon Mall Surabaya","city":"Surabaya","area":"Surabaya","opened":"2026-09","seats":58,"floor":"2F","zone":null,"map":"","rating":4.8,"reviews":219,"manager":"Ronal","turns_per_day":"6–9","turns_period":"5 weeks since opening"}
  ],
  "menu": {"signature_set":{"items":["Wagyu Steak","Tteokgalbi","Cheese Wagyu Steak"],"price_idr":209000,"tax_included":null},"additional":[{"name":"Chicken Steak","stores":"Jakarta"}],"sauces":["Himalayan Salt & Garlic","Ssamjang","Yuzu Mayo","Sambal","Spicy seasoning (confirm name)","(confirm 6th)"],"sides":["Kimchi","Potato salad","Maesil tomato","Honey pumpkin"],"refill":["Rice","Soup"],"egg":"Omega-3 egg"},
  "guests": {"core":"Women 25–45, couples, friends, families","muslim_share":"10–20%","avg_spend_idr":"230,000–260,000","show_in":["leasing","investment"]},
  "operations": {"divisions":[{"id":"fin","status":"live"},{"id":"mk","status":"live"},{"id":"hr","status":"live"},{"id":"ck","status":"live","sites":["Jakarta","Surabaya"]},{"id":"fit","status":"live"}],"manager_app":{"status":"live","features":["daily_reports","ai_reviews","new_store_prep","menu_dev","ai_marketing","chat_translation"]}},
  "partners": [{"name":"Spikoe Resep Kuno","period":"2026-10","city":"Surabaya"},{"name":"Sambal Bu Rudy","period":"2026-11 – 2027-01","city":"Surabaya"}],
  "expansion": {"principle":"Enter each city through its single most influential mall first.","under_review":["Medan","Bali","Semarang","Bandung","Batam","Balikpapan"],"confirmed":[],"overseas":"in preparation"},
  "investment": {"model_summary":null,"unit_economics":null,"new_store_model":null,"payback":null,"capital_requirement":null},
  "contact": {"name":"Kim Jingun","title":"CEO & Founder","email":"kimjingun@sura-korea.com","whatsapp":"+62 812-9523-9210","approved":false}
}
```

빌드 시 `facts.json` → 모든 버전의 숫자·매장 카드·연락처·푸터 메타를 채운다. `data/facts.md`(사람이 읽는 Fact Sheet)도 같은 스크립트가 생성한다.

---

## 7. 검증과 완료 조건

- `npm run check:i18n` — HTML의 모든 `data-i18n` 키가 ko/id/zh 사전에 존재하는지 검사. 누락 0.
- `npm run check:facts` — 본문에 `facts.json` 밖의 숫자(정규식 `\d{2,}`)가 하드코딩되어 있으면 실패. 예외: 연도·주소·전화.
- `npm run build` — `dist/{general,leasing,investment,partnership,career,executive}/index.html` 생성. 각 파일 크기 1MB 이하(자산 제외).
- Playwright 스크린샷: 버전 6개 × 너비 5개 × 언어 4개 중 최소 EN·KO 전수, ID·ZH는 1440·390. 가로 스크롤 0, 콘솔 오류 0.
- 모든 `.btn-more`가 키보드로 열리고 ESC로 닫힘. `#detail=키` 링크로 직접 열림.
- 인쇄(PDF 저장)에서 상세 패널이 펼쳐져 출력됨. Executive는 A4 2장에 맞음.
- `data/confirm-list.md` 생성 — 아래 §8 항목 + 작업 중 발견한 미확인 사항.
- PR 설명에: 바뀐 섹션 목록, 새 i18n 키 수, 버전별 섹션 구성표, 스크린샷 링크, 확인 목록 링크.

---

## 8. 내부 확인 목록 (초기값 — CEO가 채움)

1. 시그니처 세트 Rp 209,000의 세금·서비스료 포함 여부
2. 소스 6종의 정식 메뉴판 명칭 (특히 매콤 시즈닝 "Ganfen"과 6번째)
3. 와규·쌀·계란 사양 — 공급사 서류 기준 표기 확인
4. Chicken Steak 판매 매장 (수라바야 미판매 여부)
5. 매장별 층·구역, 공식 지도 링크, 면적(V2용)
6. Lotte 매장 공식 표기 (Lotte Mall Jakarta / Lotte Shopping Avenue)
7. Grab Top 10 2026 — 증빙 이미지·링크
8. 누적 스테이크 판매 100만 — 집계 기간·포함 메뉴·기준일
9. 사업 문의 공식 창구(담당자·이메일·WhatsApp) 승인
10. 투자판 `investment.model_summary` — 현재 투자 방식 한 문단 (CEO·Chairman)
11. CEO 경력 중 "중국 6개 브랜드" 표현 사용 여부
12. 운영 시스템 각 항목의 `status`(live/building) 확인
13. 매장 대표 사진 5장, 한 상 전체 사진, 그릴 조리 사진, Bu Rudy 협업 사진·로고 사용 승인
14. 표지 영상의 "Stylish BBQ Bar" 로고 자막 교체본

---

## 9. 작업 순서

1. `data/facts.json` 작성 → 현행 `index.html`의 하드코딩 숫자를 facts 참조로 치환 (과제 A의 기반)
2. 과제 B 버튼·패널 (현행 레이아웃에서 먼저 완성, 스크린샷 확인)
3. 과제 A 본문 수정 + 4개 언어 사전
4. 과제 C 빌드 스크립트와 `data-ver` 태깅 → `executive`·`general`·`leasing` 먼저, 이어서 `investment` 골격, `partnership`·`career`
5. 검증 §7 → PR

완료 보고는 한국어로, 변경 파일·새 키 수·버전별 섹션 구성·스크린샷·확인 목록을 포함한다.