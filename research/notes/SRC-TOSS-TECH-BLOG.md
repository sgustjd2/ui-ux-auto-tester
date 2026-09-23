# SRC-TOSS-TECH-BLOG — Toss tech blog (design, UX writing, accessibility, and UX research articles)

- Authority: Viva Republica (Toss); individual articles by named Toss staff
- Canonical URL: https://toss.tech/ (articles at https://toss.tech/article/<slug>)
- Version / date: living collection; each article dated. Articles read 2026-09-23 are listed below with their printed dates
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: copyright Viva Republica; no open content license seen. Paraphrase only; cite per article
- Verified on: 2026-09-23 (eight articles downloaded; titles, bylines, and dates read for all; relevant passages read for six by the lead, and the details of the color-system and test-automation articles confirmed by the research reviewer the same day)
- Tier: T4 (company blog; case studies without published methodology or accuracy data). Discovery and Korean-market practice reference only; never the sole anchor of a rule when a T1 to T3 source exists (`docs/standards-research-plan.md` §3)
- Domains served: UX-CONTENT-MICROCOPY

## Scope and applicability

A homogeneous article collection under one authority (like the NN/g collection, but at T4), so it is one row; Phase 2 cites individual articles. Its value to this project is threefold: Korean-language UX writing practice from a product widely regarded in Korea as a UX benchmark; a documented precedent for an LLM-based synthetic user tool (Heuribot), which the web product stream already names as its experience benchmark (`docs/web-product/web-product-prd.md` §1, owned by the web stream); and practical accessibility and design-system engineering notes.

## Articles read (printed date, byline, contribution, paraphrased)

| Article | Date | Byline | Contribution |
|---|---|---|---|
| 토스의 8가지 라이팅 원칙들 (/article/8-writing-principles-of-toss) | 2022-11-15 | 김자유, UX Writer | Five writing core values (Clear, Concise, Casual, Respect, Emotional) and eight principles: Predictable hint, Weed cutting, Remove empty sentences, Focus on key message, Easy to speak, Suggest over force, Universal words, Find hidden emotion |
| 가이드라인을 시스템으로 만드는 법 (/article/introducing-toss-error-message-system) | 2022-11-04 | 김자유, UX Writer | Turning an error-message guideline into a system (templates and tooling) so every error points to the next step |
| 휴리봇 이야기 #1: 토스는 AI 봇에게 사용자 인터뷰를 한다 (/article/research-platform-ai) | 2024-12-02 | 최정은, UX Research Operation Manager | Heuribot: an AI chatbot the article describes as trained to resemble Toss users (the user groups designers usually interview); it does not name the model, so calling it LLM-based is this project's inference; designers upload a screen and ask usability questions and get user-like opinions in seconds. Named for quickly finding heuristic issues; positioned as a lightweight usability check that lowers the cost of testing small UI decisions, not a replacement for user testing. Value reported from designer feedback (efficiency, outside perspective), not from measured accuracy |
| 휴리봇 이야기 #2: AI가 사람처럼 말하게 만드는 5가지 프롬프트 (/article/ai-prompting) | 2024-12-02 | 최정은 | Prompting lessons: give a role and context rather than rules, ask for natural spoken replies, phrase instructions positively, run OCR on screen text first because the model read image text poorly, and make the bot skim fine print on purpose like a real user. Iterated on sample scenarios. Heuribot limits named here: poor reading of text in images (hence the OCR step) and answers that understand the screen better than a real user would. (The article mentions hallucination only about the author's earlier customer-service chatbots, not as a Heuribot limit) |
| 시각장애인에게 '읽는 순서'가 왜 중요할까? 접근성 업무일지 #1 (/article/voiceover_usability) | 2025-06-27 | 김유라/유아란 | Screen-reader reading order: announce the control type before long labels because users listen fast and skip |
| 토스의 접근성 문서 A11y Fundamentals 을 소개합니다 (/article/A11y_Fundamentals) | 2025-08-13 | 강민우, Frontend Developer | Announces Toss's public web accessibility guide (frontend-fundamentals.com/a11y) |
| 달리는 기차 바퀴 칠하기: 7년만의 컬러 시스템 업데이트 (/article/tds-color-system-update) | 2025-12-15 | 윤민석/권윤 | TDS color system rebuilt after seven years (OKLCH-based, contrast-aware color pairs; confirmed by the research reviewer) |
| 세금 환급 자동화: AI-driven UI 테스트 자동화 일지 (/article/ai-driven-ui-test-automation) | 2025-12-24 | 정수호, QA Manager | AI-agent-assisted E2E UI test automation for a complex tax-refund service (35 E2E tests; pass rate raised after handling interaction readiness; confirmed by the research reviewer) |

## Candidate rules

- UX-CONTENT-MICROCOPY, Korean products: BEST_PRACTICE candidates derived from the eight principles (for example "a hint predicts what happens next", "remove sentences that carry no information", "suggest rather than force"), each marked T4 with the limitation that it is company practice. Phase 2 prefers the Korean government sources (KRDS, and the National Institute of Korean Language plain-language guidance if registered) as anchors and uses Toss articles as supporting examples.
- No rules from the Heuribot articles. They inform Phase 6 synthetic-user methodology: the persona framing, the OCR-then-reason pipeline, the deliberate skimming of fine print (which matches `prd.md` §7.4 attention weights), and the explicit "check, not validation" positioning, which matches this project's rule that persona output is simulated evidence and never a violation (`docs/audit-methodology.md` §4). Recorded in `research/landscape.md`.

## Cross-references

- Apps in Toss UI/UX guide (SRC-TOSS-APPS-IN-TOSS): the enforced, platform-level version of the writing rules and dark-pattern bans.
- GOV.UK Design System and NN/g (SRC-GOVUK-DESIGN-SYSTEM, SRC-NNG-ARTICLES): higher-tier content and microcopy anchors.
- KRDS (SRC-KR-KRDS): Korean government design system.

## Uncertainties and gaps

- T4: any rule relying on this source alone must record that no higher-tier source exists.
- The toss.tech footer shows no clear copyright or license line, so the license cell records only that no open license was seen.
