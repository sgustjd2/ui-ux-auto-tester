# SRC-FTC-DARK-PATTERNS — Bringing Dark Patterns to Light (FTC staff report)

- Authority: U.S. Federal Trade Commission, Bureau of Consumer Protection (staff)
- Canonical URL: https://www.ftc.gov/reports/bringing-dark-patterns-light (report page). The PDF linked from that page is https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf (file "P214800 Dark Patterns Report 9.14.2022 - FINAL.pdf", 2.07 MB, 48 pages)
- Version / date: cover reads "Staff Report, September 2022". The report page gives September 2022, and the FTC press release is dated 15 September 2022. The PDF filename carries 9.14.2022 and FTC project number P214800. No version number is given (a one-time report, not a revised series).
- Source status: CURRENT. The report page has no archived, superseded, withdrawn, or rescinded notice (checked 2026-09-23), and no later edition is linked.
- Superseded by / supersedes: none. It builds on the FTC workshop "Bringing Dark Patterns to Light" held 29 April 2021 (p.1).
- License / access: open. U.S. Government work in the public domain (17 U.S.C. 105) per the ftc.gov Website Policy, which asks for attribution where feasible ("Source: United States Federal Trade Commission, www.ftc.gov"). The same policy says the FTC cannot grant permission for third-party copyrighted material. Figures 1–10 are screenshots from companies in enforcement matters, so do not reproduce them.
- Verified on: 2026-09-23. The report page, the full PDF (all 48 pages), the press release, and the ftc.gov Website Policy were read at ftc.gov.
- Tier: T2
- Domains served: OTH-DARK-PATTERNS (primary), OTH-PRIVACY-UX (Section IV; lead decision 2026-09-23). Section IV also bears on OTH-CONSENT-UX.

## Scope and applicability

- The report is staff guidance from the U.S. consumer protection authority. It is not a rule, regulation, or statute. The press release says the Commission voted 5–0 to authorize its release. The Conclusion (p.20) calls it "an additional resource for the public and a guide for businesses" for designing online interfaces. The PDF has no disclaimer separating staff views from Commission views.
- It defines digital dark patterns as design practices that trick or manipulate users into choices they would not otherwise have made and that may cause harm (p.2; App. A preamble). It draws on the 2021 workshop, academic literature, and FTC enforcement actions.
- Legal hooks the report cites (as context, not as its own requirements):
  - FTC Act §5 (unfair or deceptive acts or practices; 15 U.S.C. 45(a)(1), with unfairness defined at 45(n)), n.2
  - the FTC Deception Policy Statement (1983; net-impression doctrine), n.38, n.48
  - ROSCA (15 U.S.C. 8401–8405), which requires three things for online negative-option sales: clear and conspicuous disclosure of material terms before billing information is taken, express informed consent before charging, and simple mechanisms to stop recurring charges (p.11; n.86–87; §8403(3) at n.99)
  - the Negative Option Rule (16 CFR Part 425), n.85
  - the Telemarketing Sales Rule, TILA, CAN-SPAM, COPPA, and ECOA (p.20)
  - the Enforcement Policy Statement Regarding Negative Option Marketing (86 Fed. Reg. 60822, 2021), n.4 and n.100–107
  - the Enforcement Policy Statement on Deceptively Formatted Advertisements (22 December 2015), n.27 and n.33
- Endnote 6 says some dark patterns have consistently been found unlawful while others depend on case-by-case facts. A pattern listed in the report is therefore not automatically illegal.
- Jurisdiction: US. Platforms: all online interfaces, including websites, mobile apps, kids' games, app stores, smart TVs (Vizio), and cookie banners. The report notes some patterns are more common or more effective on mobile (p.3) and mentions AR/VR as an emerging channel.
- For this project: BEST_PRACTICE rules, jurisdiction US, reported as UX_RISK (`docs/finding-schema.md` §1). A finding must never state that the FTC Act or ROSCA was violated. LEGAL rules would need the statutes themselves (T1), which are not registered.

