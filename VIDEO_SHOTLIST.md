# Demo video shot list — target 2:35–2:50

The official challenge requires a public YouTube demo with audio and judges are not required to watch beyond three minutes. The first seconds should show the working product, not slides.

## 0:00–0:15 — Show the product immediately

**On screen:** Forsyningsdata Danmark challenge preview and the WebMCP inspector side by side.

**Narration:**
“Forsyningsdata Danmark starts with one thing the user already knows: an address. WebMCP lets an agent use the product’s own structured actions instead of guessing from the page.”

## 0:15–0:35 — Prove WebMCP is real

**On screen:** `/webmcp-test` or inspector showing the registered tools.

Call out that there are 10 tools spanning address resolution, structured evidence, source handoff and visible UI actions.

## 0:35–0:55 — Resolve the address

Run `find_address` with:

```json
{"query":"Vonsyldsgade 11, 9000 Aalborg"}
```

Point out the stable official address ID from Dataforsyningen / DAR.

## 0:55–1:20 — Structured property + utility context

Run `get_address_overview`, then `get_utility_overview` with the returned ID.

**Narration focus:** the agent is using explicit product contracts, and results carry source/limitation context rather than just plausible prose.

## 1:20–1:40 — Screening vs certainty

Run `get_environment_screening` or `get_follow_up_sources`.

**Narration:**
“The tool distinguishes screening from documented facts and tells the user when an original source or human control is still required.”

## 1:40–2:05 — Human + agent moment

Run `open_address_profile`, then:

```json
{
  "addressId":"0a3f509c-e673-32b8-e044-0003ba298018",
  "section":"sewer"
}
```

with `focus_address_section`.

**On screen:** the visible profile moves to “Kloak & regnvand”.

**Narration:**
“This is the part I care most about: the agent does not replace the web app. It moves the human interface to the same evidence it is talking about.”

## 2:05–2:25 — International-language concept without fake coverage

Run:

```json
{"language":"it"}
```

with `set_interface_language`, then `get_interface_context`.

Show that `language` is Italian while `dataCountry` is still `DK`.

**Narration:**
“Language and data jurisdiction are separate. An international contractor can use Danish source data in another interface language without us pretending Italian data coverage is already live.”

## 2:25–2:45 — Close on the product value

**Narration:**
“WebMCP turns a fragmented address-data workflow into a shared workspace for a person and an agent: structured tools for speed, visible sources and limitations for trust, and the human interface still in control.”

**On screen:** address profile + inspector/tools.

## Recording rules

- Keep total video below 3:00.
- Use microphone narration; no copyrighted background music.
- Avoid long JSON reading — point to one or two fields and move on.
- Keep the browser zoom/readability high enough for judges.
- Do not spend video time on setup, Chrome flags, GitHub or Vercel dashboards.
- Do not claim non-Danish source-data coverage is live.
- Make sure the final YouTube upload is Public, not Private/Unlisted if the submission rule requires publicly visible access.
