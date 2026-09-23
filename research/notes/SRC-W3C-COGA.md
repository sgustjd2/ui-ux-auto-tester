# SRC-W3C-COGA — Making Content Usable for People with Cognitive and Learning Disabilities

- Authority: W3C Web Accessibility Initiative (WAI), Cognitive and Learning Disabilities Accessibility Task Force (COGA) under the Accessibility Guidelines Working Group and Accessible Platform Architectures Working Group
- Canonical URL: https://www.w3.org/TR/coga-usable/ (latest published version). This version at verification: https://www.w3.org/TR/2021/NOTE-coga-usable-20210429/
- Version / date: W3C Working Group Note, 29 April 2021
- Source status: CURRENT (latest published version; it is a Note, and the status section says it "is a draft document and may be updated, replaced or obsoleted by other documents at any time")
- Superseded by / supersedes: none
- License / access: open. W3C Software and Document License (the footer's "permissive document license" links to the Software and Document License); copy, modify, distribute with notice.
- Verified on: 2026-09-02 (header, status section, and the eight objectives read at the canonical URL; objective titles confirmed against the downloaded HTML)
- Tier: T2
- Domains served: A11Y-COGA, UX-COGNITIVE-LOAD

## Scope and applicability

- Informative guidance for authors of web content and applications on making content usable for people with cognitive and learning disabilities. It is a Working Group Note, not a Recommendation, and sets no requirements.
- Platforms: web and pwa primarily; its objectives are platform-neutral usability guidance and inform native platforms too.
- Relationship to WCAG: COGA complements WCAG. Several of its recommendations informed WCAG 2.2 additions (3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication) and WCAG AAA criteria (for example 3.1.5 Reading Level). COGA guidance beyond WCAG is best practice, not conformance.

## Structure

- Eight numbered Objectives (confirmed verbatim from the HTML), each with a set of numbered design patterns in the Design Guide (section 4):
  1. Help Users Understand What Things are and How to Use Them
  2. Help Users Find What They Need
  3. Use Clear and Understandable Content
  4. Help Users Avoid Mistakes and Know How to Correct Them
  5. Help Users Focus
  6. Ensure Processes Do Not Rely on Memory
  7. Provide Help and Support
  8. Support Adaptation and Personalization
- Supporting sections: User Stories, Design Guide (the objectives and their design patterns), Personas, and usability-testing guidance. Appendix A maps objectives to user needs, personas, and patterns.
- Normative vs informative: entirely informative (a Note).

## Candidate rules

COGA yields BEST_PRACTICE rules in the cognitive-accessibility and content-cognition categories, organized as one family per objective, drawn from the numbered design patterns in section 4. Each family is a candidate; the specific design patterns are extracted in Phase 2 from the Design Guide. Class is BEST_PRACTICE (W3C guidance, no conformance force); where a pattern is also required by a WCAG criterion, the NORMATIVE rule is the WCAG rule and the COGA rule links to it.

These use the `COGA-` prefix registered in `docs/rule-schema.md` §8 (rule_class BEST_PRACTICE is independent of the prefix), one family per objective:

| candidate family | objective | category / subcategory |
|---|---|---|
| COGA-obj1 | 1 Help Users Understand What Things are and How to Use Them | content_cognition / recognition-vs-recall |
| COGA-obj2 | 2 Help Users Find What They Need | navigation_ia / information-scent |
| COGA-obj3 | 3 Use Clear and Understandable Content | content_cognition / readability |
| COGA-obj4 | 4 Help Users Avoid Mistakes and Know How to Correct Them | forms / error-prevention |
| COGA-obj5 | 5 Help Users Focus | content_cognition / distraction |
| COGA-obj6 | 6 Ensure Processes Do Not Rely on Memory | content_cognition / memory-burden |
| COGA-obj7 | 7 Provide Help and Support | content_cognition / help |
| COGA-obj8 | 8 Support Adaptation and Personalization | content_cognition / progressive-disclosure |

## Cross-references

- WCAG 2.2 (SRC-W3C-WCAG22): COGA informs several WCAG criteria; crosswalk at normalization.
- The COGA task force also produces "Content Usable" supporting material and issue papers; register only if Phase 2 needs a specific pattern's evidence.

## Uncertainties and gaps

- The Note is a "draft document" that may be updated; re-verify per `docs/standards-research-plan.md` §5 and when extracting patterns.
- Design patterns were not extracted rule-by-rule in this session (the note records the eight objective families and the section-4 location); Phase 2 extracts the numbered patterns.
- COGA patterns overlap heavily with WCAG and with general UX heuristics (Nielsen, forms UX); normalization must crosswalk rather than duplicate.
