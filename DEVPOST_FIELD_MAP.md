# Devpost field map

Use this as the short field-by-field reference when completing the final submission form.

## Project name

**Forsyningsdata Danmark — WebMCP**

## Elevator pitch

**An AI-agent-ready address platform that lets users explore Danish property and infrastructure data through WebMCP — turning fragmented public datasets into clear, interactive answers with visible human follow-up.**

## Entrant / team

**Individual / Working solo**

## New or existing project

**Existing project — meaningfully extended during the challenge**

## Existing-project explanation

Forsyningsdata Danmark existed before the challenge as an unfinished web application for exploring Danish public property and geospatial data. During the submission period it was meaningfully extended with a new WebMCP integration exposing structured address, property, utility, environment, source, interface and visible-profile actions to AI agents. The challenge work is isolated in a timestamped challenge branch and documented in the public repository; the private challenge branch was 51 commits ahead of its pre-challenge base when the public export was prepared.

## Public repository

https://github.com/HenrikBrixCare/forsyningsdata-danmark-webmcp

## Live app

**Use the final clean judge-accessible deployment URL after incognito testing.**

Current preview candidate:
https://forsyningsdata-danmark-git-webmcp-challenge-2026-tilbudstjek.vercel.app

## Demo video

**TODO — insert final public YouTube URL after recording/upload.**

## Built with

WebMCP · Next.js · React · TypeScript · Vercel · Dataforsyningen · Plandata · Danish public geospatial data

## AI used during development

ChatGPT by OpenAI was used extensively for product development, architecture, technical planning, debugging, code review, UX, WebMCP implementation planning, testing guidance and project documentation.

If Codex is materially used before final submission, add it with the specific contribution.

## Learning / new technology

**Significant**

Short explanation:
WebMCP is experimental. The challenge work included learning the imperative browser tool-registration API, JSON Schema tool inputs, browser testing, progressive enhancement, trust boundaries, human-visible actions and the separation between structured agent output and visible UI state.

## Key project-story message

The user should know the address, not the public-data bureaucracy behind it. WebMCP turns the site into a shared human + agent workspace: the agent can retrieve structured evidence and then move the human interface to the exact section it is discussing.

## Why WebMCP

Without WebMCP, an agent has to infer actions from the DOM and presentation-oriented controls. With WebMCP, the application exposes an explicit contract for resolving addresses, retrieving structured evidence, preserving limitations, surfacing original sources and handing control back to the person in the visible UI.

## Human + agent example

The agent retrieves sewer context, then calls `focus_address_section(section: "sewer")`. The visible address profile moves to “Kloak & regnvand”, so the person sees the same evidence the agent is discussing.

## International-language example

The agent can call `set_interface_language(language: "it")` while `get_interface_context` still reports `dataCountry: "DK"`. This separates interface language from data jurisdiction and avoids claiming non-Danish source coverage that is not live.

## Final before Submit

- Live URL tested without owner login/cookies
- Public repo opens and shows MIT license
- YouTube video public, with audio, <3:00
- Final URLs pasted into the form
- Existing-project disclosure included
- Preview submission once
- Press **Submit**; do not leave Draft
