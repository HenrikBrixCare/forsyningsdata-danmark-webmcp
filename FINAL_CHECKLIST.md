# Final challenge checklist

## Done

- [x] Public GitHub repository
- [x] MIT license in repository root
- [x] Scoped runnable Next.js challenge app
- [x] 10 WebMCP tools registered
- [x] Official Danish address lookup
- [x] Parcel/property overview contract
- [x] Utility/environment/map/source challenge contracts
- [x] Human-visible profile navigation
- [x] Section focusing via WebMCP
- [x] Interface-language switching without changing `dataCountry`
- [x] `/webmcp-test` diagnostics page
- [x] Manual Chrome/WebMCP regression completed
- [x] GitHub Actions TypeScript check
- [x] GitHub Actions full Next.js production build
- [x] Architecture documentation
- [x] Testing documentation
- [x] 2–3 minute demo script
- [x] Devpost submission copy drafted

## Still needs a human/browser step

- [ ] Verify final live URL from a clean/incognito browser with no Vercel login cookie
- [ ] Record demo video with audio
- [ ] Upload/publish demo video and copy URL
- [ ] Add final live URL + video URL to Devpost
- [ ] Review Devpost preview once
- [ ] Submit — do not leave entry in Draft

## Recommended demo order

`find_address`
→ `get_address_overview`
→ `get_utility_overview`
→ `get_environment_screening`
→ `get_follow_up_sources`
→ `open_address_profile`
→ `focus_address_section(section: "sewer")`
→ `set_interface_language(language: "it")`
→ `get_interface_context`

The judged story should emphasize that WebMCP is not just returning JSON: the agent and the human share the same visible address workflow.
