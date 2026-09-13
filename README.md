# TRYBUY

### A purchase-decision workspace for things you want to buy — just not yet.

**TRYBUY helps shoppers capture products from anywhere, remember why they saved them, compare options, watch for better prices, and eventually close the decision.**

It is **not a marketplace, wishlist, or checkout platform.**

TRYBUY sits between **“I want this”** and **“I’m ready to buy this.”**

---

## The Problem

Modern shopping rarely happens in one place.

A person might discover a product on:

* Myntra
* Amazon
* Instagram
* Google
* YouTube
* A brand website
* A friend’s recommendation

They save it somewhere — a wishlist, browser tab, screenshot, note, or message to themselves.

Then the context disappears.

> *Why did I save this?*
> *Was I waiting for a discount?*
> *Was I comparing it with something else?*
> *Did I actually decide against it?*

Existing shopping tools are generally optimized for **saving products**, not **finishing purchase decisions**.

### The gap

**Saving an item is not the same as making a decision.**

TRYBUY treats the unresolved purchase decision as the core problem.

---

# Product Thesis

> **TRYBUY is a cross-store purchase-decision workspace where every saved product represents a decision heading toward an outcome.**

Instead of building another product catalog or universal wishlist, TRYBUY focuses on what happens **after someone finds something they want but before they actually buy it.**

The product organizes decisions around the user's stated reason:

### Comparing

> “I like these options, but I haven't decided which one.”

TRYBUY creates a comparison workspace without ranking, scoring, or recommending a winner.

### Waiting for a better price

> “I want this, but I don't want to pay this price yet.”

TRYBUY stores the price context and allows the user to recheck it.

The fundamental principle is:

> **The user owns the intent. TRYBUY owns the decision memory and workflow.**

---

# How It Works

```text
        DISCOVER
           │
           ▼
   Product on any store
           │
           ▼
        CAPTURE
   Paste URL / Extension
           │
           ▼
    Extract product data
           │
           ▼
     "What are you
       waiting for?"
        /        \
       /          \
      ▼            ▼
 COMPARING    BETTER PRICE
      │            │
      ▼            ▼
 Comparison     Price Watch
 Workspace        Detail
      │            │
      └──────┬─────┘
             ▼
        USER DECIDES
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
     BOUGHT  REPLACED  DECLINED
             │
             ▼
          HISTORY

       Or, at any point:

             ▼
        "Not thinking
          about it"
             │
             ▼
          DORMANT
```

The goal is not to keep users browsing forever.

The goal is to help them **finish decisions**.

---

# Core Product Model

TRYBUY's fundamental object is a **Purchase Decision**, not a product.

Each decision contains:

```text
Product
├── Title
├── Image
├── Merchant
├── Source URL
├── Price at save
└── Current price

Decision
├── Reason
│   ├── Comparing
│   └── Waiting for better price
│
├── State
│   ├── Active
│   ├── Resolved
│   └── Dormant
│
└── Outcome
    ├── Bought
    ├── Replaced
    └── Declined
```

This distinction is intentional.

A product can remain relevant while the **decision around it changes**.

For example:

```text
Saved → Comparing
        ↓
     Bought
```

or:

```text
Saved → Waiting for price
        ↓
     Declined
```

or simply:

```text
Saved → Not thinking about it
        ↓
      Dormant
```

---

# Product States

### Active

The user is still thinking about the decision.

Active decisions appear in the main workspace.

### Resolved

The decision has reached an outcome:

* **Bought**
* **Replaced**
* **Declined**

Resolved decisions move into history.

### Dormant

The user is no longer actively thinking about the decision.

Dormancy is intentionally lightweight:

> One tap. No confirmation. No nagging.

Dormant does **not** mean “failed.”

It means:

> “This isn't something I'm thinking about right now.”

---

# The Two MVP Workflows

## 01 — Compare

Comparison is the primary decision workflow.

A user can:

1. Save a product as **Comparing**
2. Create or select a comparison set
3. Add other products
4. View them side-by-side
5. Choose an outcome

TRYBUY deliberately avoids:

* AI recommendations
* “Best product” labels
* Rankings
* Scores
* Automated winners
* Sponsored placement

The user makes the decision.

### Example

```text
Comparison Set: Running Shoes

Nike Pegasus       ₹9,995
ASICS Novablast    ₹11,999
Adidas Supernova   ₹8,499

              ↓

        "Pick one"

              ↓

        Nike Pegasus
            Bought
```

If the user chooses an alternative, the original decision can be marked **Replaced**.

If none of the products work:

> **None of these**

resolves the set as declined.

---

# 02 — Wait for a Better Price

A user can save an item because the current price is too high.

TRYBUY stores:

* Price at save
* Target price, if provided
* Current price when available
* Last recheck time

