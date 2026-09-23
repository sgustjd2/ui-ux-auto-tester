# SRC-EU-DSA — Regulation (EU) 2022/2065 (Digital Services Act)

- Authority: European Parliament and Council of the European Union (published in the Official Journal of the European Union; hosted on EUR-Lex by the Publications Office)
- Canonical URL: https://eur-lex.europa.eu/eli/reg/2022/2065/oj (ELI). I read the article text from the authentic English OJ PDF on EUR-Lex: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2065
- Version / date: Regulation (EU) 2022/2065 of the European Parliament and of the Council of 19 October 2022 on a Single Market For Digital Services and amending Directive 2000/31/EC (Digital Services Act), Text with EEA relevance. OJ L 277, 27.10.2022, pp. 1–102. Entry into force on the twentieth day after publication (Art. 93(1)); EUR-Lex gives 16 November 2022. General application from 17 February 2024 (Art. 93(2)). Some provisions have applied since 16 November 2022 (Art. 93(2), second subparagraph), and designated VLOPs/VLOSEs could be bound earlier under Art. 92.
- Source status: CURRENT. EUR-Lex marks it in force with no end-of-validity date.
- Superseded by / supersedes: none. The Regulation deletes Arts. 12–15 of Directive 2000/31/EC (Art. 89) and adds itself to Annex I of Directive (EU) 2020/1828 (Art. 90). EUR-Lex lists one consolidated version (CELEX 02022R2065-20221027) and corrigenda for several non-English language versions. It lists no amending act.
- License / access: open. Under the EUR-Lex legal notice, EU legal documents may be reused commercially and non-commercially (Commission Decision 2011/833/EU). Reusers must acknowledge the source and indicate changes. Consolidated texts and editorial content are CC BY 4.0. Only text published in the OJ is authentic. This note stores identifiers and paraphrases; short quotations appear only where precision matters.
- Verified on: 2026-09-23
- Tier: T1
- Domains served: OTH-DARK-PATTERNS (primary). Secondary provisions (Arts. 12, 14, 16, 17, 20, 21) touch UX-FORMS, UX-HELP and UX-CONTENT-MICROCOPY. The lead decides whether to map them.

## Verification method (2026-09-23)

- ELI page fetched. It confirmed the title, act date (19 October 2022), OJ L 277, 27.10.2022, pp. 1–102, and "in force". The HTML rendering the fetch tool received was cut off inside the recitals, before the articles.
- EUR-Lex document-information page (`legal-content/EN/ALL/?uri=CELEX:32022R2065`) fetched. It showed in force, no end date, one consolidated version (02022R2065-20221027), corrigenda for DE, FR, HU, PL, DA, ET, SL and IT language versions, and legal basis Art. 114 TFEU. The fetch tool's summary gave the application date as "17/02/2022". The OJ text (Art. 93(2)) prints 17 February 2024, and the OJ text is authentic. The "2022" is most likely a transcription error by the fetch tool (see gaps).
- Authentic English OJ PDF (102 pages) retrieved from EUR-Lex and read in full, including recitals 13, 14, 57, 67, 70 and 71 and Arts. 1–3, 12, 14, 16, 17, 19–33, 35, 38, 44, 47, 52, 92 and 93.
- EUR-Lex consolidated-text requests (`CELEX:02022R2065-20221027`) returned only the French consolidated text, even with `EN` in the path. This fits with a consolidation that covers only the language versions that have corrigenda. I used the French text only to confirm structure; all paraphrases below come from the English OJ text.
- EUR-Lex legal notice fetched for the reuse terms.
- Commission and Parliament pages searched for Art. 25 guidelines, Art. 28 guidelines, and the Digital Fairness Act (see Cross-references).
- Prompt-injection check: no fetched page contained text addressed to the agent. The only calls to action were ordinary site prompts ("download the guidelines", legislative-train e-mail subscription), which I ignored.

## Scope and applicability

Jurisdiction and binding force:

