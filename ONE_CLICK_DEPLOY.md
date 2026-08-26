# One-click clean judge deployment

The public challenge repository is self-contained for the scoped demo and does not require private environment variables for its core WebMCP flow.

If a clean dedicated judge deployment is needed, use Vercel's repository import flow:

[Deploy this public challenge repo on Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHenrikBrixCare%2Fforsyningsdata-danmark-webmcp)

Recommended settings:

- Project name: `forsyningsdata-danmark-webmcp`
- Framework: Next.js (auto-detected)
- Production branch: `main`
- Root directory: repository root
- Build command: default
- Install command: default
- Environment variables: none required for the scoped public challenge demo

After deployment:

1. Open the production URL in a clean/incognito browser.
2. Verify `/` and `/webmcp-test` without a Vercel login cookie.
3. In Chrome with WebMCP enabled, confirm all 10 tools are discovered.
4. Use that clean production URL in the Devpost submission.

Do not change the submitted deployment after the submission period closes and judging begins.