## Structure

Paraphrased; page numbers refer to the PDF.

- Introduction (p.1) and Background (pp.2–3). Background covers the definition, the compounding effect when patterns are combined (App. B), A/B-testing design experiments as a warning sign (Credit Karma), the contexts where patterns appear (ecommerce, cookie consent banners, children's apps, subscriptions), mobile and small-screen effects, and why enforcement is hard.
- "Common Dark Patterns & Consumer Protection Concerns" (pp.4–19) is organized in four Roman-numeral sections. Each gives enforcement examples and ends with recommendations to businesses.
  - I. Design Elements that Induce False Beliefs (pp.4–6). Examples: ads disguised as editorial or news content (Effen Ads), "neutral" rankings or comparison sites that are actually pay-to-rank (LendEDU), fake countdown timers, false low-stock claims, and false claims about others' activity. Recommendations: the net impression of the whole design governs, not literal words; don't imply rankings or reviews are objective when compensation affects them; disclaimers are unlikely to fix ads that strongly resemble editorial content; judge design by its effect on consumer understanding, not only on conversion metrics; fix designs found to induce false beliefs.
  - II. Design Elements that Hide or Delay Disclosure of Material Information (pp.7–9). Examples: terms buried in Terms of Service, and hidden fees placed in tooltips, un-bolded itemizations between bold text, below the fold, or about four scrolls down on mobile (LendingClub). Drip pricing. Recommendations: put unavoidable mandatory fees in the upfront advertised price; don't make optional fees look mandatory; consider how a targeted audience (children, older adults, speakers of other languages) perceives the design, including peripheral placement, light colors, and low contrast (white on yellow is the example). Credit-related drip pricing also raises ECOA discrimination issues.
  - III. Design Elements that Lead to Unauthorized Charges (pp.10–15). Examples: a kids' game button that turns into a "Buy" button; in-app purchases without accountholder consent (Amazon, Apple, Google), including one authorization silently covering a purchase window; free trials that convert with the recurring-charge terms in small gray font; ROSCA's first case (Health Formulas); a 6–9 screen cancellation maze full of exit links and save offers (ABCMouse), which the report calls "sludge". Recommendations: express informed consent needs an affirmative, unambiguous act; key purchase terms must not sit in general T&Cs, hyperlinks, pop-ups, or drop-downs; accepting general terms is not consent to a specific purchase; get the accountholder's consent (children, shared devices). Cancellation should be at least as easy as sign-up, through the same medium, without save offers that cause unreasonable delay, and with phone lines answered promptly during business hours.
  - IV. Design Elements that Obscure or Subvert Privacy Choices (pp.15–19). The report lists six interface techniques: (1) no way to definitively reject collection; (2) repeated prompts for a setting the user avoided; (3) confusing toggles; (4) privacy choices hidden or hard to reach; (5) the data-maximizing option highlighted while the limiting option is greyed out; (6) defaults that maximize collection and sharing. Examples: cookie dialogs, phone numbers collected by default, Android location setup, the ISP 6(b) staff report, Vizio's vague default "Smart Interactivity" setting, and a lead generator falsely claiming military affiliation (Sunkey). Recommendations: minimize data; avoid unexpected defaults; make choices easy to find and understand, in context, without multi-screen hunts; toggles must not be ambiguous, and no option should be more prominent than another; sensitive-data consent must be specific, not blanket, and informed (for example, disclose sharing with third parties); lead generators must be honest about who they are and why they collect data.
- Conclusion (p.20).
- Appendix A, "Compilation of Digital Dark Patterns" (pp.21–26), is a table of Dark Pattern Type, Dark Pattern Variant, and Description with examples. It has 8 types and 32 variants:
  - ENDORSEMENTS (aka "Social Proof"): False Activity Messages; Deceptive Consumer Testimonials; Deceptive Celebrity Endorsements; Parasocial Relationship Pressure
  - SCARCITY: False Low Stock Message; False High Demand Message
  - URGENCY: Baseless Countdown Timer; False Limited Time Message; False Discount Claims
  - OBSTRUCTION: Price Comparison Prevention; Roadblocks to Cancellation; Immortal Accounts
  - SNEAKING OR INFORMATION HIDING: Sneak-into-Basket; Hidden Information; Hidden Costs; Drip Pricing; Hidden Subscription or Forced Continuity; Intermediate Currency
  - INTERFACE INTERFERENCE: Misdirection; False Hierarchy or Pressured Upselling; Disguised Ads; Bait and Switch
  - COERCED ACTION: Unauthorized Transactions; Auto-Play; Nagging; Forced Registration or Enrollment; Pay-to-Play or Grinding; Friend Spam, Social Pyramid Schemes, and Address Book Leeching
  - ASYMMETRIC CHOICE: Trick Questions; Confirm Shaming; Preselection; Subverting Privacy Preferences
- Appendix B (pp.27–32) walks through a fictional "Fitness Trainer" shop in six annotated screens that show combined patterns:
  1. a cookie banner (Trick Question; Subverting Privacy Preferences)
  2. a product grid (False Activity Messages)
  3. a sale banner (Baseless Countdown Timer)
  4. checkout (Drip Pricing)
  5. a checkout interstitial (Pressured Upselling; Hidden Information; Hidden Subscription; Roadblocks to Cancellation)
  6. an order confirmation (Unauthorized Transaction; Hidden Information)
- Contributors (p.33) and Endnotes 1–137 (pp.34–48).
- Identifier scheme: the main-body sections have Roman numerals I–IV. Appendix A items carry Type and Variant labels but no numbers. Appendix B screens are unnumbered (numbered 1–6 here by order). Cite as §I–§IV with page, "App. A <Type>/<Variant>", or "n.<endnote>".
- Normative vs informative, in the source's own terms: nothing in the report is a requirement of the report itself. The recommendation paragraphs at the end of §I–§IV use "should", and occasionally "must" where they restate legal expectations (for example, companies "must not" imply optional fees are mandatory, p.9; lead generators "must be honest", p.19). Appendix A is descriptive, and Appendix B is illustrative consumer education.

## Candidate rules

Proposed format: FTC-<slug>-NNN (prefix FTC registered in `docs/rule-schema.md` §8). All candidates are class BEST_PRACTICE, jurisdiction US, platforms all unless stated. Strength follows the source's wording: SHOULD or MUST where a §I–§IV recommendation covers the item, INFORMATIVE where only Appendix A describes it. Testability is written A/V/M (automated/visual/manual). These are guesses for Phase 2, not normalized. Rules on truthfulness (fake scarcity, fake activity, fake discounts) cannot be proven false from the interface alone; audits can only record risk signals (for example, a timer that resets on reload).

False beliefs (§I; App. A Endorsements, Scarcity, Urgency, Interface Interference):

- FTC-net-impression-001 — §I p.6. Judge the whole interface's net impression; design must not create a false or misleading impression even when individual words are literally true. SHOULD. A NONE / V PARTIAL / M FULL.
- FTC-disguised-ads-001 — §I pp.4–6; App. A Interface Interference/Disguised Ads. Ads must be recognizable as ads, not formatted as independent journalism or reviews; a label may not cure strongly editorial styling. SHOULD. A NONE / V PARTIAL / M FULL.
- FTC-paid-ranking-001 — §I pp.5–6; App. A Disguised Ads. Rankings, comparison tables, or search results presented as neutral must not be ordered by undisclosed payment. SHOULD. A NONE / V PARTIAL (disclosure presence) / M PARTIAL.
- FTC-false-activity-001 — §I p.4; App. A Endorsements/False Activity Messages. No fabricated claims about other users' activity ("N people viewing"). SHOULD. A PARTIAL (reload or compare counts) / V PARTIAL / M PARTIAL.
- FTC-testimonials-001 — App. A Endorsements/Deceptive Consumer Testimonials and Deceptive Celebrity Endorsements. Endorsements must disclose material connections and atypical results, and must not be fake. INFORMATIVE. A NONE / V PARTIAL / M PARTIAL.
- FTC-parasocial-001 — App. A Endorsements/Parasocial Relationship Pressure. Don't use characters children trust to push purchases or choices. INFORMATIVE. A NONE / V PARTIAL / M FULL.
- FTC-false-scarcity-001 — §I p.4; App. A Scarcity (both variants). No false low-stock or high-demand messages. SHOULD. A NONE / V PARTIAL / M PARTIAL.
- FTC-countdown-001 — §I p.4; App. A Urgency/Baseless Countdown Timer. Countdown timers must reflect a real deadline and must not reset or vanish when they expire. SHOULD. A PARTIAL (observe expiry, reload) / V FULL / M FULL.
- FTC-false-urgency-001 — App. A Urgency/False Limited Time Message and False Discount Claims. No limited-time or "sale" claims without a real deadline or real reference price. INFORMATIVE. A NONE / V PARTIAL / M PARTIAL.

Material information and pricing (§II; App. A Sneaking or Information Hiding, Obstruction, Interface Interference):

- FTC-hidden-info-001 — §II p.7; App. A Sneaking/Hidden Information. Material terms, limitations, and fees must not be only in fine print, long ToS, tooltips or hover pop-ups, nondescript links, or below the fold. SHOULD. A PARTIAL (key terms only in tooltip or collapsed content) / V FULL / M FULL.
- FTC-drip-pricing-001 — §II p.9; App. A Drip Pricing and Hidden Costs. The first advertised price includes every unavoidable mandatory fee; no mandatory fee first appears late in checkout. SHOULD. A PARTIAL (compare listed price with checkout total) / V FULL / M FULL.
- FTC-optional-fees-001 — §II p.9. Optional fees must not be presented as mandatory. MUST (source wording). A NONE / V PARTIAL / M FULL.
- FTC-misdirection-001 — App. A Interface Interference/Misdirection. Don't use visual emphasis (for example, a highlighted subtotal) to pull attention away from added mandatory charges. INFORMATIVE. A PARTIAL (computed-style comparison) / V FULL / M FULL.
- FTC-price-comparison-001 — App. A Obstruction/Price Comparison Prevention. Show per-payment prices with the number of payments and the total cost; avoid inconsistent units or bundling that blocks comparison. INFORMATIVE. A PARTIAL / V PARTIAL / M FULL.
- FTC-intermediate-currency-001 — App. A Sneaking/Intermediate Currency. Make the real-money cost of virtual currency clear, especially in kids' apps. INFORMATIVE. A NONE / V PARTIAL / M FULL.
- FTC-audience-perception-001 — §II p.9. When a product targets a specific audience (children, older adults, speakers of other languages), design and disclosures should work for that audience; avoid putting important information at the screen edge, in light colors, or in low contrast. SHOULD. A PARTIAL (contrast measurable; crosswalk to WCAG 1.4.3) / V FULL / M FULL.

Charges, consent, and cancellation (§III; App. A Coerced Action, Sneaking, Obstruction):

- FTC-express-consent-001 — §III p.14. Get consent to a charge through an affirmative, unambiguous act specific to that purchase; accepting general terms does not count; key purchase terms must not be behind links, pop-ups, or drop-downs. SHOULD. A PARTIAL (pre-checked purchase or consent inputs) / V PARTIAL / M FULL.
- FTC-accountholder-consent-001 — §III pp.11, 14. Charges need the accountholder's consent, which matters for kids' apps and shared devices; say so if one authorization covers later purchases for a time window. SHOULD. A NONE / V PARTIAL / M FULL.
- FTC-mislabeled-step-001 — §III p.10; App. A Coerced Action/Unauthorized Transactions. Controls must not change meaning mid-flow (for example, a level-advance button becoming "Buy"), and a "Next"-style label must not complete a purchase. SHOULD. A PARTIAL (label vs resulting action in a scripted flow) / V PARTIAL / M FULL.
- FTC-sneak-basket-001 — p.1; App. A Sneaking/Sneak-into-Basket. Nothing is added to the cart without the user's action, and add-ons are not pre-checked. INFORMATIVE. A FULL for pre-checked add-on inputs, PARTIAL for cart diffs / V FULL / M FULL.
- FTC-free-trial-001 — §III pp.11–12; App. A Sneaking/Hidden Subscription or Forced Continuity. Free-trial or low-fee offers that convert to recurring charges state the amount, timing, and cancellation terms as prominently as the offer, not in small or gray text. SHOULD. A PARTIAL / V FULL / M FULL.
- FTC-cancel-parity-001 — §III p.14; App. A Obstruction/Roadblocks to Cancellation. Cancelling is at least as easy as signing up. SHOULD. A NONE / V NONE / M FULL (step and screen count, sign-up vs cancel).
- FTC-cancel-same-medium-001 — §III p.14. Users can cancel through the medium they signed up in (web or app), not only by phone or another channel. SHOULD. A NONE / V PARTIAL / M FULL.
- FTC-cancel-path-001 — §III pp.13–15. The cancellation path is identifiable on each screen; it has no unreasonable save-offer delays and no links that silently drop the user out of the flow. SHOULD. A NONE / V PARTIAL / M FULL.
- FTC-cancel-phone-001 — §III p.15. If phone cancellation is offered, calls are answered promptly during business hours and are no more burdensome than signing up. SHOULD. A NONE / V NONE / M PARTIAL (mostly outside interface scope).
- FTC-account-deletion-001 — App. A Obstruction/Immortal Accounts. Account deletion must not be hard or impossible. INFORMATIVE. A NONE / V NONE / M FULL.
- FTC-forced-registration-001 — App. A Coerced Action/Forced Registration or Enrollment. Don't require account creation or data sharing to finish an unrelated task (for example, guest checkout blocked). INFORMATIVE. A PARTIAL / V PARTIAL / M FULL.
- FTC-bait-switch-001 — App. A Interface Interference/Bait and Switch. A control's result matches its apparent function (for example, a close "X" must not start a download). INFORMATIVE. A PARTIAL / V NONE / M FULL.
- FTC-autoplay-001 — App. A Coerced Action/Auto-Play. No unexpected auto-play of follow-on video, such as camouflaged ads or unsuitable content for kids. INFORMATIVE. A PARTIAL / V PARTIAL / M FULL.
- FTC-grinding-001 — App. A Coerced Action/Pay-to-Play or Grinding. Don't advertise items as available and then charge for them, and don't make free play so tedious that it pushes in-app purchases. INFORMATIVE. A NONE / V NONE / M PARTIAL.

Choice architecture and privacy (§IV; App. A Asymmetric Choice, Coerced Action):

- FTC-choice-prominence-001 — §IV pp.16, 18; App. A False Hierarchy or Pressured Upselling and Subverting Privacy Preferences. Competing options, such as accept/reject or keep/cancel, get comparable visual prominence; the less favored option is not greyed out or reduced to a small link. SHOULD. A PARTIAL (computed-style comparison of paired controls) / V FULL / M FULL.
- FTC-reject-option-001 — §IV pp.15–16; App. A Coerced Action/Nagging. Users can decline permanently (not only "Not now" or "Remind me later") and are not re-prompted after declining. SHOULD. A PARTIAL (decline-label check; re-prompt after reload) / V PARTIAL / M FULL.
- FTC-toggle-clarity-001 — §IV pp.17–18; App. A Asymmetric Choice/Trick Questions. Toggle and checkbox wording is unambiguous, with no double negatives and no "No, cancel" that fails to cancel. SHOULD. A PARTIAL (negation heuristics on labels) / V PARTIAL / M FULL.
- FTC-confirmshaming-001 — App. A Asymmetric Choice/Confirm Shaming. Decline options are not worded to shame the user. INFORMATIVE. A PARTIAL (language heuristics) / V PARTIAL / M FULL.
- FTC-preselection-001 — §IV p.18; App. A Asymmetric Choice/Preselection. Defaults do not favor the business against the user: add-ons and tracking consent are not pre-checked, and the most expensive option is not auto-selected. SHOULD. A FULL for pre-checked consent or add-on inputs / V FULL / M FULL.
- FTC-privacy-defaults-001 — §IV p.18. Defaults do not produce collection, use, or disclosure the user would not expect; collect only with a justified need. SHOULD. A PARTIAL (for example, tracking before consent) / V PARTIAL / M FULL.
- FTC-privacy-access-001 — §IV p.18. Privacy choices are easy to find and understand, offered in context when the data decision happens, and not buried in policies, ToS, or several screens deep. SHOULD. A NONE / V PARTIAL / M FULL.
- FTC-sensitive-consent-001 — §IV p.18. Consent for sensitive data (for example, location) is specific rather than blanket and says what will happen, such as sharing with third parties. SHOULD. A NONE / V PARTIAL / M FULL.
- FTC-data-minimization-001 — §IV pp.16–18. Forms ask only for data the requested service needs (the report's example is phone numbers collected without need). SHOULD. A NONE / V PARTIAL / M PARTIAL.
- FTC-purpose-honesty-001 — §IV pp.18–19; App. A Friend Spam and Address Book Leeching; Subverting Privacy Preferences. Say truthfully who is collecting data and why; no false affiliation (for example, sites made to look official); data collected for one purpose is not used for another without consent. MUST (source wording for lead generators). A NONE / V PARTIAL / M PARTIAL.

Candidate rules are not yet mapped one-to-one against all 32 Appendix A variants. Every variant is covered by at least one candidate above; some are merged, for example Hidden Costs with Drip Pricing, and both Scarcity variants in one rule.

## Cross-references

- Same domain (OTH-DARK-PATTERNS): SRC-EDPB-DECEPTIVE (EU data-protection guidelines), SRC-EU-DSA (EU regulation), SRC-KR-ECOMMERCE-ACT (Korean law), SRC-TOSS-APPS-IN-TOSS (platform policy). The FTC taxonomy overlaps strongly with EU and Korean pattern categories (nagging, preselection, confirmshaming, false hierarchy, drip pricing). Phase 2 should express the overlap with `related_rules`, not by merging records.
- Consent and privacy (§IV): SRC-EU-GDPR and SRC-EDPB-CONSENT address accept/reject parity, defaults, and specific consent from EU law. The FTC material is US guidance and must stay separately attributed.
- Accessibility: the §II advice on low-contrast disclosures and peripheral placement for older adults touches WCAG 1.4.3 contrast (SRC-W3C-WCAG22). The FTC text gives no threshold, so any contrast threshold must come from WCAG.
- Documents the report relies on, none registered as sources:
  - ROSCA (15 U.S.C. 8401–8405, T1 statute)
  - the Enforcement Policy Statement Regarding Negative Option Marketing (2021, 86 Fed. Reg. 60822), the origin of the cancel-as-easy-as-sign-up and same-medium guidance
  - the Enforcement Policy Statement on Deceptively Formatted Advertisements (2015)
  - the FTC Policy Statement on Deception (1983)
  - FTC staff reports "What ISPs Know About You" (October 2021), "Blurred Lines" (December 2017), and "Negative Options" (January 2009)
  - the EU Commission behavioural study on dark patterns (May 2022) and the UK CMA "Online Choice Architecture" discussion paper (April 2022)
- Cancellation UX and the Negative Option ("click-to-cancel") Rule, checked briefly on ftc.gov only, 2026-09-23. This is not researched as a source.
  - The ftc.gov Negative Option Rule page lists: the final "Click-to-Cancel" amended rule announced 16 October 2024; a Commission order denying a stay pending judicial review, 13 December 2024; a Federal Register notice of 12 February 2026 titled "Revision of the Negative Option Rule, Withdrawal of the CARS Rule, Removal of the Non-Compete Rule To Conform These Rules to Federal Court Decisions" (FR doc 2026-02866); and an ANPRM published 13 March 2026 (FR doc 2026-04952).
  - The FTC press release of 11 March 2026 announcing the ANPRM refers to "the vacated 2024 Rule" as one option for comment.
  - The FTC business blog post of 24 March 2026 says the Negative Option Rule currently covers only pre-notification plans. It says the FTC handles negative-option practices through case-by-case enforcement under the Negative Option Rule, FTC Act §5, ROSCA, and the TSR.
  - Reading: as of 2026-09-23 the 2024 click-to-cancel amendments are not in force (vacated). The 1973 pre-notification rule remains, and rulemaking is at ANPRM stage. ROSCA's statutory simple-cancellation requirement still applies.
  - For audit purposes, cancellation rules from this source stay BEST_PRACTICE (US) and must not cite the click-to-cancel rule.

## Uncertainties and gaps

- Click-to-cancel vacatur details: the court (reported as the U.S. Court of Appeals for the Eighth Circuit) and the date (reported as July 2025) appeared only in a web-search summary. No fetched ftc.gov page confirmed them, because the Federal Register text and the Commission statement PDFs were not opened. Record as OPEN_QUESTION. The fact of vacatur is confirmed by FTC's own 11 March 2026 press release.
- Status of the 2021 Enforcement Policy Statement Regarding Negative Option Marketing was not checked. It is the basis for the report's cancellation-parity guidance (n.104–107). Record as OPEN_QUESTION, candidate source.
- Current Commission endorsement: the report was released under the 2022 Commission, 5–0. There is no withdrawal notice, but also no reaffirmation on the page. Record as ASSUMPTION: CURRENT means "published and not withdrawn". It does not mean the current Commission has reaffirmed it.
- The report does not separate staff views from Commission views in the PDF. The press release names a separate statement by Commissioner Slaughter and oral remarks by Commissioner Wilson. Neither was read.
- Observations inside the source (not contradictions with another source):
  - n.83 cites the Telemarketing Sales Rule as "16 U.S.C. § 310.2(w)". This appears to be a typo for the CFR title; not verified against the CFR.
  - The Negative Option Policy Statement is dated 28 October 2021 at n.4 and 4 November 2021 at n.100. This is likely the announcement date versus the Federal Register publication date; not verified.
- Appendix A labels are not numbered. The rule-ID slugs above are this project's own choice; confirm the identifier convention in Phase 2 (`docs/rule-schema.md` §3 allows either the source label or a slug with a sequence).
- Many patterns involve truthfulness (scarcity, activity, discounts, paid rankings), which an interface audit cannot establish. Phase 2 should cap such checks at PARTIAL or suspected-risk findings.
- Candidate sources noticed, not researched:
  - ROSCA (T1)
  - the FTC Negative Option Marketing policy statement (2021)
  - the FTC Negative Option Rule and 2026 ANPRM (watch)
  - the FTC Deceptively Formatted Ads policy statement (2015)
  - the FTC rule on unfair or deceptive fees (drip pricing; existence and status unverified here)
  - the FTC/ICPEN/GPEN July 2024 dark-patterns review (press release seen in search results only)
  - the UK CMA Online Choice Architecture paper (2022)
- Trust boundary: no text addressed to an AI agent or instructing actions was found in the fetched ftc.gov pages or the PDF.
