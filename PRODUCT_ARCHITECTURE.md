# Jejakarsa — Product Architecture & Expanded Concept
ADMIN-http://localhost:3000/admin/review
## 1. Product definition

**Jejakarsa is an Opportunity Intelligence & Action Platform.** It helps students move from discovering a competition to understanding its conditions, deciding whether it is worth pursuing, and managing the work required to participate.

The product should not compete on the raw number of listings alone. Its intended advantage is the quality of the decision path around each listing.

### Product promise

For every opportunity, help the user answer:

1. What is this opportunity?
2. Where did this information come from?
3. Which mandatory requirements fit my profile?
4. Which requirements remain uncertain?
5. What practical trade-offs should I consider?
6. What can I do next?

## 2. Core product loop

```text
DISCOVER
  ↓
UNDERSTAND
  ↓
DECIDE
  ↓
PURSUE
  ↓
LEARN
  ↺
DISCOVER (with better context)
```

- **Discover:** intent-based search, categories, closing dates, and contextual recommendations.
- **Understand:** readable competition detail, structured requirements, and source evidence.
- **Decide:** eligibility assessment, comparison, budget/readiness signals, and transparent rationale.
- **Pursue:** saved opportunities, per-competition checklist, notes, status, and milestones.
- **Learn:** field guides, documented case studies, and permissioned artifacts.

## 3. Product areas and responsibility boundaries

### A. Opportunity discovery

Primary user question: *What is worth looking at?*

Capabilities:
- Full text search across name, organizer, category, discipline, theme, and summary.
- Multi-dimensional filters (level, participation format, fee, delivery mode, region, category).
- Sort by deadline, recency, or name.
- A personalized discovery view should explain the reason behind each suggestion.
- A saved search or alert can be introduced only after the data freshness process is reliable.

Design constraint: a user's preference (for example, online-only) should not hide all other opportunities by default. Make filters reversible and show why a record is included or excluded.

### B. Eligibility engine

Primary user question: *Am I allowed to participate?*

Keep the outcome separate from preference fit. Suggested statuses:

- `eligible`: all mandatory, known, verified requirements match.
- `not_eligible`: at least one mandatory, known, verified requirement conflicts with the profile.
- `needs_review`: one or more mandatory conditions are ambiguous, missing, or not verified.
- `incomplete_profile`: required user context has not been provided.

Rule principles:
- Absence of a restriction is not proof of permission.
- `unknown` must remain a first-class state.
- An AI-extracted value must carry the exact source evidence used to interpret it.
- A hard eligibility rule must never be overridden by a high preference score.
- A budget or team-readiness issue is usually a feasibility signal, not automatically an eligibility failure.
- Keep rule evaluation explainable and deterministic. Use AI for extraction/assistance, not as an untraceable final authority.

### C. Decision support

Primary user question: *Which of these opportunities should I prioritize?*

Show a comparison across:
- Mandatory eligibility.
- Registration fee and estimated non-registration costs (when known).
- Deadline and remaining preparation window.
- Individual/team format and team size.
- Mode and location.
- Submission artifacts.
- User interests and readiness constraints.

Do not publish a single percentage score until the meaning, data coverage, weighting, and validation of that score are understood. Start with a fit profile and human-readable reasons.

### D. Action workspace

Primary user question: *How do I move forward?*

Each saved opportunity receives:
- A status (saved, evaluating, preparing, submitted, completed).
- A source-linked requirement checklist.
- A preparation checklist, clearly distinguished from organizer-mandated items.
- Notes and team/role information (later).
- Official deadline and optional user-created milestones.
- An activity trail and update timestamp (later).

A competition-specific workspace is preferable to a generic task manager. Keep every task linked to a requirement, deliverable, or preparation step.

### E. Knowledge and playbook

Primary user question: *What can I learn before I begin?*

Content types:
- Field guides (repeatable methods).
- Case studies (specific documented projects).
- Winner journeys (firsthand accounts with consent and context).
- Artifact library (permissioned examples such as pitch decks, proposals, user flows, or code repositories).
- Pattern notes (cross-case lessons, only when there is enough evidence).

Do not turn one person's anecdote into a universal rule. Make source, context, date, and limitations visible.

### F. Curator / review desk

Primary operator question: *Can this record be trusted enough to publish?*

The demo includes a lightweight review desk. A production review desk should support:
- Source registration and source type.
- Document/page capture and content versioning.
- Extraction preview beside source evidence.
- Per-field review, not only one record-level approve button.
- High-impact field flags (deadline, participant eligibility, fee, team requirements, submission method).
- Review ownership, timestamp, reviewer note, and change history.
- Stale data queue and source-change alerts.
- Public status transition only after review requirements are satisfied.

## 4. Experience architecture

