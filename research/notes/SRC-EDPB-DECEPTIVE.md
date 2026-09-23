# SRC-EDPB-DECEPTIVE — Guidelines 03/2022 on deceptive design patterns in social media platform interfaces: how to recognise and avoid them

- Authority: European Data Protection Board (EDPB)
- Canonical URL: https://www.edpb.europa.eu/documents/guideline/guidelines-032022-on-deceptive-design-patterns-in-social-media-platform_en (guideline page). The same page content is also served at https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-032022-deceptive-design-patterns-social-media_en. English PDF: https://www.edpb.europa.eu/system/files/documents/2023-02/edpb_03-2022_guidelines_on_deceptive_design_patterns_in_social_media_platform_interfaces_v2_en_0.pdf
- Version / date: Version 2.0, "Adopted on 14 February 2023" (PDF cover, p. 1). PDF version history (p. 2): Version 2.0, 14 February 2023, adoption after public consultation; Version 1.0, 14 March 2022, adoption for public consultation. The guideline page lists "Version 2.0" with the date 24 February 2023 next to "Final version" (the page does not say whether that is the adoption or publication date; see gaps)
- Source status: CURRENT (the guideline page labels Version 2.0 the final version and shows no supersession notice or newer version on 2026-09-23)
- Superseded by / supersedes: supersedes Version 1.0 (14 March 2022, public consultation draft, which used the term "dark patterns"; v2.0 footnote 3 says v2.0 switched to "deceptive design pattern")
- License / access: open. EDPB copyright page (https://www.edpb.europa.eu/copyright_en): reuse of website information authorized for commercial and non-commercial purposes if the source is acknowledged, the meaning is not distorted, and the EDPB bears no liability; author and source indications must not be removed. The page carries no date. Official versions in the EU languages are linked from the guideline page; a Romanian courtesy translation by third parties is linked with an EDPB disclaimer
- Verified on: 2026-09-23 (guideline page read at both URLs; English PDF fetched from the canonical PDF URL and read in full, 74 pages, 187 numbered paragraphs, 61 examples; copyright page read)
- Tier: T2
- Domains served: OTH-DARK-PATTERNS, OTH-PRIVACY-UX (lead decision 2026-09-23; the content also bears on OTH-CONSENT-UX)

## Scope and applicability

- Official EDPB guidance interpreting the GDPR (Regulation (EU) 2016/679) for the design of social media interfaces. Adopted under GDPR Article 70(1)(e) and EDPB Rules of Procedure Articles 12 and 22 (preamble, p. 8). Member States are to be read as EEA Member States (footnote 1).
- Audience: social media providers as controllers, designers, and users (executive summary; para 1). Usable at design time or to evaluate an existing interface (para 1).
- Definition: deceptive design patterns are interfaces and user journeys that try to push users into unintended, unwilling, or potentially harmful decisions about their personal data, often against their interests and in the platform's favour, generally by exploiting cognitive biases (para 3).
- Interfaces covered: graphical user interfaces on computers and smartphones; some observations may also apply to voice and gesture interfaces (para 2).
- Enforcement boundary: only patterns that may breach the GDPR are covered; the same designs may also breach consumer protection law, and competences can overlap (para 4, footnote 8 citing DSA Article 25(1) and (2) and the UCPD, and the Commission UCPD Notice 2021/C 526/01 section 4.2.7). GDPR breaches are assessed case by case (para 4).
- Vulnerable groups: extra concern for children, the elderly, people with visual impairments, and less digitally literate users (para 7; GDPR Recitals 38, 58, 75 cited).
- Social media only, by the source's own statement: para 8 says deceptive design patterns also occur on websites, cookie banners, online shops, video games, mobile apps, and micropayments, but the guidelines focus solely on social media platforms.
- Project interpretation (not the source's claim): the pattern taxonomy is applied to any interface that processes personal data, including non-social-media websites, PWAs, and apps. Rules derived here must record that they generalize beyond the source's stated scope (see gaps).
- Force: guidelines, not law. The binding anchor for any requirement is the GDPR provision the EDPB cites; the guidance itself sets no conformance levels. Jurisdiction EU/EEA.

## Structure

Front matter: cover, version history, executive summary (pp. 3-5, including a summary of the six categories, a paragraph on relevant GDPR provisions, and a note that Annex I is a "checklist"), table of contents.

1. Scope (paras 1-8): aims, definitions of user interface, user journey, user experience, deceptive design pattern; the six categories (para 5); content-based vs interface-based split (para 6); vulnerable groups (para 7); social-media-only focus (para 8).
2. Principles applicable (paras 9-19): fairness in GDPR Art 5(1)(a) is the starting point and has an "umbrella function" (para 9: every deceptive design pattern fails fairness regardless of other principles); Art 4(11), Art 12, Art 5(1)(b) and (c) (paras 10-11). 2.1 Accountability, Art 5(2) (paras 12-14; screenshots and user research such as A/B tests, eye tracking, interviews can document compliance). 2.2 Transparency, Arts 5(1)(a), 12, 13, 14, 7 (paras 15-17). 2.3 Data protection by design and default, Art 25, with elements from EDPB Guidelines 04/2019 para 70: autonomy, interaction, expectation, consumer choice, power balance, no deception, truthful (paras 18-19).
3. The life cycle of a social media account (paras 20-187), seven use cases in five life-cycle stages. Each use case has: a. description of the context; b. relevant legal provisions (sometimes merged with a); c. deceptive design patterns, split into i. content-based and ii. interface-based, each pattern heading tagged "(Annex I checklist 4.x.y)"; d. best practices (boxed).
   - 3.1 Use case 1: registering an account (paras 21-65, examples 1-11)
   - 3.2 Use case 2a: layered privacy notice (paras 66-85, examples 12-18); 2b: joint controllership information, Art 26(2) (paras 86-87, example 19); 2c: personal data breach communication, Art 34 (paras 88-98, examples 20-25)
   - 3.3 Use case 3a: managing consent (paras 99-120, examples 26-35); 3b: managing data protection settings (paras 121-141, examples 36-43)
   - 3.4 Use case 4: exercising data subject rights, Arts 12, 15-22 (paras 142-157, examples 44-51)
   - 3.5 Use case 5: pausing the account and erasure (paras 158-187, examples 52-61)
4. Annex I (pp. 65-72): list of deceptive design pattern categories and types. Per type: a definition, "Concerned GDPR provisions", and cross-references to use-case examples. States Art 5(1)(a) fairness applies to all patterns and that the list is not exhaustive. Page 72 is an overview figure mapping types to use cases and to five GDPR themes (purpose limitation, data protection by design and default, transparency/information, consent, exercise of rights).
5. Annex II (pp. 73-74): best practices, 20 named items consolidated from the use-case boxes.

Identifier scheme: numbered paragraphs 1-187 (continuous), examples 1-61, Annex I type numbers 4.1.1-4.6.2. Annex II items are named, not numbered.

Normative vs informative, in the source's terms: the whole document is guidance. The guidance restates binding GDPR obligations (worded must/shall when restating the GDPR) and gives the EDPB's reading of when a design infringes them (usually worded "can infringe", "could be considered", "should be avoided"). Examples, illustrations, and best practices are illustrative; the best practices are introduced as EDPB recommendations (UC1 section d) and in Annex II as practices that "can be used". The executive summary, the Annex I list, and the use cases are all stated to be non-exhaustive.

### Taxonomy (Annex I): 6 categories, 16 types

Counts confirmed by the executive summary (pp. 3-4), the table of contents, and Annex I. Category and type definitions paraphrased. GDPR provisions are those Annex I lists under "Concerned GDPR provisions" (article numbers only; Art 5(1)(a) fairness also applies to every type per Annex I introduction).

| Annex I id | Category / type | Paraphrase | Concerned GDPR provisions (Annex I) |
|---|---|---|---|
| 4.1 | Overloading | Burying users under requests, information, options, or possibilities so they stop and keep or accept a data practice | |
| 4.1.1 | Continuous prompting | Repeatedly asking for more data or consent to a new purpose, across one or more devices, until users give in (footnote 82: related to "nagging" in academic literature) | 5(1)(b); 7 with 4(11) (freely given); 7(2) (specific) |
| 4.1.2 | Privacy Maze | Information, a control, or a rights function is hard to find because users must navigate too many pages without an overview | 5(1)(a) with 12(1) (transparency); 5(1)(a) (fairness); 12(1) (easily accessible); 12(2); 7 with 4(11) (informed) |
| 4.1.3 | Too many options | So many choices that users choose nothing or overlook settings | 5(1)(a); 12(1) |
| 4.2 | Skipping | Designing the interface or journey so users forget or do not consider data protection aspects | |
| 4.2.1 | Deceptive snugness | The most data-invasive features and options are enabled by default, relying on the default effect | 25(1) (labelled by design and by default); 4(11) and 6 (consent by default) |
| 4.2.2 | Look over there | A data protection action or information competes with another element that distracts users from their original intent | 5(1)(a); 12(1); 12(2) |
| 4.3 | Stirring | Influencing choices by appealing to emotions or using visual nudges | |
| 4.3.1 | Emotional Steering | Wording or visuals framing information very positively or very negatively (fear, guilt, punishment) to push users against their data protection interests (footnote 83: related to "toying with emotions") | 5(1)(a); 12(1); 12(2); 8 (child's consent); 7 with 4(11) (informed) |
| 4.3.2 | Hidden in plain sight | A visual style or technique for information or controls that nudges users toward less restrictive, more invasive options | 5(1)(a); 7 with 4(11) (freely given); 12(1); 12(2) |
| 4.4 | Obstructing | Hindering or blocking users from getting information or managing data by making the action hard or impossible (footnote 84: related to "obstruction" in Gray et al., CHI 2018) | |
| 4.4.1 | Dead end | A link or redirection to information or a control is broken or missing, so the task cannot be completed | 12(1); 12(2); 25(1) |
| 4.4.2 | Longer than necessary | The protective option takes more steps than the data-invasive one | 12(1); 12(2); 21(1); 7(3); 25(1) |
| 4.4.3 | Misleading action | A mismatch between what the information or control promises and what it does nudges users into unintended actions | 12(1); 5(1)(a); 7(2) with 4(11) |
| 4.5 | Fickle | Unstable, inconsistent design makes it hard to understand processing, choose, or find controls | |
| 4.5.1 | Lacking hierarchy | Data protection information repeated and presented in several ways without structure, confusing users | 12(1); 12(2) |
| 4.5.2 | Decontextualising | Information or a control placed on a page where users would not intuitively look | 12(1) (easily accessible and transparent); 12(2) |
| 4.5.3 | Inconsistent interface | Interface inconsistent across contexts or devices, or against user expectations (for example swapped option positions) | 12(1); 12(2) |
| 4.5.4 | Language discontinuity | Data protection information not provided in the official language(s) of the user's country although the service is | 5(1)(a); 12(1), 13, 14 |
| 4.6 | Left in the dark | Hiding information or controls, or leaving users unsure how data is processed and what control they have | |
| 4.6.1 | Conflicting information | Pieces of information contradict each other, so users do nothing and keep defaults | 5(1)(a); 12(1); 7(2) with 4(11) |
| 4.6.2 | Ambiguous wording or information | Vague or ambiguous terms leave users unsure how data is processed or how to control it | 5(1)(a); 12(1); 7(2) with 4(11); 13; use-case specific provisions (for example 34 for UC 2c) |

Content-based vs interface-based (para 6) is a second, orthogonal classification; the use cases place each pattern example under one of the two.

## Candidate rules

Proposed rule class for all: BEST_PRACTICE (T2 official guidance; the binding requirement is the cited GDPR provision, to be a LEGAL rule from SRC-EU-GDPR once that source is verified, linked with `related_rules`). Category `trust_privacy` (prd.md §10.11); subcategory suggested per row. Platforms: all (source covers web and app GUIs). Jurisdiction: EU. Strength: SHOULD for the pattern-avoidance rules (the source frames patterns as to be avoided and as possible infringements; where it says must, it is restating the GDPR, whose MUST belongs to the GDPR rule). Testability is a guess (automated / visual / manual). Identifier proposal: `EDPB-<Annex I number>` because the source numbers its types (`docs/rule-schema.md` §3); §8 shows `EDPB-overloading-001` as an illustrative example only (see gaps). Body paragraph and example numbers are given as anchors because Annex I example cross-references are unreliable (see gaps).

| proposed id | source anchor | paraphrase (avoid the pattern) | subcategory | testability guess |
|---|---|---|---|---|
| EDPB-4.1.1 | Annex I 4.1.1; paras 32-40 (ex 1-2), 119-120 (ex 35) | Do not repeatedly re-ask for data or consent a user already refused, including blocking prompts on later sessions | consent-clarity | auto NONE / visual PARTIAL / manual PARTIAL (multi-session walk-through) |
| EDPB-4.1.2 | Annex I 4.1.2; paras 79-83 (ex 17), 117-118 (ex 34), 130-131 (ex 38), 150-152 (ex 47-48), 173 (ex 52) | Keep privacy information, controls, and rights functions reachable in few steps from every relevant entry point; layering must not hide content (para 80: no fixed maximum of layers, case by case, user testing advised) | privacy-disclosure-ux | auto PARTIAL (click depth) / visual NONE / manual PARTIAL |
| EDPB-4.1.3 | Annex I 4.1.3; paras 127-128 (ex 36) | Group related data protection settings in one clear location with unambiguous section names instead of many overlapping tabs | privacy-disclosure-ux | auto NONE / visual PARTIAL / manual PARTIAL |
| EDPB-4.2.1 | Annex I 4.2.1; paras 54-60 (ex 9), 135-136 (ex 40), 168 and ex 56 | Default settings must be the least invasive; consent is never pre-ticked or inferred from inactivity; when a deletion flow offers pausing, pausing is not pre-selected | preselection | auto PARTIAL (default checked state of consent and sharing controls) / visual PARTIAL / manual PARTIAL |
| EDPB-4.2.2 | Annex I 4.2.2; paras 97-98 (ex 25), 108-110 (ex 30), 178-179 (ex 57), 183 (ex 59) | Do not let unrelated or distracting content, humour, or side flows compete with or derail a data protection action (for example a data download that does not return to deletion) | privacy-disclosure-ux | auto NONE / visual PARTIAL / manual PARTIAL |
| EDPB-4.3.1 | Annex I 4.3.1; paras 43-48 (ex 4-6), 174 (ex 53) | Present data protection choices neutrally; no guilt, fear, or urgency framing to obtain data or deter rights such as account deletion | confirmshaming | auto NONE (copy heuristics at most) / visual PARTIAL / manual PARTIAL |
| EDPB-4.3.2 | Annex I 4.3.2; paras 50-53, 56-57 (ex 8-9), 137-138 (ex 41), 153-154 (ex 49), ex 35 | Do not make privacy links, refusal options, or controls less visible (small or low-contrast text, missing affordance cues) than data-sharing options; if one option is highlighted it must be the most privacy-protective (para 57) | deceptive-hierarchy | auto PARTIAL (contrast and size of refuse vs accept) / visual PARTIAL / manual PARTIAL |
| EDPB-4.4.1 | Annex I 4.4.1; paras 61-65 (ex 10-11), 84-85 (ex 18), 111-114 (ex 31-32), 145-146 (ex 44) | Every privacy link, setting, and rights function must work and lead to the promised place; controls must visibly reflect the registered state | obstruction | auto PARTIAL (broken links) / visual PARTIAL / manual PARTIAL |
| EDPB-4.4.2 | Annex I 4.4.2; para 49 (ex 7), 115-116 (ex 33), 156-157 (ex 51), 180-182 (ex 58-59) | Protective choices, consent withdrawal, and rights exercise take no more steps than the invasive or consenting path; no confirmation pop-ups only on refusal; no mandatory reasons or questions when exercising a right (one neutral confirmation for account deletion is acceptable, para 162 and ex 58) | obstruction | auto PARTIAL (scripted step counts) / visual NONE / manual PARTIAL |
| EDPB-4.4.3 | Annex I 4.4.3; paras 41-42 (ex 3), 103-106 (ex 28-29) | A control or link must do what its label or context promises (for example a withdraw-consent link leads to the withdrawal function; "No" does not publish) | consent-clarity | auto NONE / visual NONE / manual PARTIAL |
| EDPB-4.5.1 | Annex I 4.5.1; paras 71-72 (ex 13-14) | Structure privacy information with a clear hierarchy, headings, and navigation instead of scattered repetition | privacy-disclosure-ux | auto PARTIAL (heading structure) / visual PARTIAL / manual PARTIAL |
| EDPB-4.5.2 | Annex I 4.5.2; paras 139-141 (ex 42-43), 184-187 (ex 60-61) | Place privacy settings and account deletion under clearly named, expected sections; make the save action obvious | privacy-disclosure-ux | auto NONE / visual PARTIAL / manual PARTIAL |
| EDPB-4.5.3 | Annex I 4.5.3; paras 133-134 (ex 39), 155 (ex 50), 141 | Keep option order, icons, and locations of privacy controls consistent across settings and across desktop, app, and mobile web | privacy-disclosure-ux | auto PARTIAL (option-order comparison) / visual PARTIAL / manual PARTIAL |
| EDPB-4.5.4 | Annex I 4.5.4; paras 75-77 (ex 16), 132, 147 (ex 45) | Provide privacy information and settings in the language the service is offered in, and keep the user's chosen language on privacy pages | privacy-disclosure-ux | auto PARTIAL (page language vs UI locale) / visual NONE / manual PARTIAL |
| EDPB-4.6.1 | Annex I 4.6.1; para 69 (ex 12), 91 (ex 20), 101-102 (ex 26-27), 129 (ex 37) | Do not give contradictory statements or signals about processing; toggle position and colour must agree (ex 26) | consent-clarity | auto NONE / visual PARTIAL / manual PARTIAL |
| EDPB-4.6.2 | Annex I 4.6.2; paras 73-74 (ex 15), 92-96 (ex 21-24), 148-149 (ex 46), 175-176 (ex 54-55) | Use precise wording; avoid conditional or vague terms ("might", "services") and unexplained jargon; label deletion links plainly | privacy-disclosure-ux | auto PARTIAL (hedge and jargon term flags) / visual NONE / manual PARTIAL |

Annex II best practices (20 items) yield optional positive BEST_PRACTICE rules, strength SHOULD or MAY (UC1 section d says the EDPB recommends them; Annex II says they can be used; decide at normalization). Proposed ids `EDPB-annex2-<slug>-001`: shortcuts, bulk options, contact information, reaching the supervisory authority, privacy policy overview, change spotting and comparison, coherent wordings, providing definitions, contrasting data protection elements, data protection onboarding, use of examples, sticky navigation, back to top, notifications, explaining consequences, cross-device consistency, data protection directory, contextual information, self-explanatory URL, exercise of the rights form. Several overlap with general UX heuristics and should crosswalk rather than duplicate.

Evidence note for the auditor: para 13 names screenshots of the user's path and user-research results as accountability evidence, which fits the project's evidence model.

## Cross-references

- GDPR (SRC-EU-GDPR, CANDIDATE): binding anchor for every rule; articles cited are listed per type above. Normalization links each EDPB rule to the matching GDPR LEGAL rule.
- DSA (SRC-EU-DSA, CANDIDATE): footnote 8 cites DSA Article 25(1) (prohibition of deceptive or manipulative online interface design) and 25(2) (exclusion for practices covered by the UCPD or the GDPR); footnote 10 cites DSA Recital 81. Confirm at the DSA canonical text.
- FTC staff report (SRC-FTC-DARK-PATTERNS, CANDIDATE) and Korean e-commerce act (SRC-KR-ECOMMERCE-ACT, CANDIDATE): overlapping taxonomies; crosswalk at normalization.
- EDPB Guidelines 05/2020 on consent: cited as Version 1.1 adopted 4 May 2020 (footnote 25). Discovery hint for SRC-EDPB-CONSENT only; not verified here.
- Other documents cited, not registered: EDPB Guidelines 04/2019 on Article 25 (v2.0, 20 October 2020); Article 29 Working Party guidelines on transparency (endorsed by the EDPB); EDPB Cookie Banner Taskforce report of 17 January 2023; Directive 2005/29/EC (UCPD) and Commission Notice 2021/C 526/01; Directive 2002/58/EC (ePrivacy); CNIL IP Report No. 6 (2019); Norwegian Consumer Council "Deceived by design" (2018); Gray et al., CHI 2018; European Commission behavioural study on dark patterns (2022); OECD "Dark commercial patterns" (2022).
- Related newer EDPB document seen in search results only: Guidelines 3/2025 on the interplay between the DSA and the GDPR (PDF under edpb.europa.eu/system/files/2025-09/). Not fetched; candidate source.
- Project sources: WCAG 2.2 1.4.3 contrast (SRC-W3C-WCAG22) is a see_also for Hidden in plain sight (para 51 names low-contrast grey text); NN/g heuristics (SRC-NNG-HEURISTICS) consistency and user control overlap Fickle and Obstructing; W3C i18n (SRC-W3C-I18N) is a see_also for Language discontinuity.

## Uncertainties and gaps

1. Date labels: the PDF says adopted 14 February 2023; the guideline page shows 24 February 2023 next to "Final version" without saying adoption or publication. The discovery hint "adopted 24 February 2023" is not supported by the PDF. Record both; cite the PDF adoption date.
2. Internal inconsistency, Left in the dark numbering: body headings tag Conflicting information "Annex I checklist 4.6.2" (for example paras 69, 91, 101, 129) and Ambiguous wording "4.6.3" (for example paras 73, 92, 148, 175). Annex I and the table of contents number them 4.6.1 and 4.6.2, and there is no 4.6.3. Proposed rule ids follow the Annex I numbering.
3. Internal inconsistency, Annex I example references: they match the body up to example 25, but many later ones appear shifted by one (for example Privacy Maze cites UC 5 example 51 where the body's UC 5 Privacy Maze example is 52; Dead end cites UC 3a examples 30-31 where the body's are 31-32). Some later ones match (UC 4 examples 47-48, UC 3b example 39, UC 4 example 50). Language discontinuity cites UC 3a examples 26-27, which the body classifies as Conflicting information. The p. 72 overview figure uses the same numbers as Annex I. Cite body paragraphs and example numbers as read in the body, not the Annex I lists.
4. Internal inconsistency, Deceptive snugness legal basis: Annex I lists GDPR Art 25(1) (labelled "by design and by default"); body paras 55 and 136 say the pattern infringes Art 25(2) (data protection by default). Normalization should link both GDPR rules and record the discrepancy.
5. Best-practice cross-references: the UC4 list includes "Data protection controls relation: see use case 3b", but neither UC3b nor Annex II defines it; the "(p. N)" page references in the best-practice boxes do not match v2.0 pagination. Minor.
6. Scope generalization (project interpretation): the source limits itself to social media (para 8) while saying the same patterns occur elsewhere. Applying these rules to other websites, PWAs, and apps is this project's interpretation and must be labelled as such in rule notes and findings.
7. Force and finding type: EDPB guidelines are not binding. Whether a match yields a VIOLATION (via a GDPR LEGAL rule) or a UX_RISK depends on SRC-EU-GDPR verification and `docs/finding-schema.md`; decide at normalization.
8. Identifier format: `docs/rule-schema.md` §3 says to keep public numbering (giving `EDPB-4.1.1`), while §8's illustrative example is `EDPB-overloading-001`. The lead decides.
9. Canonical page URL: two EDPB URLs serve the same page. It is not known which one is canonical; the note uses the `/documents/guideline/` path.
10. Newer related guidance: EDPB Guidelines 3/2025 on the DSA-GDPR interplay were seen in search results only. The 03/2022 page shows no supersession, but the 2025 document may extend deceptive-design guidance; register and verify it separately if needed.
11. Process note: an early attempt to read the PDF through a third-party text-extraction proxy (r.jina.ai, sent only the public canonical PDF URL) returned truncated text, and the fetch tool's summarizing model invented Annex I GDPR mappings and "verbatim" text. All of that was discarded. Every fact in this note comes from the PDF bytes fetched from the canonical EDPB URL and read directly, or from the EDPB pages named above.
12. No text addressed to an AI agent, and no instructions, were found in the fetched EDPB pages or the PDF.
