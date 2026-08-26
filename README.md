# Forsyningsdata Danmark — WebMCP Challenge 2026

Forsyningsdata Danmark is an address-first Danish public-data application that demonstrates how a website can expose structured actions to AI agents through WebMCP while keeping a human-readable interface, source attribution and limitations in the loop.

## Live challenge preview

The challenge branch used for the recorded/manual demo is currently available at:

`https://forsyningsdata-danmark-git-webmcp-challenge-2026-tilbudstjek.vercel.app`

Before final Devpost submission, this URL will be verified from a clean browser with no Vercel/login cookie.

Recommended regression/demo address:

`Vonsyldsgade 11, 9000 Aalborg`

Canonical access-address ID:

`0a3f509c-e673-32b8-e044-0003ba298018`

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/webmcp-test` in a WebMCP-enabled browser.

For Chrome challenge testing, enable the WebMCP testing flag and use the Model Context Tool Inspector to inspect and execute the registered tools.

## Why WebMCP

Public property and infrastructure information is fragmented across national registries, planning datasets and municipality-specific sources. A normal browser agent has to infer meaning from page structure. WebMCP gives the agent explicit, typed actions for the workflow instead.

The challenge build lets an agent move from an ordinary address to verified, structured context and then hand control back to the person at the exact part of the visible profile that matters.

## Demo workflow

Using `Vonsyldsgade 11, 9000 Aalborg` as the regression/demo address, the agent can:

1. find the official Danish address and stable ID,
2. retrieve parcel/BFE/lot-area and available property context,
3. retrieve sewer, water and orienting utility context,
4. run an orienting environmental screening,
5. list relevant official map layers,
6. return original local/authority sources and recommended human checks,
7. open the human-readable address profile,
8. focus the exact profile section being discussed,
9. read the active country/language context,
10. change the visible interface language without changing the active data country.

## WebMCP tools

- `get_interface_context`
- `set_interface_language`
- `find_address`
- `get_address_overview`
- `get_utility_overview`
- `get_environment_screening`
- `list_available_map_layers`
- `get_follow_up_sources`
- `open_address_profile`
- `focus_address_section`

## Human + agent design

The agent is not intended to replace the visible application. Structured results and the human-readable profile are two views of the same workflow.

For example, after retrieving sewer information, the agent can call `focus_address_section` with `section: "sewer"`. The page then moves to the sewer section so the person can inspect the same source context visually.

The agent can also change the interface language while the active data country remains Denmark. This demonstrates that **language and data jurisdiction are separate concepts**: an international contractor can work with Danish source data in another interface language without the application pretending that another country's connector is already live.

## Trust and safety principles

- Public or authorized source data only.
- Source attribution and limitation text travel with structured results.
- Screening is decision support, not excavation-safe pipe geometry.
- Missing/negative screening results are not converted into unsupported “no risk” conclusions.
- Planned country connectors are never presented as active data coverage.
- Human follow-up is explicitly surfaced when exact drawings, permits, pipe locations or authority decisions are required.

## Diagnostics

The scoped public demo includes `/webmcp-test`, which reports whether `document.modelContext` is available and shows the 10 expected challenge tools. The browser's Model Context Tool Inspector is the authoritative view of tools actually discovered in a session.

The live challenge branch was manually verified in Chrome from address search through property/utility/environment calls, map-layer listing, source handoff, profile navigation/focus and language switching.

## Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — WebMCP architecture and human/agent flow
- [`JUDGING.md`](JUDGING.md) — how the build maps to the four judging criteria
- [`TESTING.md`](TESTING.md) — reproducible Chrome/WebMCP regression steps
- [`WEBMCP_SECURITY.md`](WEBMCP_SECURITY.md) — trust boundaries, hints and constrained visible actions
- [`DATA_SOURCES.md`](DATA_SOURCES.md) — public data sources and attribution
- [`WHAT_CHANGED_FOR_CHALLENGE.md`](WHAT_CHANGED_FOR_CHALLENGE.md) — pre-existing vs challenge-period work
- [`CHALLENGE_DEMO.md`](CHALLENGE_DEMO.md) — core demo flow
- [`VIDEO_SHOTLIST.md`](VIDEO_SHOTLIST.md) — timed <3-minute recording plan
- [`YOUTUBE_UPLOAD.md`](YOUTUBE_UPLOAD.md) — prepared upload title/description/checks
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — clean public-judge deployment instructions
- [`DEVPOST_SUBMISSION.md`](DEVPOST_SUBMISSION.md) — prepared submission copy
- [`FINAL_CHECKLIST.md`](FINAL_CHECKLIST.md) — completed and remaining submission steps

## Stack

- Next.js 15
- React 19
- TypeScript
- Vercel
- WebMCP experimental browser API (`document.modelContext.registerTool`)
- Danish public/authorized data sources used by the scoped demo

## Existing project disclosure

Forsyningsdata Danmark existed before the challenge as an unfinished web application for exploring Danish property and public geospatial data. During the challenge period it was significantly extended with a new WebMCP integration that exposes structured address, property, utility, environment, source, interface and visible-profile actions to AI agents. Challenge-specific WebMCP development is documented through repository commits.

## Public challenge scope

This repository is intentionally **not** a dump of the pre-existing commercial/private application. It contains the scoped, runnable, reviewable WebMCP challenge contribution and a minimal supporting data/UI layer.

The live challenge preview integrates the same WebMCP interaction model with the pre-existing private product data layer. Proprietary municipality adapters, unrelated commercial logic, credentials, account/payment flows and non-challenge strategy are excluded from this public repository.

## License

MIT — see `LICENSE`.