- The Regulation is directly applicable in all Member States (closing formula). Rule class LEGAL; jurisdiction `EU`. It is marked Text with EEA relevance; whether and when it was incorporated into the EEA Agreement was not checked.
- Territorial scope (Art. 2(1)): intermediary services offered to recipients established or located in the Union, wherever the provider is established. "Offer services in the Union" requires a substantial connection to the Union (Art. 3(d), (e)): an EU establishment, a significant number of recipients, or targeting of Member States. Recital 8 lists targeting indicators such as language, currency, a national app-store listing, local advertising or customer service. Mere technical accessibility from the Union is not enough.
- Platforms: "online interface" means any software, including a website or part of one, and applications including mobile apps (Art. 3(m)). Candidate rules therefore cover web, PWA, iOS, Android and desktop.

Layered obligations (Chapter III): each layer adds duties to the one before.

1. All intermediary services (mere conduit, caching, hosting; Art. 3(g)): Section 1, Arts. 11–15.
2. Hosting services, including online platforms: Section 2, Arts. 16–18. Recital 50 says the notice-and-action duty applies regardless of size.
3. Online platforms: Section 3, Arts. 19–28. This layer contains Art. 25 (interface design), Art. 26 (advertising), Art. 27 (recommender transparency) and Art. 28 (minors).
4. Online platforms that let consumers conclude distance contracts with traders (marketplaces): Section 4, Arts. 29–32.
5. Very large online platforms (VLOPs) and very large online search engines (VLOSEs): at least 45 million average monthly active recipients in the Union and designated by the Commission (Art. 33(1), (4)). Section 5, Arts. 33–43.

Art. 25 applies only if all of the following hold. Audits must treat these as preconditions, not assumptions:

- The provider operates an online platform: a hosting service that stores and disseminates information to the public at the recipient's request (Art. 3(i)). The exception is dissemination that is a minor and purely ancillary feature of another service, or a minor functionality of the principal service, that cannot for objective technical reasons be used without it, and whose integration is not a way to avoid the Regulation.
  - Recital 13 examples: social networks and marketplaces are online platforms. An online newspaper's comments section can be an ancillary feature. Cloud and web-hosting infrastructure is not an online platform.
  - Recital 14: e-mail and private messaging fall outside the definition. Public groups or open channels can fall inside it.
  - Consequence: many websites and apps are not online platforms, for example a company selling its own goods on its own site or a service that does not host and publicly disseminate recipients' content. Whether a given audit target is an online platform is a legal classification the auditor has to record.
- The provider is not a micro or small enterprise under Recommendation 2003/361/EC, and did not lose that status within the previous 12 months (Art. 19(1)). Designated VLOPs are covered regardless of size (Art. 19(2)). The Section 3 exclusion excepts only Art. 24(3). I did not read the Recommendation's thresholds this session.
- The practice is not covered by Directive 2005/29/EC (Unfair Commercial Practices Directive) or Regulation (EU) 2016/679 (GDPR) (Art. 25(2); recital 67). In effect, most consumer-facing commercial dark patterns fall under the UCPD, and consent and personal-data interfaces fall under the GDPR. Art. 25 covers what remains within DSA scope. How large that remainder is, is an open question (see gaps).
- Art. 25 is addressed to providers of online platforms. Online search engines are a separate defined category (Art. 3(j)), so Art. 25 does not reach them on its text.
- Timing: from 17 February 2024 (Art. 93(2)). Art. 25 is not in the list of provisions that applied from 16 November 2022.

Enforcement: Member State penalty caps are up to 6 % of annual worldwide turnover for failure to comply with an obligation (Art. 52(3)). For VLOPs and VLOSEs, the Commission can impose fines up to 6 % of total worldwide annual turnover (Art. 74(1)). This matters for severity context only.

## Structure

- Preamble with 156 recitals, then 93 articles in five chapters. There are no annexes.
  - Chapter I, General provisions (Arts. 1–3): subject matter, scope, definitions (points (a) to (x)).
  - Chapter II, Liability of providers of intermediary services (Arts. 4–10).
  - Chapter III, Due diligence obligations for a transparent and safe online environment (Arts. 11–48), in six sections. Sections 1 to 5 are the layers above; Section 6 (Arts. 44–48) covers standards, codes of conduct and crisis protocols.
  - Chapter IV, Implementation, cooperation, penalties and enforcement (Arts. 49–88), in six sections.
  - Chapter V, Final provisions (Arts. 89–93).
