# Public data sources and attribution

The scoped public challenge repository intentionally uses only public data/services needed to demonstrate the WebMCP workflow.

## Dataforsyningen / Klimadatastyrelsen

Used for official Danish address resolution and parcel/matrikel context.

Challenge code calls public Dataforsyningen endpoints for:

- address autocomplete / address resolution,
- access-address resolution,
- parcel lookup around the verified address coordinate.

Source attribution used in the demo:

`(CC BY 4.0) Klimadatastyrelsen via Dataforsyningen`

Terms: https://dataforsyningen.dk/terms

The current terms state that free geographic data may be used, shared and adapted for commercial and non-commercial purposes subject to attribution and the applicable terms/license.

## Scoped challenge contracts

Utility, environment, map-layer and follow-up-source tools in this public export demonstrate the challenge-facing WebMCP contract and trust model while unrelated/private product adapters remain outside this repository.

The live challenge preview uses additional public/authorized sources. Tool responses preserve source names and limitations, and the workflow hands exact pipe locations, drawings, permits and authority decisions back to original sources rather than claiming screening is definitive.

## Attribution principle

Where third-party/public datasets are used, the application should:

1. preserve the original source name,
2. link to the original source/terms where practical,
3. avoid implying endorsement by the data owner,
4. preserve limitations and data-quality context,
5. comply with the source's current terms and licensing requirements.
