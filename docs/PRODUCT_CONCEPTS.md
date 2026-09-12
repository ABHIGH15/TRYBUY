# TryBuy: Product Concepts & Kill/Continue Matrix

Based on the research pivoting away from a "fake shopping simulator" to an "intent-aware shopping layer," here are 5 concrete product concepts to capture and operationalize pre-purchase intent.

---

## 1. The "Smart Save" Interaction (Marketplace Feature)
**The Concept:** Replace the binary "Heart/Wishlist" button with a lightweight intent capture mechanism. When a user taps 'Save', a non-blocking transient modal asks "Why are you saving this?". 
*   Options: `Waiting for Price Drop`, `Comparing Alternatives`, `For an Occasion`, `Just Inspiration`.
*   **How it creates value:** The platform uses this explicit signal to tailor re-engagement. (e.g., Only alert the user if the price drops; if they selected "Comparing", show them similar items next time they open the app).

## 2. The "Decision Board" (Cross-Platform Extension/App)
**The Concept:** A space organized by *decisions* rather than *products*. Instead of a generic "Wishlist", users create a Decision (e.g., "Black Sneakers for College"). They clip items from any platform into this decision. 
*   **The Intent Capture:** Each decision requires a constraint (e.g., Budget: < ₹4000). 
*   **How it creates value:** It acts as a shopping companion. Once a user buys one item in the board, the intent is "Resolved", and TryBuy stops tracking the others.

## 3. The "Intent Agent" (Price & Alternative Watcher)
**The Concept:** Users delegate their intent to TryBuy. Instead of passively saving, they instruct the app: *"I want this exact jacket if it drops below ₹2000, OR find me something visually identical for under ₹1500."*
*   **The Intent Capture:** Highly explicit, programmatic intent.
*   **How it creates value:** Merges price-tracking with AI visual search, actively working to fulfill the user's specific constraint rather than just waiting for a sale on a single SKU.

## 4. The "Explore vs. Buy" Mode Toggle (Marketplace Feature)
**The Concept:** A literal UI toggle at the top of an e-commerce app: `[Explore] | [Buy]`. 
*   **Explore Mode:** Hides the cart. "Add to cart" becomes "Shortlist". Recommendations optimize for serendipity, broad categories, and visual inspiration. 
*   **Buy Mode:** Standard utilitarian e-commerce. Fast checkout, precise search.
*   **How it creates value:** Acknowledges the user's psychological state. Reduces friction for hedonic browsing, capturing "Shortlist" signals without the pressure of a looming checkout cart.

## 5. The "Contextual Memory" Re-engagement Loop
**The Concept:** A backend evolution of how push notifications work. Instead of item-centric alerts ("Item in wishlist is on sale"), it uses session-centric intent alerts.
*   **The Intent Capture:** Implicitly groups a user's recent browsing session into an inferred intent (e.g., User viewed 15 winter jackets, wishlisted 3).
*   **How it creates value:** The platform sends a push a week later: *"Still looking for a winter jacket under ₹3000? We found 5 new arrivals matching what you were browsing."* It respects the user's underlying goal, not just the specific SKUs they clicked.

---

## The Kill / Continue Matrix

We evaluate these concepts against four critical dimensions:
1.  **User Friction:** Does it ruin the browsing experience? (Lower is better)
2.  **Marketplace Value:** Does it generate a uniquely valuable signal? (Higher is better)
3.  **Differentiation:** Is it sufficiently different from a standard Wishlist? (Higher is better)
4.  **Feasibility for MVP:** Can a small team build and test this quickly? (Higher is better)

| Concept | User Friction | Marketplace Value | Differentiation | MVP Feasibility | Verdict | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Smart Save** | Medium | Very High | High | High | **🟢 CONTINUE** | Simplest way to test explicit intent. If users engage, the signal is incredibly valuable. |
| **2. Decision Board** | High | Low (Isolated) | High | Medium | **❌ KILL (For now)** | Cross-platform scraping/extensions are hard to maintain, and asking users to build boards is high friction. |
| **3. Intent Agent** | Low | High | Very High | Low | **❌ KILL** | Visually searching for alternatives across databases is technically complex for an MVP. |
| **4. Explore Toggle** | Low | Medium | High | Low | **❌ KILL** | Requires redesigning an entire marketplace's core UI and recommendation engine. Too big for MVP. |
| **5. Contextual Memory** | None (Backend) | Very High | Medium | Medium | **🟢 CONTINUE** | Can be simulated via Wizard-of-Oz or basic grouping algorithms. Highly defensible. |

### Conclusion for MVP Focus
The **Smart Save** interaction is the most viable path forward for a prototype experiment. It directly tests the core hypothesis: *Will users explicitly tell us WHY they are saving an item if we make it easy?* 

If yes, we can build the **Contextual Memory** re-engagement loop on top of that data.