- Identifier scheme: Article N, paragraph n, point (x), plus unnumbered subparagraphs ("first subparagraph"); recitals (n). Deep links can use the ELI with the CELEX anchor; article-level ELI URIs resolve to the whole act on EUR-Lex.
- Normative vs informative:
  - The articles are binding ("shall", "shall not").
  - The recitals explain and guide interpretation but are not binding. Recital 67 is the main interpretive text on dark patterns.
  - Art. 25(3) empowers the Commission ("may issue guidelines on how paragraph 1 applies to specific practices, notably") and lists three practices. On its wording it is not a separate prohibition. The prohibition is Art. 25(1), and the listed practices are recognised examples of how it applies.
  - Art. 35(1) lists mitigation measures that VLOPs "may" take. Arts. 44–47 are Commission promotion duties for voluntary standards and codes and create no direct obligation on providers.

### Art. 25 in detail (paraphrased)

- 25(1): A provider of an online platform must not design, organise or operate its online interface in a way that deceives or manipulates recipients. It also must not do so in a way that otherwise materially distorts or impairs recipients' ability to make free and informed decisions.
- 25(2): The prohibition does not apply to practices covered by the UCPD (2005/29/EC) or the GDPR (2016/679).
- 25(3): The Commission may issue guidelines on how 25(1) applies to specific practices, notably:
  - (a) giving more prominence to certain choices when asking the recipient for a decision;
  - (b) repeatedly asking the recipient to make a choice already made, especially through pop-ups that interfere with the user experience;
  - (c) making the procedure for terminating a service more difficult than subscribing to it.
- Recital 67 describes dark patterns as practices that materially distort or impair, on purpose or in effect, recipients' ability to make autonomous and informed choices, via the structure, design or functionalities of an interface or part of one. Its examples (paraphrased):
  - exploitative design that steers recipients to actions benefiting the provider;
  - non-neutral presentation of choices, for example visual, auditory or other prominence;
  - repeated requests for a choice already made;
  - cancelling a service being significantly more cumbersome than signing up;
  - some choices being more difficult or time-consuming than others;
  - making it unreasonably difficult to discontinue purchases or to sign out of a marketplace;
  - nudging recipients into transaction decisions;
  - default settings that are very difficult to change.
- Recital 67 limits: the rules do not stop providers from interacting directly with recipients or offering new or additional services. Legitimate practices that comply with Union law, for example in advertising, are not dark patterns in themselves.

### Other UI-relevant articles (briefly, as instructed)

- Art. 26 (online platforms, Section 3), advertising:
  - (1) For each ad shown to each recipient, the recipient must be able to identify, clearly, concisely, unambiguously and in real time: that it is an ad, including through prominent markings; on whose behalf it is presented; who paid, if different; and meaningful information about the main targeting parameters, directly and easily accessible from the ad, plus how to change them where applicable.
  - (2) A functionality for recipients to declare commercial communications, with clear real-time marking of that content for other recipients.
  - (3) No ads based on profiling that uses GDPR special categories of data.
- Art. 27 (online platforms), recommender systems:
  - (1)–(2) The terms and conditions must set out, in plain and intelligible language, the main recommender parameters: the most significant criteria and the reasons for their relative importance, plus any options to modify them.
  - (3) Where several options exist, a functionality to select and change the preferred option at any time. It must be directly and easily accessible from the section of the interface where information is prioritised.
  - Art. 38 adds for VLOPs and VLOSEs at least one recommender option per system that is not based on profiling.
- Art. 28 (online platforms accessible to minors):
  - (1) Appropriate and proportionate measures for a high level of privacy, safety and security of minors.
  - (2) No profiling-based ads when the provider is aware with reasonable certainty that the recipient is a minor.
  - (3) No duty to process additional personal data to determine age.
  - (4) The Commission may issue guidelines on (1); it has done so (see Cross-references).
  - Recital 71: a platform counts as accessible to minors when its terms permit minors, it is directed at or predominantly used by minors, or the provider otherwise knows some recipients are minors.

