# Devpost submission draft — WebMCP Challenge 2026

## Project name
Forsyningsdata Danmark — WebMCP

## Elevator pitch
An AI-agent-ready address platform that lets users explore Danish property and infrastructure data through WebMCP — turning fragmented public datasets into clear, interactive answers with visible human follow-up.

## Submission type
Individual / working solo

## Existing project disclosure
Forsyningsdata Danmark existed before the challenge as an unfinished web application for exploring Danish public property and geospatial data. For the WebMCP Challenge, the project has been significantly extended with a new WebMCP integration that exposes structured address, property, utility, environment, source, interface and visible-profile actions to AI agents. The WebMCP functionality and challenge-specific development were created during the competition period and are documented through repository commits.

## Inspiration
Public property and infrastructure information is often technically public but practically fragmented. A person planning excavation, renovation, purchase or project work may have to understand which national registry, planning dataset, municipal portal or utility source applies to one address.

Forsyningsdata Danmark starts from the opposite direction: the user should know the address, not the data bureaucracy behind it.

The WebMCP Challenge made it possible to extend that idea from a human-facing application into a human + agent workflow, where an AI agent can use explicit website tools instead of trying to infer the product from buttons and page structure.

## What it does
The challenge build exposes structured WebMCP tools that let an agent:

- find a verified Danish address,
- retrieve parcel/BFE/lot-area context,
- retrieve utility decision-support context,
- run orienting environmental screening,
- list relevant official map-layer contracts,
- return original-source and human follow-up guidance,
- open the human-readable address profile,
- focus the exact profile section being discussed,
- read country/language context,
- change the visible interface language without changing the active data country.

This creates a shared workflow between the agent and the person. The agent can retrieve structured data, but it can also move the visible application to the same section so the person can inspect source context and limitations directly.

## How it is built
The application uses Next.js 15, React 19 and TypeScript and is deployed on Vercel.

The challenge integration uses the WebMCP imperative API through `document.modelContext.registerTool(...)`. Tools use JSON Schema inputs and are registered as progressive enhancement, so the website continues to function normally in browsers without WebMCP enabled.

The structured tools call challenge-specific server routes under `/api/webmcp/`. The address workflow uses official Danish address identifiers from Dataforsyningen / DAR and preserves source and limitation information throughout downstream responses.

Visible WebMCP actions are also included: an agent can open the address profile, focus a specific profile section, and change interface language while preserving the Danish data-country context.

## Why WebMCP fits
Without WebMCP, an agent has to infer the meaning of page controls and reason over presentation-oriented DOM. That is fragile and disconnects the agent from the product's own decision logic.

With WebMCP, Forsyningsdata Danmark exposes an explicit contract: find the address, retrieve structured context, preserve limitations, surface original sources, and move the person to the same information when human review is needed.

This is particularly important for property and infrastructure information because a plausible-sounding answer is not enough. The distinction between documented facts, orienting screening and required human/original-source control is part of the tool output itself.

## Human + agent experience
The strongest challenge flow is:

1. the agent finds the address,
2. retrieves structured property and utility context,
3. separates documented findings from screening,
4. surfaces original sources and required follow-up,
5. opens the human-readable address profile,
6. focuses the section the user asks about,
7. optionally changes interface language while the data country remains Denmark.

The person therefore remains in control of the visible application rather than receiving an opaque agent-only result.

## Trust / safety design
- Public or authorized sources only.
- Source names and limitations travel with tool results.
- Screening is decision support, not excavation-safe pipe geometry or a final authority decision.
- Negative/missing screening is not converted into an unsupported “no risk” conclusion.
- Planned non-Danish country connectors are never presented as active data coverage.
- Original sources and human checks are surfaced when exact drawings, permits, pipe locations or authority decisions are required.

## Challenge implementation / testing
The challenge build includes a `/webmcp-test` diagnostics page that checks whether `document.modelContext` is available and lists the expected tools.

The WebMCP flow was manually tested in Google Chrome with WebMCP testing enabled and the Model Context Tool Inspector. The regression address is Vonsyldsgade 11, 9000 Aalborg.

Verified chain:

`find_address → get_address_overview → get_utility_overview → get_environment_screening → list_available_map_layers → get_follow_up_sources → open_address_profile → focus_address_section → set_interface_language / get_interface_context`

## Built with
WebMCP · Next.js · React · TypeScript · Vercel · Dataforsyningen · Danish public geospatial data

## AI used during development
ChatGPT by OpenAI was used extensively for product development, architecture, technical planning, debugging, code review, UX, WebMCP implementation planning and project documentation.

## Learning / new technology
Significant. WebMCP is experimental and the challenge work included learning the imperative tool-registration API, browser testing workflow, tool input schemas, progressive enhancement, human-visible actions and the separation between structured agent output and visible user-interface state.

## Submission links
- Public GitHub repository: https://github.com/HenrikBrixCare/forsyningsdata-danmark-webmcp
- Current challenge preview candidate: https://forsyningsdata-danmark-git-webmcp-challenge-2026-tilbudstjek.vercel.app
- Demo video: TODO after recording

## Final checks still required
- Verify the final live URL without a Vercel/login cookie in a clean/incognito browser.
- Record the 2–3 minute demo with audio.
- Put the final video URL into Devpost.
- Make sure the working product appears in the first ~15 seconds.
- Keep non-Danish connectors clearly marked as planned, not live.
- Submit the Devpost entry before the deadline; do not leave it in Draft.

Current Devpost schedule shows the deadline as Sep 3, 2026 at 1:00pm PDT (22:00 CEST in Denmark).
