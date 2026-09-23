# SRC-KR-KRDS — KRDS (Korea Design System) / 디지털 정부서비스 UI/UX 가이드라인

- Authority: Republic of Korea, Ministry of the Interior and Safety (행정안전부, MOIS), 공공서비스혁신과. The site footer names MOIS as copyright holder. The National Information Society Agency (한국지능정보사회진흥원, NIA) runs the system: the contact address is krds@nia.or.kr, and the community page lists NIA and MOIS contacts plus a helpdesk contractor.
- Canonical URL: https://www.krds.go.kr/html/site/index.html is the living design-system site (the title reads "KRDS - Korea Design System"). The guideline PDF is distributed from the ministry itself: the MOIS 정보화 표준·지침 자료실 post is https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000045&nttId=120220, and the same notice appears on the 알립니다 board at nttId=120169. The KRDS resources page (https://www.krds.go.kr/html/site/outline/outline_05.html) links each PDF version to KRDS board posts (community_01_01.html?nttId=9, 3 and 2), but those post bodies are script-rendered and did not extract.
- Version / date: the current guideline is 「디지털 정부서비스 UI/UX 가이드라인」 수정본 ('25.8.), labelled "수정본, 2025년 8월 기준". MOIS distributed it by 공공서비스혁신과-2124호 on 2025-08-29 (알립니다 board). The 자료실 post is dated 2025-09-01. Its attachment is a zip containing the guideline and a 변경대비표 (change comparison table). The KRDS resources page lists three guideline versions (2025년 8월, 2024년 7월, 2024년 2월) and prints a change note beside each:
  - 2025.08: components revised, and the service-pattern usability guidelines revised.
  - 2024.07: components added, plus a note about a government official-site search service being discontinued. Its meaning is unclear (see Uncertainties).
  - 2024.02: components added.
  The companion resources on the same page are:
  - Figma library v1.0.0 (no date printed beside it);
  - Sketch/XD design resources dated 2025-01-15;
  - HTML Component Kit v1.1.0, updated 2026-01-13 (adds a voice-support component; earlier releases v1.0.6 on 2025-09-01 and v1.0.5 on 2025-04-22). The GitHub package.json also reads version 1.1.0;
  - React and Vue Storybooks (/storybook/react, /storybook/vue; versions not read);
  - the KRDS-Guide-Checklist (hwp).
- Source status: CURRENT. The MOIS 정보화 표준·지침 자료실 list was read on 2026-09-23. Its newest entry is dated 2026-09-11, and the most recent UI/UX guideline post is still the 2025-09-01 수정본 notice. A web search for a 2026 revision found none. The KRDS resources page also lists 2025년 8월 as the newest version.
- Superseded by / supersedes: supersedes the 2024.07 and 2024.02 versions of the same guideline. MOIS first distributed the guideline on 2024-02-29, per the MOIS 참고자료 post nttId=108578 (registered 2024-04-12, attachment "디지털 정부서비스 UIUX 가이드라인(2024.02).zip"). The predecessor document is 「전자정부 웹사이트 UI·UX 가이드라인」, distributed by MOIS 정보자원정책과 on 2019-03-21 (자료실 nttId=69451). That post recommended applying the guideline (준용 권장). No official page read this session says in so many words that the 2024 guideline replaced or abolished the 2019 guideline (see Uncertainties).
- License / access: free public access. No login is needed for the site or the MOIS downloads. The site footer reads "© 2023 Ministry of the Interior and Safety. All rights reserved." The KRDS copyright-policy page (/html/site/utility/utility_06.html) is linked, but its body is script-rendered and returned no text. So the 저작권법 제24조의2 / 공공누리 (KOGL) terms were not read at the page. A search-engine snippet attributes an attribution-based free-use statement under 제24조의2 to that page, but it is unverified and is not recorded as fact. The two code-licence statements in the HTML Component Kit repository (github.com/KRDS-uiux/krds-uiux, linked from the site) disagree:
  - the README says the package follows the KRDS terms of use (이용약관) and points to the copyright page;
  - package.json declares "ISC".
  The korea.kr launch press release carries 공공누리 제1유형 (출처표시) for its text only. That licence covers the press release, not KRDS. Until the terms are confirmed, store only metadata, structure and paraphrase; do not quote at length.
- Verified on: 2026-09-23. The canonical site, the guideline-introduction page (utility_07), the government-officials page (outline_04), the resources page (outline_05), the digital-inclusion page (utility_04), the design principles (utility_02), the style introduction, colour and typography pages (style_01–03), the component, basic-pattern and service-pattern summaries, one service-pattern page (service_03_04) and one basic-pattern page (global_07) were all read at krds.go.kr. The version, date and distribution notice were read at mois.go.kr. The 고시 name, number and dates were read at law.go.kr and mois.go.kr.
- Tier: T2 (official government guidance). It is not T1 in this note because the binding instrument's article text was not read (see "Legal basis" below).
- Domains served: UX-FORMS, UX-NAVIGATION, UX-SEARCH, UX-COMPONENTS, VIS-TYPOGRAPHY, VIS-COLOR, OTH-DESIGN-SYSTEM (lead decision 2026-09-23). Proposed but not listed yet: UX-STATES, UX-HELP (thinner evidence); optional VIS-CONTRAST, UX-DESTRUCTIVE-ACTIONS, UX-CONTENT-MICROCOPY. The case for each is under Cross-references.
- Proposed rule prefix: `KRDS` (maps to SRC-KR-KRDS). The web pages show no public item numbering (see Structure), so identifiers are section slugs plus a sequence, for example `KRDS-style-typography-001` or `KRDS-service-login-001` (`docs/rule-schema.md` §3).

## Scope and applicability

- Purpose, per the guideline-introduction page (utility_07): improve user experience through consistent UI/UX criteria, give a method for UX improvement, and cut development and rework cost through shared criteria.
- Who it binds, as stated by the authority:
  - The introduction page says all websites and mobile web/apps that administrative or public institutions build or operate must follow the principles and the detailed style, component, basic-pattern and service-pattern guidance when designing and implementing UI/UX. The key phrase is "준수하여 … 설계 및 구현해야 한다".
  - Target institution types: 중앙행정기관 (대표), 중앙행정기관 (운영 서비스·시스템), 공공기관 (대표·운영 서비스·시스템), and 지방자치단체.
- Legal basis as stated by the authority (read at official pages; the article text itself was not read):
  - The introduction page says the guideline sets out the UI/UX details that administrative and public institutions must comply with under three instruments: 「전자정부법」, 「행정기관 및 공공기관 정보시스템 구축·운영 지침」 and 「전자정부 웹사이트 품질관리 지침」. No article numbers are given.
  - The MOIS 2024.02 post (nttId=108578) cites 「전자정부웹사이트품질관리지침」 (행정안전부고시 제2021-19호, 2021.2.27.) as its basis. It says institutions must comply with the government-wide UI/UX common guide when designing and implementing UI/UX for website quality management ("준수하여야함").
  - The current version of that 고시 is 행정안전부고시 제2025-46호, issued and effective 2025-06-25 (law.go.kr 행정규칙 page, admRulId=42433; MOIS 훈령·예규·고시 post nttId=118636).
  - The MOIS amendment notice says the technical quality-diagnosis criteria were removed from the 고시 annex and delegated to guides, naming the 전자정부 웹사이트 품질관리 가이드 and the 디지털정부서비스 UI/UX 가이드라인.
  - The 2025.08 distribution notice asks institutions to use ("활용하시기 바랍니다") the revised guideline in public website and mobile-app UI/UX work.
  - The article of 고시 제2025-46호 that points to the UI/UX guideline was not read: the law.go.kr body is script-rendered, and the MOIS PDF download failed with a header parse error. The 「전자정부법」 article and the 「행정기관 및 공공기관 정보시스템 구축·운영 지침」 provision were also not read.
- Conformance model, from the government-officials page (outline_04):
  - Service-pattern usability guidance has three application levels:
    - 필수 (Do): non-compliance causes task failure the user cannot resolve alone.
    - 권장 (Better): compliance raises satisfaction for more users; non-compliance makes the task harder but does not cause failure.
    - 우수 (Best): compliance can raise satisfaction greatly; non-compliance causes inconvenience.
  - Institutions verify themselves with the KRDS self-verification checklist. The procedure has four steps: 검증 준비, 검증 수행, 검증 결과서 작성 and UI/UX 품질 개선.
  - The result summary uses the three outcomes 준수 / 미준수 / 해당 없음. The service's own operators perform the verification. The page names no submission body.
- Style application model, from the style introduction (style_01):
  - 표준형 (standard) style: every style element and rule is mandatory. It applies to institutions that display the government emblem (central ministries, special regional offices and their subsidiaries), for main and operational sites and mobile web/apps.
  - 확장형 (extended/adaptive) style: institutions with their own logos follow the usage rules but may adapt colour, typography, shape, layout, icons and elevation to their identity. The fetch reported that accessibility and contrast requirements stay fixed; that was a tool summary, not a verbatim quote.
- Jurisdiction: KR. Platforms: web, mobile web, and mobile apps (the component set includes mobile-only components). Audience: Korean administrative and public institutions. For other audits it is a reference design system.
- Accessibility baseline, as stated by the authority:
  - The digital-inclusion page (utility_04) says KRDS components follow KWCAG 2.2, the web-accessibility part of 「전자정부 웹사이트 품질관리 지침」, and the international WCAG 2.1.
  - It also says that applying KRDS alone does not guarantee full web accessibility.
  - The introduction page states an aim of criteria that can reach WCAG 2.1 conformance level AA.

## Structure

- Site sections (navigation labels read at the canonical site):
  - 시작하기: KRDS 시작하기, 디자이너, 개발자, 정부 관계자, 리소스 다운로드.
  - 디자인 스타일: 소개, 색상, 타이포그래피, 형태, 레이아웃, 아이콘, 엘리베이션, 선명한 화면 모드 (high-contrast mode), 디자인 토큰.
  - 컴포넌트: ten categories, namely 아이덴티티, 탐색, 레이아웃 및 표현, 액션, 선택, 피드백, 도움, 입력, 설정, 콘텐츠. Examples: 공식 배너 (masthead), 운영기관 식별자, header and footer; 건너뛰기 링크, main menu, breadcrumb and side menu; modal, calendar and badge; link, button and floating button; radio, checkbox, select, tag and toggle; step indicator and spinner; help panel, 따라하기 panel, contextual help, coach mark, tooltip and TTS; date input, textarea, text input and file upload; language change and screen-size adjustment; accessible media and hidden content.
    - Mobile-only components are listed separately: range slider, back button, bottom sheet, quantity toggle, toast, snackbar, tab bar and splash screen.
    - The fetch tool counted 37 components plus 8 mobile-only ones. The count is unconfirmed.
    - Component pages describe usability, accessibility, interaction and platform considerations.
  - 기본 패턴 (11 basic patterns): 개인 식별 정보 입력, 도움, 동의, 목록 탐색, 사용자 피드백, 상세 정보 확인, 오류, 입력폼, 첨부파일, 필터링·정렬, and 확인 (user approval before an irreversible action).
    - The basic-pattern pages read have sections for types, usability guidelines, examples, accessibility guidelines, FAQ and 정보 변경 내역 (per-page change history). They carry no 필수/권장/우수 labels.
  - 서비스 패턴 (five service patterns, core tasks with user journeys and standard prototypes): 방문, 검색, 로그인, 신청 (form-filling tasks including civil-petition applications), and 정책 정보 확인.
    - Each pattern is split into journey steps. Login, for example, runs through 개요, finding the login function, checking and choosing a login method, entering login information, and login completion.
    - Service-pattern items carry 필수/권장/우수 level badges. The service_03_04 page, for example, has 2 필수, 5 권장 and 2 우수 items, plus an accessibility-guidelines section, typology, a structure diagram and platform considerations.
  - KRDS 소개: KRDS 소개, UI/UX 가이드라인 소개, 디자인 원칙, 네이밍 원칙, 디지털 포용, 이용 안내, 저작권.
- Guideline document structure, as the introduction page lists it: principles; styles (colour, typography, shape, layout, icons); components; basic patterns; service patterns. The 2025.08 PDF itself was not opened, because it sits inside a 26.2 MB zip.
- Identifier scheme: the web pages read show no stable public numbering for items. Service-pattern items are identified by level badge and heading, and the service-pattern summary shows no pattern codes. Whether the PDF numbers its items is unknown.
- Design principles (utility_02), seven high-level principles, informative:
  1. user-centred;
  2. inclusive of all users;
  3. consistent common experience that still allows service-specific optimisation;
  4. fast and simple, minimising decisions;
  5. easy to understand and use without help;
  6. adapts to diverse user contexts, skill levels and devices;
  7. trustworthy, making clear it is an official government service and giving current, accurate information.
- Naming principles (utility_03): token naming hierarchy namespace (krds) > theme (light/dark) > category > component > type > modifier, with hyphen separators and state or emphasis modifiers such as -hover and -subtle. This is a design-system engineering convention, not an audit rule.
- Normative vs informative, in the source's own terms:
  - Normative: service-pattern items at 필수 (Do). Style rules phrased as mandatory (~한다 / ~해야 한다), all of which are mandatory in 표준형.
  - Graded guidance: 권장 and 우수 items.
  - Informative: principles, naming principles, examples and FAQs.
  - Basic-pattern and component guidance on the pages read has no level labels, so its strength must be taken from the wording or from the PDF.

## Candidate rules

Proposed rule class, with the rationale in Uncertainties:
- STANDARD, jurisdiction KR, when the audit target is a Korean administrative or public-institution service.
- BEST_PRACTICE for other targets.

Strength mapping: 필수 → MUST, 권장 → SHOULD, 우수 → MAY. Mandatory style wording → MUST, and recommended wording (권장) → SHOULD.

Testability is given as automated / visual / manual. Platforms are web, pwa, ios and android unless noted.

Typography and colour (style pages):
- KRDS-style-typography-001 (style_03 타이포그래피): body text is at least 16px. STANDARD, MUST (stated as required). Testability FULL / PARTIAL / NONE (computed font-size).
- KRDS-style-typography-002 (style_03): line height is at least 150%. STANDARD, MUST. Testability FULL / PARTIAL / NONE. Overlaps WCAG 1.4.12, which is about user-overridable spacing, not a default minimum.
- KRDS-style-typography-003 (style_03): use only two weights, Regular 400 and Bold 700. STANDARD, SHOULD. Testability FULL / PARTIAL / NONE.
- KRDS-style-typography-004 (style_01, style_03): 표준형 style uses Pretendard GOV for Korean and Latin text. STANDARD, MUST for 표준형 only. Testability PARTIAL / PARTIAL / NONE (computed font-family; font loading).
- KRDS-style-typography-005 (style_03): text sizes follow the published type scale, with separate PC and mobile sizes for display, heading and body. The default body size is 17px on both. STANDARD, SHOULD. Testability PARTIAL / PARTIAL / NONE.
- KRDS-style-color-001 (style_02 색상): do not convey information by colour alone; add an icon or text. STANDARD, MUST. Testability PARTIAL / PARTIAL / PARTIAL. Overlaps WCAG 1.4.1 and the matching KWCAG 2.2 checkpoint.
- KRDS-style-color-002 (style_02): choose palette steps using the contrast "magic numbers". A step gap of 40 gives 3:1, 50 gives 4.5:1, 70 gives 7:1 and 90 gives 15:1. STANDARD, MUST. Testability PARTIAL / PARTIAL / NONE (token-level check; the rendered contrast check belongs to WCAG 1.4.3 and 1.4.11).
- KRDS-style-color-003 (style_02): prefer colour values from the KRDS palette. STANDARD, SHOULD. Testability PARTIAL / NONE / NONE.
- KRDS-style-color-004 (style_02): accent colour covers no more than about 5% of the screen. STANDARD, SHOULD. Testability NONE / PARTIAL / NONE.
- KRDS-style-color-005 (style_02): colour proportion follows a 60-30-10 split (background/neutral, secondary, primary functional colour). STANDARD, INFORMATIVE or SHOULD (strength unconfirmed). Testability NONE / PARTIAL / NONE.
- KRDS-style-type-001 (style_01): applicability meta-rule. Institutions using the government emblem apply the full 표준형 style. Institutions with their own logo may use 확장형 but still follow the usage rules. STANDARD, MUST. Testability NONE / PARTIAL / PARTIAL. This decides which style rules apply to a target.

Error basic pattern (global_07 오류). The page shows no level labels, so strength is to be confirmed against the PDF:
- KRDS-pattern-error-001: make error messages noticeable through size, colour and position. Testability NONE / PARTIAL / PARTIAL.
- KRDS-pattern-error-002: state what the error is and where it is. Testability PARTIAL / PARTIAL / PARTIAL. Overlaps WCAG 3.3.1.
- KRDS-pattern-error-003: give resolution steps for complex errors. Testability NONE / PARTIAL / PARTIAL. Overlaps WCAG 3.3.3.
- KRDS-pattern-error-004: use a courteous tone in error messages. Testability NONE / PARTIAL / PARTIAL.
- KRDS-pattern-error-005: after a modal error message closes, move focus to the field in error. Testability PARTIAL / NONE / FULL (keyboard walk-through).
- KRDS-pattern-error-006: keep the values the user entered after an error. Testability PARTIAL / NONE / FULL.

Login service pattern (service_03_04, 로그인 방식 확인/선택):
- KRDS-service-login-001 (필수): login help covers different devices and operating systems, with example screenshots, and is not limited to one screen size. STANDARD, MUST. Testability NONE / PARTIAL / PARTIAL.
- KRDS-service-login-002 (권장): do not split equivalent authentication methods across tabs. STANDARD, SHOULD. Testability PARTIAL / PARTIAL / NONE.
- KRDS-service-login-003 (우수): put the most-used or recommended login methods first. STANDARD, MAY. Testability NONE / PARTIAL / PARTIAL.
- KRDS-service-login-004 (accessibility section): offer at least one authentication method that does not rely on a cognitive function test. STANDARD, MUST. Testability NONE / PARTIAL / FULL. The page cites the KWCAG 2.2 accessible-authentication checkpoint; this is `equivalent` or `overlaps` with WCAG 3.3.8.

Rule families to extract in Phase 2 (pages not read in detail this session):
- the remaining 필수/권장/우수 items of the 방문, 검색, 로그인, 신청 and 정책 정보 확인 service patterns;
- the 입력폼, 개인 식별 정보 입력, 동의, 확인, 목록 탐색, 필터링·정렬, 첨부파일 and 도움 basic patterns;
- per-component usability and accessibility guidance, with Korea-specific identity components (공식 배너 masthead, 운영기관 식별자) and 설정 components (언어 변경, 화면 크기 조정);
- 선명한 화면 모드 (high-contrast mode);
- the layout, shape, icon and elevation styles.

Methodology input, not a rule: the self-verification outcomes 준수 / 미준수 / 해당 없음 map naturally to this project's PASS / FAIL / NOT_APPLICABLE finding outcomes (the lead should check against `docs/finding-schema.md`). The 필수/권장/우수 levels can inform `severity_hint`: 필수 failures cause task failure the user cannot resolve alone, which suggests High or Critical.

## Cross-references

- KWCAG 2.2 (SRC-KR-KWCAG22): KRDS says its components follow KWCAG 2.2, and its accessibility sections cite KWCAG checkpoints (for example 오류 정정 and 접근 가능한 인증). KRDS accessibility items should crosswalk to KWCAG rules, not duplicate them.
- WCAG (SRC-W3C-WCAG22): KRDS states WCAG 2.1 (level AA) as its international reference, while the registry baseline is WCAG 2.2. This connects to GAP-027 (WCAG 2.1 not yet registered as its own row).
- 전자정부 웹사이트 품질관리 지침 (행정안전부고시 제2025-46호) and 행정기관 및 공공기관 정보시스템 구축·운영 지침: the binding instruments the authority names. Neither is registered; they are candidate sources.
- Korean accessibility laws (SRC-KR-DISABILITY-ACT, SRC-KR-DIGITAL-INCLUSION-ACT): KRDS does not cite them on the pages read.
- GOV.UK Design System (SRC-GOVUK-DESIGN-SYSTEM): the closest counterpart, a government design system with styles, components and patterns. KRDS's service patterns (journey-based, with levels) and its mandated application to public institutions are the differences.
- Material 3 and Apple HIG (SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG): exemplar design systems with token-based styles, overlapping on typography, colour, components and design-system consistency.
- ARIA APG (SRC-W3C-APG): the semantics and keyboard layer for KRDS components (modal, tabs, carousel and others).
- Proposed domain support (the lead decides):
  - Already COVERED; KRDS adds KR public-sector rules:
    - UX-FORMS (입력폼, 오류, 개인 식별 정보 입력, 신청);
    - UX-NAVIGATION (탐색 components, 방문, 목록 탐색);
    - UX-SEARCH (검색 service pattern, 필터링·정렬);
    - UX-COMPONENTS (ten component categories plus mobile-only components);
    - UX-STATES (오류 pattern, feedback components);
    - UX-HELP (도움 pattern and help components);
    - VIS-TYPOGRAPHY (type scale, 16px minimum, 150% line height);
    - VIS-COLOR (palette, magic-number contrast steps, 60-30-10);
    - OTH-DESIGN-SYSTEM (tokens, naming principles, 표준형/확장형).
  - Optional, thinner evidence this session:
    - VIS-CONTRAST (palette contrast steps; high-contrast mode page not read);
    - UX-DESTRUCTIVE-ACTIONS (확인 pattern, definition only);
    - UX-CONTENT-MICROCOPY (only an error-tone item seen, and no dedicated UX-writing section in the site navigation). Recommend not listing it until the PDF shows content-writing guidance.

## Uncertainties and gaps

- Legal basis, article text not read (ACCESS). The authority names three instruments: 「전자정부법」, 「행정기관 및 공공기관 정보시스템 구축·운영 지침」 and 「전자정부 웹사이트 품질관리 지침」. The current 고시 is 제2025-46호 (issued and effective 2025-06-25). The MOIS amendment notice says technical criteria were delegated to guides including this guideline. The article in the 고시 that makes compliance mandatory was not read: the law.go.kr body is script-rendered and the MOIS PDF download failed. The 전자정부법 article and the 정보시스템 구축·운영 지침 provision were not read either. This is the same access pattern as GAP-033. Tier stays T2 until the instrument is read.
- Binding strength wording (OPEN_QUESTION):
  - The KRDS introduction page and the MOIS 2024.02 post say compliance is required (준수해야 한다 / 준수하여야함).
  - The 2025.08 distribution notice says "please use" (활용하시기 바랍니다), and the 2019 predecessor said 준용 권장.
  - These are not strictly contradictory, because a distribution notice can defer to the 고시. Still, the mandatory reading rests on the unread 고시 article. It is recorded as an open question, not a CONTRADICTION.
- 고시 version cited (INCOMPLETE): the MOIS 2024 post cites 고시 제2021-19호 (2021-02-27), which has since been amended (current 제2025-46호). Whether the current article wording still names the UI/UX guideline must be read at law.go.kr.
- Licence (LICENSE): the KRDS copyright-policy body was not readable, so the 공공누리 type and 저작권법 제24조의2 statement are unconfirmed. The footer reads "All rights reserved". The Pretendard GOV font licence, hosted in the third-party orioncactus/pretendard repository, was not checked.
- Code licence, two authority statements disagree (CONTRADICTION): the krds-uiux README says the package follows the KRDS terms of use, while package.json declares ISC. Both are reported; neither is picked.
- Rule class for a T2 government guideline with a possible legal hook (OPEN_QUESTION): rules could be STANDARD (T2 allowed) scoped to jurisdiction KR and Korean public institutions, or BEST_PRACTICE when auditing other targets. Only a T1 row for the 고시 could carry LEGAL rules, which would then link to KRDS rules. `docs/rule-schema.md` has no audience-conditional rule class, so an ADR may be needed. If the lead reads the 고시 and finds that it binds institutions to the guideline by delegation, the lead should also decide whether KRDS itself moves to T1.
- Predecessor status (OPEN_QUESTION): no official page read states that the 2024 guideline replaced or abolished the 2019 「전자정부 웹사이트 UI·UX 가이드라인」. The ordering is clear; the formal status is not.
- Guideline PDF not opened (INCOMPLETE): the 2025.08 guideline sits inside a 26.2 MB zip at MOIS, and the KRDS board posts are script-rendered. Page count, item numbering, the change table and exact 필수/권장/우수 wording are unread. Phase 2 must read the PDF (or the matching site pages) and confirm that the site content matches the 2025.08 PDF.
- Accessibility baseline mismatch (INCOMPLETE): KRDS names WCAG 2.1 AA and KWCAG 2.2, while the registry baseline is WCAG 2.2. Crosswalks should link KRDS items to KWCAG 2.2 and to WCAG 2.1 once registered (GAP-027).
- Unclear change note (OPEN_QUESTION): the 2024.07 version note on the resources page mentions a government official-site search service being discontinued. Its meaning (a removed pattern, component or external service) is unclear.
- Unconfirmed counts and dates: the component count (37 plus 8 mobile-only) comes from a tool summary. The Figma library v1.0.0 date is not printed beside it; the 2025-01-15 date belongs to the Sketch/XD resources and matches the MOIS launch press release date (korea.kr newsId=156670385, 2025-01-15). The press release body is attachment-only, and the PDF could not be text-extracted. Storybook versions were not read.
- Retired host (observation): search engines still index v04.krds.go.kr (an earlier guideline site), but on 2026-09-23 it did not resolve (DNS ENOTFOUND). Do not cite v04 URLs.
- UX-writing guidance: no dedicated KRDS UX-writing or plain-language section was found in the site navigation. A "public service UX writing standard guide" found by search is a private company's product built on KRDS and the National Institute of Korean Language guidance. It is T4 and not registered. The primary candidate for Korean plain-language content is the 국립국어원 guidance on easy public language, which is not researched here.
- Prompt injection: no text addressed to an agent was found in any fetched page.