In the MVP, price checks are **manual**.

The system does not pretend to continuously monitor prices.

### Important product decision

A price not changing does **not** automatically resolve the decision.

The decision remains active until the user decides what to do.

This preserves the difference between:

> “The price didn't change”

and

> “I don't want this anymore.”

---

# Capture

TRYBUY is designed to work across commerce platforms rather than owning the catalog.

### MVP

**Paste a product URL**

TRYBUY performs best-effort extraction of:

* Product title
* Image
* Merchant
* Price
* Currency
* Source URL

If extraction is incomplete or fails, the user can edit the fields manually.

### Extension Spike

A Chrome extension explores a lower-friction capture flow:

```text
Shopping page
     ↓
TRYBUY extension
     ↓
Read product information
     ↓
Validate product identity
     ↓
TRYBUY Capture
     ↓
User confirms intent
```

The extension currently focuses on validating the capture experience for sites such as **Myntra** and **Amazon**.

The architecture intentionally does **not** depend on private retailer APIs or retailer integrations.

---

# Honest Extraction by Design

Commerce websites frequently use:

* Client-side rendering
* Bot protection
* Dynamic page state
* Internal APIs
* SPA navigation
* Inconsistent metadata

Therefore extraction is explicitly treated as:

> **Best-effort enrichment, not a guaranteed scraper.**

TRYBUY never substitutes missing information with fake values.

For example:

```text
Price unavailable
```

is valid.

This is preferable to incorrectly displaying:

```text
₹0
```

or assuming a currency that was never detected.

The product therefore separates:

```text
Automatic extraction
        ↓
Partial extraction
        ↓
Manual correction
```

rather than pretending extraction is always reliable.

---

# Home Experience

The home screen is organized around **unfinished decisions**, not product discovery.

### Priority

```text
1. Decisions needing attention
2. Active workflows
3. Recently resolved decisions
```

For example:

```text
NEEDS ATTENTION

Nike Pegasus
Comparing · 3 items

────────────────────

WAITING FOR PRICE

Sony WH-1000XM6
Saved at ₹34,990

────────────────────

RECENTLY RESOLVED

Adidas Supernova
Bought
```

The home screen does not introduce products the user never saved.

There is:

* No trending feed
* No recommendation feed
* No sponsored content
* No endless catalog

---

# Product Principles

TRYBUY is intentionally opinionated.

### 1. User decides the intent

The user explicitly tells TRYBUY what they are waiting for.

The system does not need to guess.

---

### 2. Decisions over products

The product is the object being remembered.

The **decision** is the object being managed.

---

### 3. Resolution over engagement

TRYBUY is not optimized to maximize browsing time.

A successful user journey may end with:

> “I bought it.”

That's a success.

So is:

> “I decided against it.”

---

### 4. No artificial urgency

TRYBUY should never manufacture:

* Countdown timers
* Fake scarcity
* “Don't miss out” messages
* Aggressive reminders
* Manipulative notifications

---

### 5. No recommendation engine in the core workflow

Comparison is intentionally neutral.

TRYBUY organizes information.

**The shopper chooses.**

---

### 6. Honest uncertainty

When data is unavailable:

> Say that it is unavailable.

Do not fabricate certainty.

---

# What TRYBUY Is NOT

The scope firewall is deliberate.

TRYBUY is **not**:

❌ A marketplace
❌ A product discovery feed
❌ A universal wishlist
❌ A checkout system
❌ A social shopping network
❌ A review platform
❌ A chatbot
❌ A recommendation engine
❌ A product-ranking engine
❌ A seller management platform
❌ A generic price tracker
❌ A vanity engagement product

The product is intentionally narrow:

> **Help people finish purchase decisions they have already started.**

---

# Product Differentiation

The market already has strong solutions for:

| Existing behavior     | Existing solution category     |
| --------------------- | ------------------------------ |
| Save products         | Wishlists                      |
| Track prices          | Price trackers                 |
| Discover products     | Marketplaces / discovery feeds |
| Compare retailers     | Shopping comparison engines    |
| Save fashion products | Fashion aggregators            |

TRYBUY focuses on the gap between these behaviors:

```text
"I want this"
      ↓
"But I'm not ready"
      ↓
"Why did I save it?"
      ↓
"What am I deciding between?"
      ↓
"What would make me decide?"
      ↓
"I've decided."
```

The wedge is therefore not:

> **“Save products from anywhere.”**

It is:

> **“Turn scattered shopping intent into a decision you can actually finish.”**

---

# MVP Scope

## P0 — Current MVP

### Capture

* Paste URL
* Best-effort product extraction
* Editable metadata
* Manual fallback

### Decision creation

* Comparing
* Waiting for better price

### Home