## Candidate rules

Proposed prefix: `DSA` for SRC-EU-DSA. It is not yet registered in `docs/rule-schema.md` §8, and I have not edited that file. IDs follow the existing legal pattern (`GDPR-art-7-001`, `WAD-art-4-001`): `DSA-art-<article>-<nnn>`, with the paragraph and point kept in `source_url` and `notes`.

Every rule below uses rule class LEGAL, jurisdiction `EU` and platforms `all`, unless the line says otherwise. Each line gives the applicability tag, the paraphrase, normative strength, category/subcategory, and testability as automated/visual/manual (A/V/M).

Applicability tags:

- [OP] = online platform, not micro/small unless VLOP (Art. 19)
- [OP-25] = [OP] plus the Art. 25(2) carve-out (not a UCPD- or GDPR-covered practice)
- [MKT] = marketplace, not micro/small unless VLOP (Art. 29)
- [VLOP] = designated VLOP (and VLOSE where the article says so)
- [HS] = any hosting service
- [IS] = any intermediary service

Core, for OTH-DARK-PATTERNS:

- DSA-art-25-001, Art. 25(1) [OP-25]: The interface must not be designed, organised or operated to deceive or manipulate recipients. MUST. trust_privacy / deceptive-hierarchy (the choice depends on the practice; notes). A NONE, V PARTIAL, M PARTIAL.
- DSA-art-25-002, Art. 25(1) [OP-25]: The interface must not otherwise materially distort or impair recipients' ability to make free and informed decisions. MUST. trust_privacy (subcategory per practice). A NONE, V PARTIAL, M PARTIAL.
- DSA-art-25-003, Art. 25(3)(a) with recital 67 [OP-25]: When asking for a decision, options should not be presented with unequal prominence (visual, auditory or other) that steers the choice. Recognised example under 25(1). INFORMATIVE; links `narrower` to 25-002. trust_privacy / deceptive-hierarchy. A PARTIAL (computed-style comparison of paired choice controls), V PARTIAL, M PARTIAL.
- DSA-art-25-004, Art. 25(3)(b) with recital 67 [OP-25]: The recipient should not be asked again for a choice already made, especially through interrupting pop-ups. Recognised example. INFORMATIVE; narrower to 25-002. trust_privacy / obstruction (no "nagging" slug exists; see gaps). A PARTIAL (re-prompt detection across page loads or sessions after a decline), V PARTIAL, M PARTIAL.
- DSA-art-25-005, Art. 25(3)(c) with recital 67 [OP-25]: Terminating a service should not be more difficult than subscribing to it. Recital 67 says "significantly more cumbersome". Recognised example. INFORMATIVE; narrower to 25-002. trust_privacy / difficult-cancellation. A PARTIAL (step and channel count of the sign-up flow vs the cancellation flow), V NONE, M PARTIAL.
- DSA-art-25-006, recital 67 [OP-25]: Some choices should not be made more difficult or time-consuming than others. INFORMATIVE; interprets 25(1). trust_privacy / obstruction. A PARTIAL, V NONE, M PARTIAL.
- DSA-art-25-007, recital 67 [OP-25; the purchase and sign-out example concerns marketplaces]: It should not be unreasonably difficult to discontinue a purchase or to sign out. INFORMATIVE. trust_privacy / obstruction. A PARTIAL, V NONE, M PARTIAL.
- DSA-art-25-008, recital 67 [OP-25]: Default settings should not be very difficult to change in a way that unreasonably biases decisions. INFORMATIVE. trust_privacy / preselection. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-26-001, Art. 26(1)(a) [OP]: Each ad must be identifiable as an ad, clearly, concisely, unambiguously and in real time, including through prominent markings. MUST. trust_privacy / disguised-ads. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-26-002, Art. 26(1)(b)–(c) [OP]: Each ad must show on whose behalf it is presented and, if different, who paid. MUST. trust_privacy / disguised-ads. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-26-003, Art. 26(1)(d) [OP]: Meaningful information on the main targeting parameters must be directly and easily accessible from the ad, including how to change them where applicable. MUST. trust_privacy / privacy-disclosure-ux. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-26-004, Art. 26(2) [OP]: Recipients must have a functionality to declare commercial communications, and declared content must be clearly marked in real time for other recipients. MUST. trust_privacy / disguised-ads. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-27-001, Art. 27(1)–(2) [OP]: The terms and conditions must set out the main recommender parameters (most significant criteria and reasons for their weight) and any user options, in plain and intelligible language. MUST. content_cognition (subcategory to be chosen; see gaps). A NONE, V NONE, M PARTIAL.
- DSA-art-27-002, Art. 27(3) [OP]: Where several ranking options exist, a control to select or change the preferred option at any time must be directly and easily accessible from the section where information is prioritised. MUST. Category open (see gaps). A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-38-001, Art. 38 [VLOP and VLOSE]: At least one option per recommender system not based on profiling. MUST. Category open. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-28-001, Art. 28(1) [OP, accessible to minors per recital 71]: Appropriate and proportionate measures for a high level of privacy, safety and security of minors. The provision is open-textured. The Commission guidelines (C/2025/5519) operationalise it and are a separate source, not yet registered. MUST. trust_privacy. A NONE, V NONE, M PARTIAL.
- DSA-art-28-002, Art. 28(2) [OP]: No profiling-based ads to a recipient the provider knows with reasonable certainty is a minor. MUST. trust_privacy. A NONE, V NONE, M PARTIAL. This is a backend property with low UI observability.

