# SRC-W3C-WCAG2ICT — Guidance on Applying WCAG 2 to Non-Web Information and Communications Technologies (WCAG2ICT)

- Authority: W3C (Accessibility Guidelines Working Group; WCAG2ICT Task Force)
- Canonical URL: https://www.w3.org/TR/wcag2ict-22/ (latest published version). This version at verification: https://www.w3.org/TR/2025/NOTE-wcag2ict-22-20251211/
- Version / date: W3C Group Note, 11 December 2025
- Source status: CURRENT
- Superseded by / supersedes: this "-22" edition supersedes the earlier WCAG2ICT editions that covered WCAG 2.0 only; it now covers WCAG 2.0, 2.1, and 2.2
- License / access: open with limits. W3C Document License (footer links the "document use rules" to https://www.w3.org/copyright/document-license/, the restrictive license, as with WCAG 2.2): copy and distribute with attribution, no derivative works published as a specification. This is the restrictive variant, unlike COGA and ARIA which use the permissive license.
- Verified on: 2026-09-02 (header, status section, scope, structure, and license link read at the canonical URL; scope and per-criterion structure confirmed against the downloaded HTML)
- Tier: T2
- Domains served: A11Y-WCAG2ICT, A11Y-MOBILE-WCAG

## Scope and applicability

- Informative guidance (a Group Note, sets no requirements) on how the WCAG 2.0, 2.1, and 2.2 principles, guidelines, and success criteria apply to non-web ICT: non-web documents and non-web software. It does not change or add to WCAG and does not itself create obligations.
- It covers Level A and Level AA success criteria only; Level AAA is excluded.
- It is the W3C's bridge from WCAG (written for web pages) to non-web platforms, which for this project means native mobile apps (ios, android) and desktop software. It substitutes "document" (non-web content needing a separate user agent) and "software" (applications with embedded content) for "web page", and "set of documents" / "set of software programs" for "set of web pages".
- Because the mobile-mapping FPWD (SRC-W3C-MOBILE-A11Y) is an abandoned 2015 draft, WCAG2ICT is the current source for applying WCAG to non-web mobile contexts, alongside the platform accessibility sources (Apple, Android). This resolves GAP-024.

## Structure

- Organized by WCAG structure: "Applying Principle N ... to Non-Web Documents and Software", then per guideline, then "Applying SC X.Y.Z ... to Non-Web Documents and Software". For each success criterion it quotes the WCAG text and adds "Applying ..." guidance and notes.
- Cross-cutting concepts: definitions remapped for non-web (document, software, set of documents), and a treatment of "closed functionality" (a property that prevents users from attaching, installing, or using assistive technology). Some success criteria are problematic on closed products because they depend on assistive technology; Appendix A lists "Success Criteria Problematic for Closed Functionality".
- It notes that local standards (Section 508, EN 301 549) exempt specific criteria in non-web contexts, but WCAG2ICT itself does not say which criteria can or should apply.
- Normative vs informative: entirely informative.

## Candidate rules

WCAG2ICT yields no new rules. It contributes platform-applicability guidance to the existing WCAG rules (SRC-W3C-WCAG22):

- For each Level A/AA WCAG rule, WCAG2ICT informs whether and how it applies to non-web documents and software, which the registry captures in the WCAG rule's `platforms` field (adding ios, android, desktop where WCAG2ICT says it applies) and in `applicability`/`notes` (the non-web reading and any closed-functionality caveat).
- The "closed functionality" caveat and the Appendix A list of problematic criteria become an applicability annotation on the affected WCAG rules, not standalone rules.

Phase 2 uses this note when setting the `platforms` and `applicability` of WCAG rules; it does not create WCAG2ICT rule IDs. AAA criteria are out of scope here, matching the WCAG registry where AAA rules stay web/pwa unless another source extends them.

## Cross-references

- WCAG 2.2 (SRC-W3C-WCAG22): the standard whose criteria this note re-applies to non-web ICT.
- EN 301 549 (SRC-ETSI-EN301549) and Section 508 (SRC-USAB-SECTION508): both incorporate WCAG and address non-web ICT with their own applicability decisions; crosswalk when those legal sources are verified.
- Apple accessibility (SRC-APPLE-A11Y) and Android accessibility (SRC-GOOGLE-ANDROID-A11Y): platform sources for native mobile; together with WCAG2ICT they cover A11Y-MOBILE-WCAG.

## Uncertainties and gaps

- The restrictive W3C Document License applies (same as WCAG); the GAP-029 assumption about paraphrased rule records covers this note too.
- The exact set of criteria WCAG2ICT flags as "problematic for closed functionality" or as applying differently was not extracted criterion-by-criterion in this session; Phase 2 extracts it when annotating WCAG rule applicability.
- Whether the audit engine should treat native mobile app auditing as in scope now is a phase question (browser/runtime is Phase 5; native device automation is later); WCAG2ICT provides the rule applicability regardless of when the tooling arrives.
- Modeling choice for Phase 2: this note treats WCAG2ICT as annotating WCAG rules' `platforms` and `applicability`, so it mints no WCAG2ICT rule IDs, which would leave the `WCAG2ICT` prefix in `docs/rule-schema.md` §8 unused. The alternative is minting per-criterion WCAG2ICT applicability records linked to the WCAG rules. Decide at Phase 2 alongside the rule-format decision (GAP-002); until then the prefix is reserved.
