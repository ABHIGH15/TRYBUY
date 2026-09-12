# Competitive Teardown: The Intent Gap

**Objective:** Map the shopping journey across major commerce and discovery platforms (Discovery → Save → Revisit → Compare → Re-engage → Purchase) to identify exactly where and how user intent is lost or collapsed.

---

## 1. Myntra
**Core Identity:** Fashion-first, trend-driven, strong creator/social commerce influence.

*   **Discovery:** Highly visual, personalized feeds, creator-led (Myntra Studio). Users discover via browsing, not just search.
*   **Save:** "Wishlist" (Heart icon). Single tap.
*   **Revisit:** Dedicated Wishlist tab. Items are displayed in a grid, sorted by recently added.
*   **Compare:** Mental comparison. No native tool to compare two saved jackets side-by-side.
*   **Re-engage:** "Price Drop" alerts, low stock warnings, or generic push notifications ("Items in your wishlist are on sale!").
*   **Purchase:** Direct from wishlist.
*   **Where Intent is Lost:** Myntra knows *that* you liked the jacket, but not *why*. Did you save it because it's for a wedding next month, or because you want it if the price drops by ₹500? The intent is collapsed into a binary "Saved" state. The re-engagement is purely price/scarcity driven.

## 2. Amazon
**Core Identity:** Utility, speed, massive selection.

*   **Discovery:** Search-heavy, utilitarian. "Customers who bought this also bought..."
*   **Save:** "Add to List" (Allows multiple custom lists, e.g., "Wedding", "Groceries") and "Save for later" (in Cart).
*   **Revisit:** Lists are somewhat buried in the account menu. Save for Later is visible only at checkout.
*   **Compare:** Strong algorithmic comparison ("Compare with similar items" table on the product page), but poor *personal* comparison (comparing item A from yesterday with item B from today).
*   **Re-engage:** Email alerts for price drops on list items.
*   **Purchase:** High conversion, 1-click buy.
*   **Where Intent is Lost:** Amazon's Lists allow categorization (which implies some intent), but the interaction is high-friction (requires creating and naming lists). Most users just use the default "Shopping List" or leave items in the Cart. It solves organization, but not contextual decision-making.

## 3. Flipkart
**Core Identity:** Value, electronics, broad Indian demographic.

*   **Discovery:** Deal-driven, search and category navigation.
*   **Save:** Wishlist (Heart icon) and "Save for Later" (Cart).
*   **Revisit:** Standard list view.
*   **Compare:** Native "Compare" feature for electronics (phones, appliances), but less effective for fashion or subjective items.
*   **Re-engage:** Aggressive push notifications for sales events (Big Billion Days) highlighting wishlist items.
*   **Purchase:** Standard checkout flow.
*   **Where Intent is Lost:** Similar to Myntra. The wishlist is a holding pen. "Save for later" is explicitly a deferral tactic to clean up the cart, not an expression of *why* the user is deferring.

## 4. Donut (Smart Virtual Mall)
**Core Identity:** Cross-store shopping, universal wishlist, price comparison.

*   **Discovery:** AI-assisted, aggregates across 500+ Indian stores.
*   **Save:** Universal Wishlist. Saves items across different platforms into one hub.
*   **Revisit:** Centralized dashboard for all saved items.
*   **Compare:** Cross-platform price comparison.
*   **Re-engage:** Price-drop alerts across different retailers for the same item.
*   **Purchase:** Redirects to the original retailer.
*   **Where Intent is Lost:** Donut solves the *fragmentation* of wishlists, but it still treats intent primarily as a price-waiting game. It assumes the user wants the item and is just looking for the best price, missing nuances like "I'm looking for *something like this* but not exactly this."

## 5. Pinterest
**Core Identity:** Pure discovery, aspiration, mood-boarding.

*   **Discovery:** Unmatched visual discovery and serendipity. "Explore Mode" is the default state.
*   **Save:** Pin to Boards. Highly contextual (e.g., "Living Room Reno 2026", "Summer Fits").
*   **Revisit:** Highly engaging visual boards.
*   **Compare:** Visual side-by-side by looking at the board.
*   **Re-engage:** Weak. Pinterest knows you are inspired, but struggles to know when you are ready to transition from aspiration to transaction.
*   **Purchase:** Improving with Shopping Pins, but still significant friction.
*   **Where Intent is Lost:** Pinterest captures the *why* and the *aesthetic intent* brilliantly through Boards, but it lacks the *transactional intent* (price, timing, urgency). It is too far up the funnel.

---

### The TryBuy Opportunity Matrix

| Platform | Strengths | Weaknesses (The Intent Gap) | TryBuy's Wedge |
| :--- | :--- | :--- | :--- |
| **Myntra** | Discovery, Social | Collapses intent to a binary "Like" | Ask *why* it was saved (Price, Occasion, Style) |
| **Amazon** | Organization (Lists) | High friction to organize, utilitarian | Make intent capture lightweight (1-tap context) |
| **Donut** | Universal saving | Assumes intent is purely price-driven | Capture qualitative intent (Alternatives, Timing) |
| **Pinterest**| Captures visual context | Struggles with transactional triggers | Bridge the gap between inspiration and buying |

### Summary of the "Intent Loss"
Across all platforms, the fundamental flaw is that **Saving is treated as a transactional holding area, not a decision-making space.** 

When a user saves an item, the platform assumes: *User wants this product. Remind them to buy it.*
In reality, the user is saying: *I'm interested in this product, but I have unresolved constraints (price, comparison, timing, uncertainty).*

Because platforms do not ask what the constraint is, they can only pull one lever to re-engage: **Price Drops/Scarcity.**

TryBuy's wedge is providing a lightweight interface to resolve those constraints, turning a "dead wishlist" into an active "Decision Memory."