Secondary UI-relevant, for lead mapping (other domains):

- DSA-art-12-001, Art. 12(1) [IS; no size exemption found]: A single electronic point of contact for recipients, user-friendly, letting recipients choose a means of communication that does not rely solely on automated tools. A chatbot-only channel fails. MUST. A PARTIAL, V NONE, M PARTIAL.
- DSA-art-14-001, Art. 14(1) [IS]: Restrictions in the terms and conditions, including content-moderation policies and complaint rules, stated in clear, plain, intelligible, user-friendly and unambiguous language, and publicly available in an easily accessible, machine-readable format. MUST. content_cognition. A PARTIAL, V NONE, M PARTIAL.
- DSA-art-14-002, Art. 14(3) [IS primarily directed at or predominantly used by minors]: Conditions and restrictions explained in a way minors can understand. MUST. content_cognition. A NONE, V NONE, M PARTIAL.
- DSA-art-14-003, Art. 14(5) [VLOP and VLOSE]: A concise, easily accessible, machine-readable summary of the terms and conditions, including remedies and redress, in clear and unambiguous language. MUST. A PARTIAL, V NONE, M PARTIAL.
- DSA-art-16-001, Art. 16(1)–(2) [HS, any size per recital 50]: The illegal-content notice mechanism must be easy to access, user-friendly and electronic, and must make it easy to submit the Art. 16(2) elements: reasons, exact location or URL, name and e-mail except for the listed child-abuse offences, and a good-faith statement. MUST. forms. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-17-001, Art. 17(3)(f) and 17(4) [HS]: Statements of reasons must be clear, easily comprehensible and specific, with user-friendly redress information. MUST. content_cognition. A NONE, V NONE, M PARTIAL.
- DSA-art-20-001, Art. 20(1) and 20(3) [OP]: An electronic, free internal complaint system that is easy to access and user-friendly. MUST. forms. A PARTIAL, V NONE, M PARTIAL.
- DSA-art-21-001, Art. 21(1), second subparagraph [OP]: Information on out-of-court dispute settlement must be easily accessible on the interface, clear and user-friendly. MUST. A PARTIAL, V NONE, M PARTIAL.
- DSA-art-30-001, Art. 30(7) [MKT]: Trader name, address, telephone, e-mail, trade-register details and self-certification shown clearly and accessibly, at least where the product or service information is presented. MUST. trust_privacy. A PARTIAL, V PARTIAL, M PARTIAL.
- DSA-art-31-001, Art. 31(1)–(2) [MKT]: The interface must let traders provide pre-contractual, compliance and product-safety information, product identification, trader signs and labelling. MUST. Mostly observable on the trader-facing side. A NONE, V NONE, M PARTIAL.
- DSA-art-35-001, Art. 35(1)(k) [VLOP and VLOSE]: As a possible mitigation measure, prominently mark generated or manipulated media (deepfakes) and offer an easy flagging function. MAY (listed option). A PARTIAL, V PARTIAL, M PARTIAL.

