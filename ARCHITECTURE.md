# Architecture — Forsyningsdata Danmark WebMCP

The challenge implementation keeps the agent workflow explicit and reviewable.

```mermaid
flowchart LR
  U[Human user] <--> UI[Visible address interface]
  A[Browser AI agent] --> MCP[WebMCP tools\ndocument.modelContext.registerTool]
  MCP --> API[/api/webmcp/*]
  API --> DAR[Dataforsyningen / DAR]
  API --> MAT[Dataforsyningen / Matriklen]
  API --> PUB[Scoped public-data screening and source contracts]
  MCP --> UI
```

## Design principles

1. **Address first** — the agent resolves a normal Danish address to a stable official identifier before requesting downstream context.
2. **Typed actions instead of DOM guessing** — WebMCP exposes named tools with JSON Schema inputs.
3. **Read vs act is explicit** — data tools are read-only; `open_address_profile`, `focus_address_section` and `set_interface_language` intentionally change visible browser state.
4. **Human and agent share the same workflow** — the agent can move the visible profile to the section it is discussing instead of returning an opaque agent-only answer.
5. **Jurisdiction and language are separate** — the interface language can change while `dataCountry` remains `DK`.
6. **Limitations travel with results** — screening is not presented as excavation-safe geometry or an authority decision.

## Tool groups

### Context
- `get_interface_context`
- `set_interface_language`

### Address and property
- `find_address`
- `get_address_overview`

### Utility and environment decision support
- `get_utility_overview`
- `get_environment_screening`
- `list_available_map_layers`
- `get_follow_up_sources`

### Human-visible actions
- `open_address_profile`
- `focus_address_section`

## Public challenge scope

This repository is a scoped, runnable challenge implementation. It demonstrates the WebMCP contracts, official address/parcel lookup, diagnostics and human-visible actions without publishing unrelated commercial product code, credentials or private integration strategy.
