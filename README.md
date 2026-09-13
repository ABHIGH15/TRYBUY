# TRYBUY V2 — Stage 0

TRYBUY is a cross-store purchase-decision workspace for things you're interested in but aren't ready to buy yet. 

It is **not** a wishlist. Every saved item is treated as an active decision heading toward an outcome (bought, replaced, declined, or dormant), rather than a permanent resident of a static list.

## The Core Loop

1. **Find something somewhere else** → Paste the URL into Capture.
2. **Tell TRYBUY why you're waiting** → Are you comparing options, or waiting for a better price?
3. **Finish the decision in a dedicated workspace** → Compare options without noise, monitor price drops, and explicitly resolve the decision.

## What TRYBUY deliberately does NOT do

To preserve the integrity of a user-owned decision workspace, the MVP intentionally omits:

- **No AI recommendations or "best choice" markers.** The user decides.
- **No marketplaces, feeds, trending products, or product discovery.**
- **No social features or shared lists.**
- **No fake intelligence.** If a price cannot be extracted, it remains explicitly "unknown" rather than defaulting to $0.00.
- **No manufactured urgency.** Decisions do not surface in the "Needs attention" view unless a target price is reached or a baseline price drops. Time alone does not create urgency.

## Stage 0 Technical Limitations

This implementation represents the **Validated P0 MVP** used to answer the core product hypothesis: *Do users actually use a structured workspace to finish cross-store purchase decisions?*

Because it is optimized for immediate user validation over infrastructure scaling, it carries two deliberate technical constraints:

1. **Extraction Reliability:** The product relies on a public CORS proxy (`api.allorigins.win`) to perform best-effort HTML extraction. Fortified retailers (like Amazon) may reject these proxy requests. The UI safely handles these failures by gracefully degrading to manual entry, but the "magic" of instant extraction will vary by retailer.
2. **Persistence:** State is currently persisted entirely client-side via `localStorage`. The application is robust and schema-validated locally, but data will not sync across multiple devices.

*Note: Infrastructure improvements (serverless backend extraction and database sync) are scoped for Stage 1, contingent on proving the core behavioral thesis in Stage 0.*
