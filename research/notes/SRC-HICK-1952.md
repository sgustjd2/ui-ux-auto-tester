# SRC-HICK-1952 — Hick (1952), On the rate of gain of information

- Authority: W. E. Hick; published in the Quarterly Journal of Experimental Psychology (now SAGE Publications; copyright 1952 Experimental Psychology Society)
- Canonical URL: https://doi.org/10.1080/17470215208416600 (resolves to the SAGE Journals record)
- Version / date: Quarterly Journal of Experimental Psychology, 4(1), 11–26, first published March 1952 (Crossref metadata and the SAGE record agree)
- Source status: CURRENT (published peer-reviewed article; no retraction or correction notice on the record)
- Superseded by / supersedes: none; Hyman (1953) extended the finding (the Hick-Hyman law) and is not registered
- License / access: restricted access at SAGE; copyright 1952 Experimental Psychology Society. Only bibliographic metadata and a short paraphrase of the abstract are stored; the full text was not read
- Verified on: 2026-09-23 (Crossref record read via api.crossref.org; SAGE record and abstract read in the browser)
- Tier: T3 (peer-reviewed primary paper)
- Domains served: UX-INTERACTION-LAWS

## Scope and applicability

- The primary source of Hick's Law. The abstract applies information theory to choice-reaction-time experiments (up to ten alternatives, and a ten-choice task with deliberate errors) and reports that the rate of gain of information is roughly constant, of the order of five bits per second, with reaction times related to the uncertainty about which response is required.
- Interface relevance (this project's application): decision time grows with the number and uncertainty of options, which grounds heuristic checks on choice overload, menu and option-set size, and highlighting a recommended choice. The paper is about reaction time to stimuli, not interface menus; the step to interfaces is an interpretation that practitioner sources make explicitly.
- Rule class HEURISTIC; never a compliance requirement.

## Structure

Journal article: abstract, two experiment types, analysis of reaction-time distributions against uncertainty, discussion of possible models (the abstract says tests against the data were inconclusive), references. Full text not read.

## Candidate rules

- HICK-choice-load-001: decisions on a critical path do not present more equally weighted options than the task needs; long option sets are grouped, filtered, or given a sensible default or recommendation; HEURISTIC, SHOULD; testability visual PARTIAL, manual FULL, persona signal (Primary Action and Confidence tests). Produces UX_RISK or supports a USER_SIGNAL, never a VIOLATION.

## Cross-references

- Laws of UX (SRC-LAWSOFUX-INDEX), NN/g articles (SRC-NNG-ARTICLES), W3C COGA (SRC-W3C-COGA) on reducing cognitive load.

## Uncertainties and gaps

- Full text not read; the logarithmic formulation commonly quoted for the law is not recorded from this source and must not be quoted from memory.
- Hyman (1953) not registered; register only if a rule needs the Hick-Hyman refinement.
