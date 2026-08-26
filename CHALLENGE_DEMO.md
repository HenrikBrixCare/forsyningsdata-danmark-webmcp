# Forsyningsdata Danmark — WebMCP Challenge 2026 Demo

## Demo goal
Show that an AI agent can use structured WebMCP tools to move from a Danish address to verified property and utility context, preserve source/limitation information, open the human-readable profile, focus the exact section being discussed, and change interface language without changing the active data country.

## Recommended demo address
Vonsyldsgade 11, 9000 Aalborg

Canonical access-address ID used in regression tests:
`0a3f509c-e673-32b8-e044-0003ba298018`

## 2–3 minute demo flow

1. Open `/webmcp-test` in Chrome with WebMCP testing enabled.
2. Show that Chrome discovers all expected challenge tools.
3. Run `find_address` with `Vonsyldsgade 11, 9000 Aalborg`.
4. Use the returned address ID with `get_address_overview`.
5. Run `get_utility_overview` and point out documented sewer/water context plus limitations.
6. Run `get_environment_screening` and show that screening never becomes a false final risk conclusion.
7. Run `get_follow_up_sources` and show original local/authority sources and human follow-up checks.
8. Run `open_address_profile` so the human sees the same address context on the page.
9. Run `focus_address_section` with `section: "sewer"` so the profile moves directly to the sewer section.
10. Run `set_interface_language` with `language: "it"` (or `pl`) to show the same Danish data in another interface language while `dataCountry` remains `DK`.

## Suggested narration

“Public property and infrastructure information is fragmented across official national datasets, municipal portals and specialist sources. Forsyningsdata Danmark gives an AI agent a structured way to work with those sources instead of guessing from the DOM. The agent can find the address, retrieve verified property and utility context, distinguish documented facts from screening, show the original sources a person should verify, and move the human interface to the same section it is talking about. The interface language can change independently from the active data country, so an international contractor can work with Danish source data without pretending that another country connector is already live.”

## Safety / trust points to mention

- Public/authorized sources only.
- Screening is decision support, not excavation-safe pipe geometry or a final authority decision.
- Source names and limitations travel with the results.
- Planned non-Danish connectors are never presented as active coverage.
- Human-readable profile remains part of the workflow; the agent can navigate/focus the same information for the person.

## Demo prompt idea

“Find Vonsyldsgade 11, 9000 Aalborg. Give me the verified property and utility overview, separate documented facts from screening, show me the original sources I should check, open the address profile, focus the sewer section, and then show the interface in Italian without changing the data country.”
