# Testing the WebMCP challenge build

## Browser setup

The challenge flow was verified in Google Chrome with WebMCP testing enabled at:

`chrome://flags/#enable-webmcp-testing`

After enabling the flag, relaunch Chrome. The Model Context Tool Inspector extension can be used to inspect registered tools and execute them manually.

## Regression address

`Vonsyldsgade 11, 9000 Aalborg`

Canonical access-address ID used during regression testing:

`0a3f509c-e673-32b8-e044-0003ba298018`

## Expected tools

The page should expose 10 tools:

1. `get_interface_context`
2. `set_interface_language`
3. `find_address`
4. `get_address_overview`
5. `get_utility_overview`
6. `get_environment_screening`
7. `list_available_map_layers`
8. `get_follow_up_sources`
9. `open_address_profile`
10. `focus_address_section`

## Recommended manual regression flow

1. Run `find_address` with `Vonsyldsgade 11, 9000 Aalborg`.
2. Pass the returned stable ID to `get_address_overview`.
3. Run `get_utility_overview`.
4. Run `get_environment_screening`.
5. Run `list_available_map_layers`.
6. Run `get_follow_up_sources`.
7. Run `open_address_profile`.
8. Run `focus_address_section` with `section: "sewer"` and verify that the visible profile moves to the sewer section.
9. Run `set_interface_language` with `language: "it"` or `"pl"`.
10. Run `get_interface_context` and verify that the interface language changed while `dataCountry` remains `DK`.

## Verified behavior

The challenge regression was manually completed in Chrome on 26 August 2026. The visible focus action returned `action: "focused"` while the browser moved to the sewer section, and language switching preserved the Danish data-country context.

## Build verification

GitHub Actions runs on every push to `main` and performs:

- dependency installation,
- TypeScript checking,
- a full Next.js production build.

The public repository passed both TypeScript and Next.js build checks after publication.

## Trust checks

When evaluating results, preserve the source and limitation fields. Screening outputs are decision support; they are not excavation-safe pipe geometry, laboratory results or authority decisions.
