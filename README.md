# Forsyningsdata Danmark — WebMCP Challenge 2026

Forsyningsdata Danmark is an address-first Danish public-data application that demonstrates how a website can expose structured actions to AI agents through WebMCP while keeping a human-readable interface, source attribution and limitations in the loop.

## Why WebMCP

Public property and infrastructure information is fragmented across national registries, planning datasets and municipality-specific sources. A normal browser agent has to infer meaning from page structure. WebMCP gives the agent explicit, typed actions for the workflow instead.

The challenge build lets an agent move from an ordinary address to verified, structured context and then hand control back to the person at the exact part of the visible profile that matters.

## Demo workflow

Using `Vonsyldsgade 11, 9000 Aalborg` as the regression/demo address, the agent can:

1. find the official Danish address and stable ID,
2. retrieve parcel/BFE/lot-area and available BBR context,
3. retrieve sewer, drainage, water and orienting gas-network context,
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

The challenge build includes `/webmcp-test`, which reports whether `document.modelContext` is available and lists the WebMCP tools actually discovered by the browser.

Chrome testing was performed with the WebMCP testing flag enabled and the Model Context Tool Inspector. The regression flow was manually verified from address search through profile focus and language switching.

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

This repository contains the scoped, reviewable WebMCP challenge implementation and supporting demo code. The separate commercial/private product repository is not part of this public challenge submission.

## License

MIT — see `LICENSE`.
