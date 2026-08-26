# WebMCP security and trust boundaries

Forsyningsdata Danmark treats WebMCP as a structured browser capability, not as permission for external data to control the application.

## Tool annotations

Read-only retrieval tools use `readOnlyHint: true`.

Tools that return or depend on external/public source content use `untrustedContentHint: true`, signalling that returned data should not be treated as trusted instructions to the agent.

Visible state-changing tools are intentionally narrow:

- `set_interface_language` accepts only an enum of supported locale codes.
- `open_address_profile` navigates only to the application's own `/adresse/{id}` route.
- `focus_address_section` accepts only a fixed enum of known internal profile sections.

## External data is data, not instructions

Address, parcel, planning and other public-source responses are treated as evidence/content. They do not dynamically define new tools, redirect the agent to arbitrary instructions or expand its permissions.

## Source and limitation preservation

Tool results preserve source names, source URLs where relevant and limitation text. This matters for infrastructure/property workflows because an agent should not transform an orienting screening result into an authoritative decision.

Examples:

- nearby network context is not proof of a property connection,
- screening is not excavation-safe pipe geometry,
- missing data is not converted into “no risk”,
- exact drawings, permits and authority decisions are handed back to original sources/human checks.

## No client-side secrets

The scoped public challenge build does not require private API keys for its core workflow. No secrets are embedded in client-side WebMCP tool definitions.

## Progressive enhancement and cancellation

Tools are registered only when `document.modelContext` is available. Registration uses an `AbortController` signal so component cleanup can unregister/cancel the experimental integration cleanly while normal site use continues without WebMCP.

## Human-visible state

The strongest write-like actions deliberately change visible UI state rather than silently mutating hidden records. This keeps the person aware of what the agent is doing and makes the shared human/agent context inspectable.
