# TRYBUY

**A product experiment exploring intentional shopping.**

TRYBUY is a functional React prototype designed to test a specific product hypothesis:
> **If we give users a low-pressure way to express “I like this, but I'm not ready to buy,” we can preserve otherwise-lost purchase intent and use that signal to improve future shopping experiences.**

This project was built to generate evidence for a PM case study. It is intentionally constrained to be a **client-side-only prototype** that feels like a believable consumer application without requiring a real ecommerce backend.

---

## 🛒 The Core Loop

TRYBUY differs from a standard ecommerce wishlist by introducing **Contextual Re-engagement**.

1. **Discover & Save:** The user finds a product and taps "Save".
2. **Intent Capture:** TRYBUY intercepts the save and asks a lightweight question: *"What are you waiting for?"* (e.g., Price drop, Comparing, Buying later, Just exploring).
3. **Memory:** The product is saved to the user's "Memory", grouped explicitly by the reason they provided.
4. **Contextual Event:** Downstream, TRYBUY uses that intent to trigger a relevant event (e.g., notifying them when a similar alternative is found if they were "Comparing").

The product principle is: **The saved product is the object; the intent is the memory.**

---

## 🏗 Architecture & Scope Boundaries

TRYBUY is built with **React**, **Vite**, **Tailwind CSS**, and **Zustand**. 

To maintain scope discipline for a PM experiment, the architecture has strict boundaries:
- **No Backend:** All state (Bag, Saved Items, Intents, Analytics, Simulated Events) is persisted strictly via `localStorage`.
- **No Machine Learning:** Recommendations, price tracking, and "similar alternatives" are deterministic simulations.
- **Checkout Boundary:** The shopping cart is fully functional (calculations, quantities) but explicitly halts at a prototype boundary instead of faking payment or delivery systems.
- **Analytics:** A custom in-memory logger (`analytics.ts`) strictly tracks consumer behavior across the funnel to measure the experiment.

---

## 🧪 Experiment Design (Control vs. Treatment)

The prototype ships with a built-in A/B testing mechanism accessible via the **Prototype Lab** (`/internal-lab`).

- **Control Mode:** TRYBUY acts like a standard wishlist. The user taps Save, and the item is saved instantly with no friction.
- **Treatment Mode:** TRYBUY introduces the "Smart Save" modal, capturing intent. 

The goal of the upcoming user testing phase is to measure:
1. Does the Treatment modal cause excessive friction?
2. Does contextual re-engagement based on intent feel more valuable than a generic wishlist notification?

---

## 🎬 How to Demo TRYBUY

If you are evaluating this prototype, follow this exact journey to experience the core thesis:

1. **Launch:** Run the app and ensure you are in the default **Treatment** mode.
2. **Discover:** Tap any product on the Feed to view its Product Detail Page (PDP).
3. **Smart Save:** Tap the **Save** (Heart) button.
4. **Provide Intent:** When the modal appears, select **"Waiting for a price drop"**.
5. **View Memory:** Navigate to the **Memory** tab (heart icon in bottom nav) and observe how the item is contextualized by your reason.
6. **Trigger Re-engagement:** Navigate to the hidden **Prototype Lab** route: `http://localhost:5173/internal-lab`.
7. **Simulate Event:** Expand your saved product in the Lab and tap **Trigger Contextual Event**. (The Lab uses the intent to deterministically generate a 25% price drop).
8. **Experience the Result:** Navigate back to the **Memory** tab. You will now see the "TryBuy Remembered" contextual notification surfacing the price drop exactly as you requested.

---

## 🚀 Setup & Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the consumer app at `http://localhost:5173/` and the experiment lab at `http://localhost:5173/internal-lab`.

---

## 🛑 Current Status

**STAGE J: FEATURE FREEZE.**
The product mechanism is complete and audited. No new features will be added. 
Moving into **Stage K: Real-User Validation** to generate qualitative and quantitative evidence for the product hypothesis.
