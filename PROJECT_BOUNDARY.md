# Project boundary — WebMCP Challenge

WebMCP Challenge-projektet er en selvstændig demo-/konkurrenceenhed og må ikke fungere som produktionsdatabase for Forsyningsdata Danmark.

## Faste regler
- Eget GitHub-repository.
- Eget Vercel-projekt/workspace.
- Eget Supabase-projekt/database, hvis state eller demo-data kræver det.
- Egne environment variables, API-nøgler og analytics.
- Ingen produktions-secrets eller direkte databaseadgang fra TrygtTilbud, Forsyningsdata Danmark, BrixCare, MinRet eller BioAir Guard.
- Integration til Forsyningsdata Danmark skal ske via et dokumenteret API eller tydeligt markerede demo-/syntetiske data.
- Konkurrencens kode og data skal kunne arkiveres eller fjernes uden at påvirke produktionsprojekterne.

Formålet er at beskytte både konkurrencedemoen og de kommercielle produkter mod sammenblanding.
