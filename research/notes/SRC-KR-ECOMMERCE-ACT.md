# SRC-KR-ECOMMERCE-ACT — Act on the Consumer Protection in Electronic Commerce (전자상거래 등에서의 소비자보호에 관한 법률), dark-pattern provisions

- Authority: Republic of Korea (National Assembly). Competent ministry printed in the law.go.kr index: 공정거래위원회 (Korea Fair Trade Commission, KFTC)
- Canonical URL: https://www.law.go.kr/법령/전자상거래등에서의소비자보호에관한법률 (National Law Information Center; the article bodies on this page are JavaScript-rendered and did not extract, as in GAP-033). The text was read at the same authority through the law.go.kr Open API: `https://www.law.go.kr/DRF/lawService.do?OC=test&target=law&MST=282793&type=XML&efYd=20260721` (current version) and the version index `https://www.law.go.kr/DRF/lawSearch.do?OC=test&target=eflaw&type=XML&query=전자상거래 등에서의 소비자보호에 관한 법률`
- Version / date: current consolidated text is 법률 제21312호, 일부개정 (partial amendment), promulgated 20 January 2026. The index lists three effective-date versions for it: 20 January 2026 (Art. 6(2) only), 21 July 2026 (marked 현행, current), and 21 January 2027 (marked 시행예정, scheduled). Its addendum also sets 7 February 2027 for part of Art. 39(3). Law serial number (MST) 282793. The dark-pattern provisions come from 법률 제20302호, promulgated 13 February 2024: Art. 13(6) and Art. 21-2(1) took effect 14 February 2025, and Art. 21-2(2) and Art. 21-3 took effect on promulgation (addendum Art. 1). The index lists the 20302 version at both 13 February 2024 and 14 February 2025.
- Source status: CURRENT
- Superseded by / supersedes: none. The Act is amended in place; 21312 is the latest amendment in the law.go.kr index. 21312 did not amend Art. 13(6), 21-2, or 21-3: their annotations are still only "신설 2024.2.13", and Art. 21-2 is the same in the scheduled 21 January 2027 version.
- License / access: Korean statutes are not protected works under Copyright Act (저작권법) Art. 7 item 1 (read at law.go.kr today: 법률 제21336호, in force 11 August 2026). Access is open. The KLRI English translation (elaw.klri.re.kr) says it is "for reference only" and not official; its version was not determined.
- Verified on: 2026-09-23 (metadata, status, version index, addenda, and the text of Art. 7, 8, 13(6), 14, 21(1), 21-2, 21-3, 21-4, 32(1), and 45 read through the law.go.kr Open API. See the tooling caveat under Uncertainties)
- Tier: T1
- Domains served: OTH-DARK-PATTERNS. Might also serve OTH-CONSENT-UX (Art. 13(6)) and UX-ERROR-PREVENTION (Art. 7, 14(2)); the lead decides.

## Scope and applicability

- Who is bound: Art. 21-2(1) binds 전자상거래를 하는 사업자 (businesses doing electronic commerce) and 통신판매업자 (mail-order or distance sellers) when they operate an 온라인 인터페이스 (online interface). Art. 21-2(1) itself defines that term as software, such as a website or mobile app, that mediates between consumers and businesses. Art. 13(6) binds 통신판매업자. Art. 2 defines 전자상거래, 통신판매, 통신판매업자, 통신판매중개, 소비자, and 사업자.
- Platforms: web, PWA, iOS, and Android (any website or app that is an online interface). Jurisdiction: KR. Rule class: LEGAL.
- Legal effect: the Art. 21-2(1) prohibitions and Art. 13(6) duties are binding. Enforcement:
  - Art. 32(1) item 3: KFTC corrective orders for any Art. 21-2(1) practice.
  - Art. 32(1) item 1: corrective orders that include Art. 13(6).
  - Art. 45(4) item 7: administrative fine (과태료) of up to 10 million won for Art. 21-2(1).
  - Art. 45(3) item 5-2: fine of up to 20 million won for breaching Art. 13(6).
  - The fine amounts are as read today and need a raw-text re-check (see Uncertainties).
- Timing: Art. 13(6) applies to price increases or free-to-paid conversions that happen after 14 February 2025 (20302 addendum Art. 2).
- No technical standard is incorporated by reference. Several details are delegated to other instruments that were not read:
  - Enforcement Decree (대통령령): the notice-and-consent period in Art. 13(6), the minimum opt-out period in the Art. 21-2(1) item 5 proviso, and the review-information details in Art. 21-4(2).
  - Enforcement Rule (총리령): how to tell consumers the legitimate reason in the Art. 21-2(1) item 1 proviso, and the explanation method in Art. 21(1) item 7.
  - KFTC guideline: Art. 21-2(2) lets the KFTC issue guidance to encourage voluntary compliance.

