import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper pb-24">
      <header className="px-6 py-4 bg-paper-raised border-b border-line flex items-center gap-3 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          aria-label="Go back"
          className="p-2 -ml-2 rounded-full hover:bg-closed-bg focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-ink" />
        </button>
        <h1 className="text-xl font-medium font-display tracking-tight text-ink">The Case Study</h1>
      </header>

      <main className="px-6 py-8 space-y-8 text-ink text-sm leading-relaxed">
        <section>
          <h2 className="font-medium font-display text-lg mb-2">The Observed Problem</h2>
          <p className="mb-4">
            Most online shopping journeys don't end in a purchase—they end in an open tab. People find a product they like, but they aren't ready to buy yet. They might be waiting for a price drop, or they might want to compare it against a few other options. 
          </p>
          <p>
            Retailers try to solve this with "Wishlists", but wishlists are fundamentally broken for the user's actual goal. A wishlist is a static graveyard of products tied to a single retailer, while shopping is an active, cross-retailer decision process. 
          </p>
        </section>

        <section>
          <h2 className="font-medium font-display text-lg mb-2">The Pivot: From Wishlist to Workspace</h2>
          <p className="mb-4">
            The initial hypothesis was simply "build a universal wishlist." But early prototyping revealed that a universal wishlist just creates a larger graveyard. 
          </p>
          <p>
            The pivot was shifting the mental model from a *storefront* to a *workspace*. TRYBUY doesn't just save a link; it captures the *intent* behind the save. Are you comparing this, or are you waiting for the price to drop? 
          </p>
          <p>
            By surfacing that intent, the app transforms from a passive list into an active decision-making tool.
          </p>
        </section>

        <section>
          <h2 className="font-medium font-display text-lg mb-2">Why a Retailer Won't Build This</h2>
          <p className="mb-4">
            A common question is: "Why wouldn't Amazon or Myntra just build this into their app?"
          </p>
          <p className="mb-4">
            The structural reality is that a tool whose core value is "compare across retailers, including us vs. everyone else" is directly in tension with what a single retailer's wishlist is for. It's an incentive problem, not a UX problem. No amount of polish changes the fact that "comparing with other options" is not something a retailer wants to make easier on their own domain.
          </p>
          <p>
            However, a standalone tool that serves as a referral source—sending *already-decided, ready-to-buy* traffic back to the retailer—is perfectly aligned with their incentives.
          </p>
        </section>

        <section>
          <h2 className="font-medium font-display text-lg mb-2">The Falsification Test</h2>
          <p className="mb-4">
            To prove this isn't just a neat UI exercise, we defined a strict falsification test before building. The goal is to run 15–25 real multi-store shoppers through a 3-week window.
          </p>
          <p>
            If the resolution rate (the percentage of saved items that end in a deliberate "Bought", "Replaced", or "Decided Against" action) isn't meaningfully higher than the user's self-reported baseline with native wishlists/screenshots, the hypothesis fails. We measure success by decisions closed, not items saved.
          </p>
        </section>

      </main>
    </div>
  );
}