These articles yield no rules:

- Art. 44(1)(b), (h), (i): the Commission promotes voluntary standards for communicating terms and conditions, ad markings, and recommender choice interfaces. Watch item: any resulting standard is a future source candidate.
- Art. 47 and recital 105: codes of conduct for accessibility (perceivable, operable, understandable, robust). These are voluntary. Crosswalk `see_also` to the WCAG and EAA rules.

## Cross-references

- Directive 2005/29/EC (UCPD) and Regulation (EU) 2016/679 (GDPR) are carved out of Art. 25 by Art. 25(2). SRC-EU-GDPR was a CANDIDATE when this note was written and is now VERIFIED (2026-09-23). The UCPD is not registered; it is a candidate source (see gaps). Crosswalk relation to dark-pattern rules from those instruments: `overlaps`, with a note that the DSA rule yields where the other instrument covers the practice.
- SRC-EDPB-DECEPTIVE (EDPB Guidelines 03/2022; VERIFIED 2026-09-23 in its own note): GDPR-side interface guidance. Likely crosswalk `see_also` or `overlaps` for consent and personal-data interfaces.
- EDPB Guidelines 3/2025 on the interplay between the DSA and the GDPR: seen in search results (edpb.europa.eu PDF, dated 2025-09, "v1"), not read. Relevant to where the Art. 25(2) GDPR carve-out falls. Candidate source.
- Commission guidelines under Art. 28(4): "Guidelines on measures to ensure a high level of privacy, safety and security for minors online". The Commission page gives the publication date as 14 July 2025 and the OJ reference as C/2025/5519. The page says the guidelines exclude micro and small enterprises, are voluntary, do not guarantee compliance, and will be used by the Commission to assess Art. 28(1). It also mentions disabling persuasive, engagement-driven design features by default. Candidate source. I read only the landing page.
- Art. 25(3) guidelines: none found. The Commission DSA policy page (last updated 9 September 2026) describes the dark-pattern ban but lists no Art. 25 guidelines, and targeted searches of europa.eu found none. This absence is not proven (see gaps).
- Digital Fairness Act: the European Parliament Legislative Train (edition last updated 01/08/2026) lists it as announced in the Commission Work Programme 2026 (COM(2025) 870) and expected in Q4 2026, targeting dark patterns, addictive design, and unfair personalisation among other things. No proposal existed at the check. Watch item: it may later change the dark-pattern legal layer.
- SRC-EU-EAA: Art. 3(v) DSA borrows the EAA definition of persons with disabilities; Art. 47 promotes accessibility codes. Relation `see_also` only.
- Recommendation 2003/361/EC (SME definition): it determines the Art. 19 and Art. 29 exclusions and was not read this session.

## Uncertainties and gaps

Mirror each item into `research/gaps.md`. The lead assigns IDs.

