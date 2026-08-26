# Public data sources and attribution

The scoped public challenge repository intentionally uses only public data/services needed to demonstrate the WebMCP workflow.

## Dataforsyningen / Klimadatastyrelsen

Used for official Danish address resolution, parcel/matrikel context and official WMS/WMTS map-layer contracts.

Challenge code calls public Dataforsyningen endpoints for:

- address autocomplete / address resolution,
- access-address resolution,
- parcel lookup around the verified address coordinate,
- the `forvaltning2` WMS/WMTS capabilities used by `list_available_map_layers`.

Source attribution used in the demo:

`(CC BY 4.0) Klimadatastyrelsen via Dataforsyningen`

Terms: https://dataforsyningen.dk/terms

The current terms state that free geographic data may be used, shared and adapted for commercial and non-commercial purposes subject to attribution and the applicable terms/license.

## Plandata.dk

Used by the public `get_utility_overview` route for the adopted sewer-planning area around the verified address coordinate.

The public adapter calls the official Plandata WFS layer:

`pdk:theme_pdk_kloakopland_vedtaget`

The adapter does not simply take the first feature near the address. It checks the returned Polygon/MultiPolygon geometry against the verified address point before returning the current/planned sewer context.

Original source: https://www.plandata.dk/

## Danmarks Miljøportal / DKJord screening

Used by `get_environment_screening` for an **orienting** point screening against public V1/V2 soil-contamination layers.

The result explicitly distinguishes:

- whether the service could be checked,
- whether a V1/V2 feature intersects the address point,
- the original map/source,
- the limitation that an orienting point screening must be confirmed in official regional/DKJord information before purchase, excavation or authority decisions.

Original map: https://arealinformation.miljoeportal.dk/

## KAMP / HIP

The public challenge build uses the verified address coordinate to report climate/groundwater **screening readiness** and the relevant original KAMP/HIP sources. Concrete climate/hydrology datasets, resolution and thresholds are not silently invented; therefore the tool does not produce a final risk judgement.

KAMP: https://kamp.klimatilpasning.dk/

HIP: https://hip.dataforsyningen.dk/

## Local original-source handoff

For the Aalborg regression/demo address the public challenge route identifies public local handoff sources such as MinKloak, MitVand and Aalborg Kommune. For municipalities without a scoped specific adapter, the route says so and returns only a generic municipal handoff rather than pretending a local adapter was found.

Exact drawings, private service lines, permits and authority decisions remain original-source/human verification steps.

## Attribution principle

Where third-party/public datasets are used, the application should:

1. preserve the original source name,
2. link to the original source/terms where practical,
3. avoid implying endorsement by the data owner,
4. preserve limitations and data-quality context,
5. comply with the source's current terms and licensing requirements.