## Structure

- Chapters: 1 총칙 (general provisions); 2 전자상거래 및 통신판매 (e-commerce and distance selling); 3 소비자 권익의 보호 (consumer protection); 4 조사 및 감독 (investigation and supervision); 5 시정조치 및 과징금 부과 (corrective measures and penalty surcharges); 6 보칙 (supplementary provisions); 7 벌칙 (penalties). Addenda (부칙) are listed per amending act, from 법률 제6687호 (enactment, 30 March 2002) to 제21312호.
- Identifier scheme: article 제N조; inserted article 제N조의M (for example 제21조의2, "Art. 21-2"); paragraph ①② (항); item 1. 2. (호); sub-item 가. 나. (목). Citation form: 제21조의2제1항제3호가목 = Art. 21-2(1)(3)(ga). Numbering is stable across amendments (inserted articles use 의M), so a prefix can keep article numbers unchanged.
- Dark-pattern core, Art. 21-2 (온라인 인터페이스 운영에 있어서 금지되는 행위, practices prohibited in operating an online interface), paraphrased:
  - (1)(1) Drip pricing on the first screen: a cybermall's first price display or ad must not show only part of the total a consumer must pay. The total includes costs that necessarily come with the goods or service. Proviso: allowed if there is a legitimate reason the total cannot be shown and the consumer is told that reason as the Enforcement Rule prescribes.
  - (1)(2) Pre-selected opt-in: during a purchase, sign-up, or contract flow, when the consumer is offered another purchase, membership, or contract, the option must not be pre-marked as accepted before the consumer chooses.
  - (1)(3) Visual hierarchy: choices about purchase or use, sign-up, contract, purchase cancellation, membership withdrawal, or contract termination (together 구매등) must not be shown with visually marked differences in size, shape, colour, etc. where the display may mislead the consumer into thinking (ga) only a specific option can be chosen, or (na) a specific option must be chosen as a condition of proceeding.
  - (1)(4) Obstructed cancellation: without legitimate reason, a business must not obstruct cancellation, withdrawal, or termination by (ga) making that procedure more complex than the purchase, sign-up, or contract procedure, or (na) allowing it only by a different method than the one used to purchase or sign up.
  - (1)(5) Nagging: a business must not repeatedly ask, by pop-up or similar means, that the consumer change a choice already made. Proviso: allowed if the consumer can opt out of such requests for at least a period set by the Enforcement Decree.
  - (2) KFTC may issue guidelines, after hearing stakeholders, to encourage voluntary compliance. This is an enabling power, not a duty on businesses.
- Art. 21-3: businesses and trade associations may adopt voluntary codes to prevent Art. 21-2(1) practices. Permissive; places no duty on the audited party.
- Art. 13(6) (hidden renewal or subscription trap): when a recurring payment increases, or a free supply converts to paid recurring billing, the seller must first get the consumer's consent to the date, the old and new prices, and the payment method. It must also tell the consumer the conditions, method, and effects of cancelling or terminating. Both must happen within the period the Enforcement Decree sets before the change.
- Older UX-relevant duties in the same Act, all binding:
  - Art. 7 (조작 실수 등의 방지, preventing operating errors): provide a way to confirm or correct the order before payment is charged or the offer is sent.
  - Art. 8(2): for electronic payment, clearly disclose listed matters and provide a consumer confirmation step. Its listed items were only partly read.
  - Art. 8(3): notify completed electronic payments and keep payment records viewable.
  - Art. 14(1): promptly confirm receipt of an offer and whether the item can be supplied.
  - Art. 14(2): before the contract is concluded, provide a way to review, correct, or cancel the offer.
  - Art. 21(1): general prohibitions on businesses doing e-commerce and on distance sellers. They include item 1 (false, exaggerated, or deceptive means to lure or deal with consumers, or to obstruct withdrawal or termination) and item 7 (installing a program without consent or without an easy, clear explanation).
  - Art. 21-4 (정보의 투명성 확보 조치, transparency measures), added by 21312 and in force 21 July 2026: a business that posts consumer reviews must publish how it collects and handles them. That covers the posting period, rating and deletion criteria, and the procedure for objecting to a deletion. Details are set by the Enforcement Decree.
