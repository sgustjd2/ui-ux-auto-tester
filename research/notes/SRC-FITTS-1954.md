# SRC-FITTS-1954 — Fitts (1954), The information capacity of the human motor system in controlling the amplitude of movement

- Authority: Paul M. Fitts; published by the American Psychological Association in the Journal of Experimental Psychology
- Canonical URL: https://doi.org/10.1037/h0055392 (resolves to the APA PsycNet record)
- Version / date: Journal of Experimental Psychology, 47(6), 381–391, 1954 (Crossref metadata and the PsycNet record agree)
- Source status: CURRENT (a published peer-reviewed article; no retraction or correction notice on the record)
- Superseded by / supersedes: none; later work (for example the Shannon formulation used in HCI) refines the model but does not withdraw the paper
- License / access: paywalled; the PsycNet record states that all rights, including for text and data mining and AI training, are reserved by the APA. Only bibliographic metadata and a short paraphrase of the abstract are stored; the full text was not read
- Verified on: 2026-09-23 (Crossref record read via api.crossref.org; PsycNet record and abstract read in the browser)
- Tier: T3 (peer-reviewed primary paper, `docs/standards-research-plan.md` §3)
- Domains served: UX-INTERACTION-LAWS

## Scope and applicability

- The primary source of Fitts's Law. The abstract reports three experiments testing whether the average duration of a movement is proportional to the minimum average information per movement, and finds the rate of performance roughly constant across a wide range of movement amplitudes and tolerances (target widths).
- Interface relevance (this project's application, not a claim of the paper): pointer and touch targets that are larger and closer to the starting point are acquired faster, which grounds heuristic checks on target size, spacing, and placement of frequent actions. The paper concerns human motor performance in general, not interfaces.
- Rule class HEURISTIC (explanatory principle, `prd.md` §7.3); never a compliance requirement. Normative target-size requirements come from WCAG 2.5.5 and 2.5.8 and platform guidance, which this law can explain but not replace.

## Structure

Journal article: abstract, three experiments, results, discussion, 25 references (per the abstract record). Full text not read.

## Candidate rules

- FITTS-target-acquisition-001: frequently used or critical targets are large enough and close enough to their likely pointer start (for example primary actions close to the content they act on) that acquisition is not slowed; HEURISTIC, SHOULD; testability automated PARTIAL (bounding boxes and distances), visual PARTIAL, manual FULL. Produces UX_RISK only.
- Crosswalk: `related_rules: see_also` to WCAG 2.5.8 and 2.5.5 and to the platform touch-target rules; the WCAG rule stays the VIOLATION anchor.

## Cross-references

- Laws of UX (SRC-LAWSOFUX-INDEX): T4 discovery index that led here.
- NN/g articles (SRC-NNG-ARTICLES): practitioner explanation of the law for interfaces (article cited in that note).
- WCAG 2.2 (SRC-W3C-WCAG22) 2.5.5 and 2.5.8; Apple HIG and Android accessibility touch-target guidance.

## Uncertainties and gaps

- Full text not read (paywalled); the index-of-difficulty formulation and constants are not recorded here and must not be quoted from memory.