* Active decision triggers
* Comparison groups
* Price-watch items
* Recent resolutions

### Comparison

* Create/select set
* Add products
* Side-by-side workspace
* Resolve entire decision set

### Price

* Saved price
* Current price
* Manual recheck
* Last checked timestamp

### Resolution

* Bought
* Replaced
* Declined
* Dormant
* Undo grace period

### History

* Resolved decisions
* Dormant decisions
* Inline filtering

---

# Roadmap

The roadmap is intentionally staged around **validation**, not feature accumulation.

## P0 — Validate the decision model

```text
Paste URL
   ↓
Choose intent
   ↓
Manage decision
   ↓
Resolve decision
```

Goal:

> Determine whether people actually use a dedicated workspace for unfinished purchase decisions.

---

## P1 — Reduce capture friction

Potential next steps:

* Chrome extension
* Scheduled price checks
* Notifications
* iOS Shortcut
* Cross-device sync
* Better product metadata normalization

These should only be prioritized if P0 demonstrates demand.

---

## P2 — Expand the decision surface

Potential future areas:

* Buying-later intent
* Exploration intent
* Native mobile experience
* Additional capture mechanisms
* Monetization experiments

These are deliberately **not part of the current MVP**.

---

# Technical Architecture

TRYBUY currently uses a deliberately lightweight architecture.

```text
┌───────────────────────────────┐
│          React App            │
│                               │
│ Capture / Home / Comparison   │
│ Price / Resolution / History  │
└───────────────┬───────────────┘
                │
                ▼
       ┌─────────────────┐
       │ Zustand Store   │
       │                 │
       │ Decision State  │
       │ Comparison Sets │
       └────────┬────────┘
                │
                ▼
          Local Storage
```

Capture enrichment:

```text
Product URL
     │
     ▼
Extraction Function
     │
     ▼
Retailer HTML / metadata
     │
     ▼
OG / JSON-LD / structured data
     │
     ▼
Normalized Product Details
     │
     ├── Complete
     ├── Partial
     └── Failed → Manual entry
```

### Current stack

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Zustand**
* **React Router**
* **Lucide**
* **Browser Local Storage**
* **Serverless extraction function**
* **Chrome Extension — Manifest V3**

The architecture intentionally avoids a database, scheduled jobs, push infrastructure, and unnecessary backend complexity during P0.

---

# Data Model

At the center of the system is the `Decision`.

Conceptually:

```typescript
Decision {
  id
  reason
  state
  resolutionType
  resolutionNote

  product {
    title
    image
    sourceUrl
    merchant
    priceAtSave
    currency
    currentPrice
  }

  targetPrice
  comparisonSetId

  extractionStatus
  unreachable

  createdAt
  updatedAt
}
```

Comparison sets provide the grouping layer:

```typescript
DecisionSet {
  id
  name
  decisionIds
  createdAt
}
```

This model keeps **product information**, **decision state**, and **resolution state** conceptually separate.

---

# Analytics & Product Measurement

TRYBUY is designed to measure whether the decision workflow works — not simply whether users click around the application.

Tracked events include:

```text
home_opened

decision_saved

capture_extraction_result

comparison_set_created

comparison_item_added

price_recheck_triggered

decision_resolved

decision_dormant
```

The most important product question is not:

> “How many products were saved?”

It is:

> **“How many purchase decisions were actually resolved?”**

---

# Validation Plan

TRYBUY is being treated as a product experiment rather than assuming product-market fit from a polished interface.

### Target

**15–25 real multi-store shoppers**

### Duration

Approximately **3 weeks**

### Core questions

#### 1. Do people have unfinished purchase decisions?

If users rarely save things because they are actively comparing or waiting for a better price, the core thesis is weak.

---

#### 2. Does TRYBUY change behavior?

Compare decision resolution against the user's existing behavior:

```text
Screenshots
Browser tabs
Wishlists
Notes
        vs.
     TRYBUY
```

---

#### 3. Which intent actually matters?

Measure the distribution between:

```text
Comparing
Waiting for better price
```

If one reason dominates extremely heavily, the broader two-workflow thesis may need to narrow.

A potential warning signal is one reason representing approximately **85%+** of usage.

---

#### 4. Does the decision actually get finished?

The primary behavioral signal is:

```text
Decision created
      ↓
Decision resolved
```

rather than:

```text
Decision created
      ↓
User keeps saving more products
```

---

# Success Signals

TRYBUY should earn the right to expand only if users demonstrate behavior such as:

* Saving products they genuinely intend to revisit
* Returning to active decisions
* Adding products to comparison sets
* Rechecking prices
* Resolving decisions
* Using Dormant instead of simply abandoning the workspace
* Reporting that TRYBUY replaces screenshots/tabs/wishlists for this specific workflow

