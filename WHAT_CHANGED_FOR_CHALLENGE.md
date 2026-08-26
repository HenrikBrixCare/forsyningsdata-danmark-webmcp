# What changed for the WebMCP Challenge

Forsyningsdata Danmark existed before the WebMCP Challenge as an unfinished Danish address/property/public-data application. The pre-existing product already had a human-facing address workflow and data adapters.

The WebMCP work was intentionally isolated on the private product branch `webmcp-challenge-2026`, created from pre-challenge base commit:

`16b1219a907950d929e9707c8c6cd2fda8e28557`

The challenge branch has a substantial timestamped sequence of commits created after the challenge opened. The exact commit count is intentionally not frozen in this document because challenge work continues during the submission period; the Git history and base commit above are the authoritative audit trail.

## Challenge-period additions

The comparison from the pre-challenge base to `webmcp-challenge-2026` shows challenge-specific work including:

- `.github/workflows/webmcp-check.yml`
- `CHALLENGE_DEMO.md`
- six challenge API routes under `app/api/webmcp/`
- `app/components/WebMCPTools.tsx`
- `app/components/WebMCPLanguageTools.tsx`
- `app/components/WebMCPProfileTools.tsx`
- `app/webmcp-test/page.tsx`
- new language/locale support used by the WebMCP interface-language action
- challenge-specific Devpost/demo/judge-testing documentation
- public-repository scope and license preparation
- small challenge-period modifications to the existing address workflow so the WebMCP tools can use stable official access-address identifiers

## What existed before

The pre-existing application already contained the core Forsyningsdata Danmark concept, existing address UI/product pages and non-WebMCP product/data logic. Those pre-existing parts are not being presented as challenge-period work.

## Why the public repository is separate

The challenge rules require a public open-source repository, while the pre-existing commercial product contains unrelated proprietary code and integrations. This public repository therefore contains the scoped, runnable WebMCP challenge implementation and supporting demo layer rather than publishing the entire pre-existing product.

## Evidence

The challenge branch has a timestamped commit history beginning after the challenge opened. The pre-challenge base SHA above gives judges a stable comparison point, while the challenge branch and this public repository expose the WebMCP-specific implementation and documentation created during the submission period.

This separation is deliberate: judges can evaluate the WebMCP work without having to treat pre-existing commercial functionality as new challenge work.