| Route | Main purpose | Primary interaction |
|---|---|---|
| Home | Opportunity gateway | Search, set up profile, enter discovery |
| Explore | Opportunity discovery | Search, filter, sort, save, compare |
| Opportunity detail | Decision center | Inspect facts, eligibility, evidence, requirements |
| Compare | Trade-off analysis | Compare up to three opportunities |
| Workspace | Execution management | Status, checklist, notes |
| Profile | Personal context | Academic information and preferences |
| Playbook | Knowledge discovery | Browse and read field notes |
| Review desk | Data curation | Inspect source coverage and review state |
| About | Product explanation | Understand scope and limitations |

Homepage should not become a control room containing every capability. It should orient the user and route them into the right context.

## 5. Data model direction

The current `Competition` type is a prototype seed model. A production database should normalize its critical parts.

### Opportunity

- id, slug, title, organizer, category, discipline, description, theme
- registration start/deadline and event dates (separate fields)
- fee amount, fee currency, fee status, known extra cost fields
- participation format, team min/max
- accepted education levels, majors/program restrictions, geographic restrictions
- mode, location, language, prize (only when supported by source)
- lifecycle status (draft, review, published, stale, archived)

### Requirement

- id, opportunity_id, field, operator, accepted_values, mandatory
- normalized interpretation
- verification state and confidence
- whether it is eligibility-critical or a preference/readiness signal

### Evidence

- id, source_id, requirement_id, page/section, exact excerpt
- source version/hash, captured_at, published_at if known
- evidence status and reviewer note

### Source

- canonical URL, organizer, source type (official page, guidebook, FAQ, registration portal)
- fetched_at, content hash, document storage key
- source authority and availability status

### Opportunity revision

Store immutable snapshots of fields that can affect participant decisions. A changed deadline or participant rule must be visible as a revision, not silently overwritten.

### User profile and workspace

Keep profile data, personal preferences, saved opportunities, notes, and task progress separate from public opportunity records. The prototype uses `localStorage`; production can move to database-backed per-user records when authentication and cross-device sync are justified.

## 6. Data ingestion and governance

Suggested lifecycle:

```text
Official source
  → capture / fetch
  → document parsing
  → candidate structured fields
  → evidence linking
  → automated sanity checks
  → human review
  → publish
  → freshness monitoring
  → revision or archive
```

Automated checks may detect missing deadlines, impossible date order, currency/fee ambiguity, missing page citations, contradictory team sizes, or a dead source link. They do not establish eligibility by themselves.

Suggested field confidence is not enough on its own. Keep distinct values for:
- extraction confidence (how likely the parser read the text correctly),
- source authority (whether the source is official),
- review state (whether a human checked the interpretation), and
- freshness (when the source was last checked).

These dimensions should not be collapsed into one vague `verified=true` flag.

## 7. Matching logic

### Eligibility layer

Hard rules are evaluated only when the relevant source and user data are sufficiently complete. Outcomes should include match, mismatch, unknown, and not applicable.

### Fit/readiness layer

Evaluate independently:
- interest fit,
- budget fit,
- mode preference,
- deadline feasibility,
- team readiness,
- expected effort (only if evidence exists),
- capability/discipline fit (with clear caveats).

A recommendation should include reasons such as:
- “Matches your selected discipline.”
- “No registration fee is listed.”
- “The online format matches your preference.”
- “The required team has at least three members; you currently have one available.”

Do not write “best for you” unless the system can support that claim with enough context.

## 8. Roadmap and dependency order

### Phase 1 — Trustable discovery foundation
- opportunity schema and source provenance
- search and filter
- detail pages
- eligibility rules and evidence UI
- curation workflow

### Phase 2 — Decision intelligence
- comparison
- preference profile
- transparent fit/readiness reasons
- deadline feasibility
- saved searches

### Phase 3 — Action workspace
- accounts and sync (only when needed)
- competition checklist templates
- progress timeline and reminders
- activity history

### Phase 4 — Knowledge ecosystem
- verified case studies
- permissioned artifacts
- cross-case pattern library
- team discovery (with moderation and privacy controls)
- participant portfolio/history

Do not build team formation or complex collaboration before the platform has enough active users and moderation capacity.

## 9. Product metrics

Measure successful decisions and follow-through, not only page views.

- Search-to-detail open rate.
- Percentage of detail views where users inspect evidence.
- Profile completion rate (without forcing all fields).
- Saved-to-evaluating conversion.
- Evaluating-to-preparing conversion.
- Checklist progress and submission self-report rate.
- Stale-source rate.
- Correction rate for critical fields.
- Time from official source change to published correction.
- User-reported false eligibility assessment rate.

## 10. Current implementation map

What is implemented in the included Next.js prototype:
- App Router pages and responsive layout.
- Fictional opportunity seed data.
- Client-side search/filter/sort.
- Rule-based eligibility evaluation.
- Evidence excerpt display.
- Local profile, compare list, saved opportunities, notes, and checklist state.
- Demo API routes.
- Demo curation desk.

What remains a production integration:
- database and migrations,
- authentication and cloud sync,
- source ingestion/crawling,
- PDF/document extraction,
- real AI-assisted field extraction,
- audit-grade human review,
- source freshness monitoring,
- notifications,
- analytics and error monitoring.