- Other 21312 changes that do not touch the dark-pattern articles: a new Art. 32-2 (동의의결, consent decision), the old 32-2 renumbered as 32-4, and amendments to Art. 6(2), 20(2), 20-2(2), 32(1), 39, and 45. Art. 20-5 (국내대리인의 지정, designation of a domestic representative for overseas operators) and related parts of Art. 32(1) item 1 and 45(3) take effect 21 January 2027.
- Normative vs informative: every article quoted above is binding statute text, except Art. 21-2(2) and 21-3, which are enabling or permissive. The KFTC guideline issued under Art. 21-2(2) is a separate document; this note does not describe its content.

## Candidate rules

Proposed prefix `KRECOM`. It is not registered in `docs/rule-schema.md` §8; the existing `KRLAW` prefix maps to SRC-KR-DISABILITY-ACT only. All rules are rule_class LEGAL, jurisdiction KR, platforms web/pwa/ios/android. None are normalized yet.

| proposed id | source identifier | paraphrase | strength | testability guess |
|---|---|---|---|---|
| KRECOM-art-21-2-1-1 | Art. 21-2(1)(1) | The first price screen shows the full mandatory total (price plus necessary costs), not a partial amount; exception: legitimate reason, notified per the Enforcement Rule | MUST (prohibition) | automated PARTIAL (compare listing price with pre-payment total); visual PARTIAL; manual FULL (walk to the last pre-payment step) |
| KRECOM-art-21-2-1-2 | Art. 21-2(1)(2) | An offer of another product, membership, or contract inside a purchase or sign-up flow is not pre-selected | MUST | automated PARTIAL (pre-checked inputs in the flow; judgment needed on whether the item is "another" offer); visual PARTIAL |
| KRECOM-art-21-2-1-3-ga | Art. 21-2(1)(3)(ga) | Accept, decline, or cancel choices are not visually skewed in a way that may mislead the user into thinking only one option exists | MUST | visual PARTIAL (relative size, colour, contrast of choices); automated PARTIAL (computed styles); manual needed for "may mislead" |
| KRECOM-art-21-2-1-3-na | Art. 21-2(1)(3)(na) | Choices are not visually skewed in a way that may mislead the user into thinking one option is required to proceed | MUST | as above |
| KRECOM-art-21-2-1-4-ga | Art. 21-2(1)(4)(ga) | Cancelling, withdrawing, or terminating is not more complex than purchasing or signing up (absent legitimate reason) | MUST | manual FULL (compare step counts and friction of both flows); automated NONE; runtime needs an authorized test account (`prd.md` §14) |
| KRECOM-art-21-2-1-4-na | Art. 21-2(1)(4)(na) | Cancellation is available through the same method used to sign up or buy (for example online, not phone only) | MUST | manual FULL; visual PARTIAL (presence of an in-app or online cancel path) |
| KRECOM-art-21-2-1-5 | Art. 21-2(1)(5) | No repeated pop-ups or similar prompts asking the user to reverse a decision; exception: an opt-out lasting at least the Decree period | MUST | manual FULL (flow replay); automated PARTIAL (count re-prompts after a decline) |
| KRECOM-art-13-6-001 | Art. 13(6) | Before a recurring-charge increase or free-to-paid conversion, the user consents to the date, old and new price, and payment method, within the Decree period | MUST | manual PARTIAL (time-based; review consent screens and messages); visual PARTIAL |
| KRECOM-art-13-6-002 | Art. 13(6) | Before such a change, the user is told how to cancel or terminate it and what that does | MUST | visual PARTIAL; manual PARTIAL |
| KRECOM-art-7-001 | Art. 7 | An order-review step lets the user confirm or correct the order before payment or submission | MUST | visual FULL (review step present with edit controls); manual FULL |
| KRECOM-art-14-2-001 | Art. 14(2) | Before the contract is concluded, the user can review, correct, or cancel the order | MUST | visual PARTIAL; manual FULL |
| KRECOM-art-8-2-001 | Art. 8(2) | Electronic payment clearly discloses key terms and includes a consumer confirmation step (listed items to be read in Phase 2) | MUST | visual PARTIAL; manual FULL |
| KRECOM-art-21-1-1-001 | Art. 21(1)(1) | No false, exaggerated, or deceptive means to lure users or to obstruct withdrawal or termination (general catch-all) | MUST | manual PARTIAL (judgment); persona signals |
| KRECOM-art-21-1-7-001 | Art. 21(1)(7) | No program is installed without consent or without an easy, clear explanation | MUST | manual PARTIAL; automated PARTIAL (download or install prompts) |
| KRECOM-art-21-4-001 | Art. 21-4(1) | Where user reviews are shown, review collection and handling information (posting period, rating and deletion criteria, deletion-objection procedure) is published | MUST (in force 21 July 2026) | visual PARTIAL; manual FULL |

