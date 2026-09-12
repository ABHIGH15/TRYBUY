# TRYBUY — Prototype Experiment Design (Validation Phase)

## 1. Goal

The purpose of this prototype is NOT to validate a complete e-commerce experience. 
The purpose is exclusively to run an experiment testing the **Smart Save hypothesis**.

## 2. Hypothesis (Refined into 3 Falsifiable Layers)

We believe that asking users *why* they are saving an item (capturing explicit intent) creates a more valuable memory space that can drive differentiated re-engagement.

We test this across three specific layers:

### Layer 1: Capture Hypothesis (Friction vs Value)
> "Users who are offered optional intent tagging at save-time complete the save at a rate not meaningfully lower than users who aren't offered it, and a majority who see the option choose to use it rather than skip."
- **Falsification:** If the skip-rate is overwhelmingly high, or if save-completion drops meaningfully in the Treatment group, the friction cost outweighs the value, and the product fails at Layer 1.

### Layer 2: Recall Hypothesis (The Memory Value)
> "Saved items with captured intent are revisited or interacted with in TryBuy Memory more often (within 7-14 days) than saved items without captured intent."
- **Falsification:** If revisit rates are statistically indistinguishable between Control and Treatment items, the grouped "Decision Memory" UI provides no incremental recall value over a flat wishlist, and the product fails at Layer 2.

### Layer 3: Business Hypothesis (Not currently tested at this scale)
> "Differentiated re-engagement by intent type increases eventual conversion (GMV) versus generic re-engagement."
- *Note:* We explicitly scope this out of the current prototype. We do not have real transactions, real prices, or real inventory. This is the long-term business case, but it cannot be honestly validated with a prototype.

---

## 3. The Minimum Viable Experiment (Qualitative Validation Sprint)

Due to the constraints of a solo-built prototype, achieving quantitative statistical significance (a true A/B RCT) is impossible and claims to the contrary are dishonest.

Instead, we will run a **Small Moderated Comparison Study**:
- **Format:** 5–10 real users.
- **Protocol:** Within-subject, order-randomized (users see both Control and Treatment flows).
- **Goal:** Capture qualitative reactions (perceived friction, perceived value, willingness to reuse) plus basic directional funnel numbers (completion vs skip rates).

### Quantitative Analytics (Directional Only)
We will measure:
- `Save completion rate` (Control vs Treatment)
- `Intent-sheet completion vs. skip rate`
- `Memory-screen revisit frequency`

### The UX Confound Acknowledgment
Initially, the Treatment variant included a modal while Control did not. We acknowledge that any behavioral difference could stem from the *Novelty/attention effect* or the *IKEA effect* (investment of effort) rather than the intent data itself. 

By pivoting to a qualitative validation study (Path 2), we accept this UI difference and focus on extracting signal through moderated think-aloud sessions rather than pretending the numbers are scientifically isolated.

---

## 4. The Functional Intent Loop

To prove that TryBuy is more than just "a wishlist with tags", the intent taxonomy is functionally consequential. The captured intent explicitly changes the downstream simulated behavior:

1. **PRICE_WATCH:** Simulates a push notification for a specific price drop.
2. **COMPARING:** Simulates a recommendation alert for a highly-rated alternative.
3. **BUYING_LATER:** Simulates a timing-based nudge as an occasion approaches.
4. **EXPLORING:** Explicitly *suppresses* notifications to prevent noise for low-intent saves.

This functional differentiation is the actual defensible mechanism of TryBuy.
