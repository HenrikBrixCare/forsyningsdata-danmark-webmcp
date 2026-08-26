# Public challenge deployment

The scoped public repository requires no private API keys for its core challenge demo, so it can be deployed as a separate public Vercel project.

## Recommended final-judge setup

Create a dedicated Vercel project connected to:

`HenrikBrixCare/forsyningsdata-danmark-webmcp`

Recommended project name:

`forsyningsdata-danmark-webmcp`

## Vercel settings

- Framework preset: Next.js (auto-detected)
- Root directory: repository root
- Build command: default (`next build`)
- Install command: default (`npm install`)
- Environment variables: none required for the scoped public challenge build
- Production branch: `main`

## Access requirement

For the Devpost live URL, make sure judges can open the production domain without the owner's Vercel login cookie.

Before submission:

1. Open the final deployment URL in a clean/incognito browser.
2. Confirm the homepage loads without a Vercel authentication page.
3. Open `/webmcp-test`.
4. In Chrome with WebMCP testing enabled, verify the browser discovers the expected tools.
5. Open the demo-address profile.
6. Put this clean production URL — not a protected dashboard/deployment URL — into Devpost.

If Deployment Protection is enabled for the final production domain, either disable the protection for the judge-facing deployment or provide valid test credentials/instructions in the Devpost submission as permitted by the challenge rules.

## Why a separate public deployment is preferred

The existing live challenge preview integrates WebMCP with the pre-existing private product data layer. A separate deployment from this public repository gives judges a simple reproducible URL that maps directly to the public source code and avoids exposing unrelated private product code.