1. OPEN_QUESTION: How large is Art. 25's residual scope after the Art. 25(2) carve-out? Any consumer-facing commercial practice covered by the UCPD, and any consent or personal-data interface covered by the GDPR, falls outside Art. 25. The text does not say which dark patterns remain, for example toward business users, in non-commercial decisions, or in non-personal-data choices. Phase 2 must decide how an Art. 25 finding is qualified. Suggested approach: cite Art. 25 only with a stated applicability assessment, and otherwise route to UCPD or GDPR rules.
2. INCOMPLETE: The UCPD (Directive 2005/29/EC, as amended, including by Directive (EU) 2019/2161) and the Commission's UCPD guidance are not registered. Under Art. 25(2) they are the primary EU law for most consumer-facing dark patterns, so OTH-DARK-PATTERNS lacks its main EU consumer-law anchor. Candidate rows: SRC-EU-UCPD, plus the Commission UCPD guidance notice. I did not verify the guidance's identifier.
3. OPEN_QUESTION: Classifying the audit target. An Art. 25–28 rule applies only if the target is an "online platform" (Art. 3(i), recitals 13–14) and the provider is not a micro or small enterprise, unless it is a VLOP (Art. 19). Neither fact is observable from the UI alone. The audit scope needs an input for these, or findings must be marked conditional. This connects to jurisdiction defaults (GAP-010).
4. OPEN_QUESTION: Normative strength of the Art. 25(3) examples and recital 67. Art. 25(3) empowers the Commission and is not a per-se prohibition; recital 67 is non-binding. This note proposes INFORMATIVE example rules linked `narrower` to the MUST rules from Art. 25(1). Phase 2 must confirm this against the `docs/rule-schema.md` §7 step 6 mapping. It also affects whether such findings can be VIOLATION or only UX_RISK (see GAP-026 for the related question on MUST rules).
5. OPEN_QUESTION: Threshold wording. Art. 25(3)(c) says "more difficult" and recital 67 says "significantly more cumbersome". The two passages differ in threshold; this is not a contradiction between sources, but the difference affects how a cancellation-parity check is calibrated.
6. INCOMPLETE: No Commission guidelines under Art. 25(3) were found on official EU pages at 2026-09-23, but a negative search does not prove they do not exist. Re-check before Phase 2 normalises DSA rules.
7. INCOMPLETE: The Commission Art. 28 minors guidelines (C/2025/5519, published 14 July 2025 per the Commission page) are not registered, and I read only the landing page. Candidate source for OTH-DARK-PATTERNS (persuasive design) and possibly OTH-PRIVACY-UX.
8. INCOMPLETE: EDPB Guidelines 3/2025 on the DSA–GDPR interplay were seen in search results only. Candidate source.
9. OPEN_QUESTION: Subcategory gaps in the `prd.md` §10.11 list. There is no slug for nagging or repeated prompts (Art. 25(3)(b)), for recommender-choice controls (Arts. 27(3), 38), or for ad-targeting transparency (Art. 26(1)(d)). This note used obstruction and privacy-disclosure-ux as nearest fits and left recommender controls open. Only the user can change `prd.md`.
10. INCOMPLETE: Tool artefact to confirm. The EUR-Lex document-information page, as summarised by the fetch tool, gave "17/02/2022 – Application (See Art 93.2)". The authentic OJ text of Art. 93(2) says 17 February 2024. I treat the OJ as authoritative, per the EUR-Lex legal notice. The lead should look at the ALL page directly; if it really prints 2022, record it as a EUR-Lex metadata error, not as a CONTRADICTION between T1 sources. RESOLVED after review (2026-09-23): the EUR-Lex document-information page shows application from 17 February 2024; the 2022 date was a summarizer artefact.
11. INCOMPLETE: The absence of English-language corrigenda and of amending acts rests on the fetch tool's summary of the EUR-Lex ALL page. The French consolidated header lists two corrigenda: OJ L 310, 1.12.2022, p. 17, and a 2024 corrigendum whose reference the tool garbled. Confirm that no English corrigendum or amendment exists before normalising any wording. Review (2026-09-23): no English corrigendum is listed; EUR-Lex shows the Regulation as completed by delegated acts 32023R1127, 32024R0436, and 32025R2050 (delegated acts, not amendments), per the research reviewer.
12. OPEN_QUESTION: EEA applicability. The act is marked Text with EEA relevance; whether and when it was incorporated into the EEA Agreement was not checked. It matters only if EEA states are enabled as jurisdictions (GAP-010, GAP-023).
13. OPEN_QUESTION: Watch item for the Digital Fairness Act, expected Q4 2026 per the EP Legislative Train of 01/08/2026. It may add or restructure EU dark-pattern rules. Re-check at the next re-verification.