### The strongest signal

> **Users come back because they have an unfinished decision to finish.**

---

# Failure Conditions

The product should be considered invalid or require a major pivot if:

### Failure 1 — It's just another wishlist

Users save products but do not interact with decision workflows.

---

### Failure 2 — Comparison isn't meaningful

Users rarely add multiple products or resolve comparison sets.

---

### Failure 3 — Price watching dominates everything

The product becomes primarily a price tracker, placing it directly against established solutions.

---

### Failure 4 — Users don't return

If saved decisions simply accumulate without resolution, TRYBUY has created another storage layer rather than a decision tool.

---

### Failure 5 — Capture friction destroys the workflow

If getting a product into TRYBUY is sufficiently annoying, the decision-management experience never gets a chance to matter.

---

# Project Status

### Current status

**P0 product implementation complete → awaiting live browser verification → real-user validation**

| Area                       | Status                       |
| -------------------------- | ---------------------------- |
| Product definition         | ✅ Locked                     |
| Decision model             | ✅ Implemented                |
| Local persistence          | ✅ Implemented                |
| Capture flow               | ✅ Implemented                |
| Manual fallback            | ✅ Implemented                |
| Comparison workflow        | ✅ Implemented                |
| Price workflow             | ✅ Implemented                |
| Resolution model           | ✅ Implemented                |
| History                    | ✅ Implemented                |
| Product extraction         | ⚠️ Best-effort               |
| Chrome extension           | 🧪 Spike                     |
| Production deployment      | 🔍 Live verification pending |
| Real-user validation       | ⏳ Next                       |
| Automated price monitoring | 🔮 P1                        |
| Cross-device sync          | 🔮 P1                        |
| Native mobile              | 🔮 P2                        |

The extension and production deployment should not be considered validated until they have been tested against real shopping pages in a real browser.

---

# Engineering Philosophy

TRYBUY deliberately favors **small, understandable systems** over premature infrastructure.

The current architecture does not include:

* A complex backend
* Microservices
* Recommendation models
* Real-time infrastructure
* Event-driven pipelines
* AI agents
* Retailer integrations
* Continuous scraping

Those technologies may become useful later.

They are not justified until user behavior demonstrates the need.

> **Validate the product loop before scaling the technology.**

---

# Why This Project Exists

TRYBUY is also an exploration of a broader product question:

> **Can software help people complete decisions rather than simply generate more engagement?**

Most commerce experiences optimize for:

```text
Discover → Browse → Add → Buy → Repeat
```

TRYBUY explores a different layer:

```text
Discover → Save → Understand → Compare → Decide
```

The product is intentionally designed around **decision clarity rather than shopping volume**.

---

# Built With

**Frontend:** React · TypeScript · Vite · Tailwind CSS  
**State:** Zustand · Local Storage  
**Routing:** React Router  
**Icons:** Lucide  
**Capture:** URL extraction · OG metadata · JSON-LD · retailer-specific extraction  
**Extension:** Chrome Manifest V3  
**Deployment:** Vercel-ready  

---

# Repository Structure

```text
src/
├── components/
├── pages/
├── services/
├── store/
├── types/
├── analytics.ts
└── ...

extension/
├── manifest.json
├── background.js
├── content.js
├── extractors/
│   ├── amazon.js
│   ├── myntra.js
│   └── generic.js
└── ...
```

The repository intentionally excludes development scratch artifacts, mock product catalogs, and obsolete V1 implementation.

---

# A Note on Product Scope

TRYBUY is intentionally incomplete.

That is a feature.

The project is being developed using a **problem → hypothesis → MVP → validation → iteration** loop.

Features are not being added simply because they are technically possible.

The question for every future feature is:

> **What user behavior or validated problem does this unlock?**

If the answer is unclear, it doesn't belong in the product yet.

---

# Author's Product Perspective

TRYBUY was built as an exercise in **product thinking through software**.

The interesting part isn't the React implementation.

It is the set of decisions behind the implementation:

* Why is a purchase decision the core object?
* Why does the user explicitly choose intent?
* Why are comparisons deliberately unranked?
* Why is Dormant different from Declined?
* Why shouldn't price stagnation automatically resolve a decision?
* Why is extraction failure treated as a normal product state?
* Why should the MVP avoid a database?
* Why measure resolution instead of engagement?
* When should the product be killed or narrowed?

The project is therefore designed to demonstrate not just:

> **“I can build an application.”**

but:

> **“I can identify a problem, define a product thesis, make trade-offs, build a focused MVP, instrument it, and determine whether the hypothesis survives contact with real users.”**

---

## Current Thesis

> **Shopping doesn't always fail because people can't find products. Sometimes it fails because they never finish deciding.**

**TRYBUY is an experiment in solving that gap.**