No rules: Art. 21-2(2) (KFTC guideline power) and Art. 21-3 (voluntary codes) are informative context. Art. 13(2) (pre-contract disclosure of trade terms) is a likely further candidate, but it was read only in summary and its items were not listed. Enumerate it in Phase 2 before minting.

## Cross-references

- SRC-TOSS-APPS-IN-TOSS: the Apps in Toss dark-pattern cases AIT-darkpattern-002, 003, and 005 overlap Art. 21-2(1)(3)–(5). Use `related_rules: overlaps`, with the KRECOM LEGAL rule as the anchor in KR.
- SRC-EDPB-DECEPTIVE, SRC-FTC-DARK-PATTERNS, SRC-EU-DSA (candidates): the counterpart deceptive-design taxonomies and laws in other jurisdictions. Crosswalk candidates: drip pricing, preselection, false hierarchy, obstruction, nagging.
- SRC-NNG-HEURISTICS (heuristics 3 and 5): Art. 7 and 14(2) are the legal counterparts of error prevention and user control.
- Not registered (candidates, not researched here):
  - KFTC 전자상거래 등에서의 소비자보호 지침, the administrative rule issued under Art. 21-2(2). law.go.kr admRul pages appeared in search results.
  - The Enforcement Decree (시행령): 대통령령 제36507호, MST 288143, promulgated 20 July 2026, current from 21 July 2026, with a 21 January 2027 version scheduled.
  - The Enforcement Rule (시행규칙): 총리령 제2136호, MST 288167, current from 21 July 2026.
  - The Decree and Rule details were seen only in the law.go.kr index today and were not verified.

## Uncertainties and gaps

- Tooling caveat: the text was read through a summarizing fetch tool over the law.go.kr XML. The first "verbatim" request silently dropped Art. 21-2(1)(3)'s sub-items (ga, na) and the provisos of items 1 and 5; targeted re-reads recovered them. The paraphrases here come from those targeted re-reads. Before normalizing, Phase 2 must read the raw XML without summarization, including the Art. 45 fine amounts and the Art. 8(2) and 13(2) item lists.
- Delegated details were not read: the Art. 13(6) period, the Art. 21-2(1)(5) minimum opt-out period, and the Art. 21-4 details (Decree); the Art. 21-2(1)(1) notice manner and the Art. 21(1)(7) method (Rule). Rules that need a number stay incomplete until those are read.
- The Act gives no thresholds for its judgment terms: 시각적으로 현저한 차이 (visually marked difference), 잘못 알게 할 우려 (may mislead), 정당한 사유 (legitimate reason), and 절차를 복잡하게 (more complex procedure). Objective test criteria depend on the KFTC guideline (unregistered). The discovery hint that the guideline revision took effect 24 October 2025 (ftc.go.kr nttSn=46527) and that it interprets "six types" was not checked. Until the guideline is read, these rules are manual-judgment checks.
- The KFTC press release on korea.kr (newsId=156612484) was fetched. It is dated 25 January 2024, issued by 공정거래위원회, and titled as announcing plenary passage of the E-Commerce Act and Framework Act on Consumers amendments. Its body is in attachments that were not read, so it corroborates only the passage announcement date.
- Scope: from the articles read, it is unclear whether the Act applies to services with no purchase or distance sale, and how far it reaches overseas operators. Art. 20-5 (domestic representative, from 21 January 2027) shows that overseas operators are addressed. LEGAL rule applicability needs a scope decision (see GAP-010).
- Amendment 법률 제21066호 (1 October 2025, 타법개정, amendment by another act) was not identified. It did not touch the dark-pattern articles, whose annotations show only 2024.2.13.
- The Open API was called with the public demo key `OC=test`; its terms of use were not checked. This read path could also close GAP-033 for the other Korean acts.
- Runtime testing of cancellation, subscription, and payment flows involves paid or irreversible actions. It needs explicit user authorization (`prd.md` §14).
- No prompt-injection text was found in the fetched pages.
