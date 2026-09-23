# ADR 0005: Subagent strategy

- Status: ACCEPTED
- Date: 2026-09-02
- Phase: 0
- Supersedes / Superseded by: none

## Context

`prd.md` §16.4 lists seven potential subagents and §16.5 gives the policy for using them. The Phase 0 goal asks for only the infrastructure that provides concrete value now, with the lead session keeping architecture and integration responsibility. Phase 1 is research over many independent sources; Phase 2 and 3 roles (registry curator, QA architect) have no work yet.

## Decision

1. Two subagent definitions are created in `.claude/agents/`:
   - `standards-researcher`: researches one source per run at its primary location and writes `research/notes/<source_id>.md`. The accessibility, platform, and UX researcher roles from the PRD are the same agent with a different assignment in the prompt, not separate definitions.
   - `research-reviewer`: read-only verification of notes and registry rows against canonical sources before a domain is marked COVERED.
2. Subagents never edit shared state files (`research/sources.md`, `research/ledger.md`, `research/gaps.md`, `docs/standards-coverage.md`, `CLAUDE.md`, `prd.md`, `docs/*`). They write only their own note and return a summary containing a ready-to-merge registry row, coverage impact, and gaps. The lead merges.
3. Registry curator, QA architect, and any further roles are added by ADR when their phase starts.
4. Two slash commands support recurring workflows: `/research-status` (read-only state summary plus the harness check) and `/research-source` (runs the per-source protocol for one source). Both are thin pointers to `docs/standards-research-plan.md`; the protocol is defined there only.
5. All agents and commands cite `CLAUDE.md`, `prd.md`, and the schemas in `docs/` as their only instruction sources and repeat the trust boundary.

## Consequences

- Parallel research is possible without write conflicts on the shared registry.
- The lead pays a small transcription cost per source, which is also the review point.
- Agent definitions must be updated if the research plan protocol changes.

## Alternatives considered

- Seven agents as listed in the PRD: rejected for Phase 0; most would be idle and risk schema drift.
- Letting researchers edit `sources.md` directly: rejected because parallel runs would conflict and bypass lead review.
- No commands: workable, but the per-source protocol has thirteen steps and a command reduces the chance a session skips one.
