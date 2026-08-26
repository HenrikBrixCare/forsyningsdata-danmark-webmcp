# Judging alignment

This page maps the challenge implementation to the four equally weighted WebMCP Challenge judging criteria.

## 1. WebMCP Leverage

The project exposes a non-trivial chain of 10 browser-native WebMCP tools rather than a single showcase action.

The tools cover:

- context (`get_interface_context`, `set_interface_language`),
- official address resolution (`find_address`),
- structured property/utility/environment/source retrieval,
- visible human handoff (`open_address_profile`, `focus_address_section`).

The important WebMCP behavior is not only structured retrieval. The agent can also change the visible state of the same web application the person is looking at.

## 2. Execution

This is a runnable Next.js application, not a standalone API or static tool-registration sample.

It includes:

- a human-readable address profile,
- a `/webmcp-test` diagnostics page,
- server routes behind the structured tools,
- progressive enhancement when WebMCP is unavailable,
- Chrome/WebMCP regression instructions,
- GitHub Actions TypeScript and production-build verification.

## 3. Potential Impact

The specific problem is fragmented property and infrastructure information around a physical address.

The intended audience includes people planning excavation, renovation, property work and professional project preparation. Today, the user often needs to know which registry, map layer, municipal source or utility portal to consult. The product reverses that burden: start from the address, then let the application/agent identify the relevant evidence and required human checks.

The challenge demo deliberately preserves limitations because infrastructure decisions can have real consequences. Screening is not silently upgraded into certainty.

## 4. Creativity & Ambition

The concept treats a website as a shared workspace for a person and an agent rather than as a page to scrape.

Two details are central:

1. `focus_address_section` lets the agent move the human interface to the exact evidence it is discussing.
2. interface language and data jurisdiction are separate. The agent can switch the visible language while `dataCountry` remains Denmark, allowing an international user to work with Danish source data without pretending another country's data connector is live.

The longer-term architecture is country-connector friendly, but the challenge build intentionally demonstrates only Danish data coverage so ambition does not become unsupported claims.

## Existing-project boundary

Forsyningsdata Danmark existed before the challenge. The WebMCP tool layer, challenge APIs, diagnostics, visible agent actions and challenge-specific human/agent interaction were added during the submission period and are documented in the commit history.
