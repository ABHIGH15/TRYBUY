import { useNavigate } from 'react-router-dom';
import { Store, Check, X, ArrowLeftRight, Moon, Search, Wallet, ChevronRight } from 'lucide-react';
import type { Decision, ComparisonSet } from '../../types/domain';
import { useComparisonSetItems } from '../../hooks/useDashboard';

function ReasonBadge({ reason }: { reason: 'comparing' | 'waiting_for_price' }) {
  const isComparing = reason === 'comparing';
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] ${isComparing ? 'text-blue' : 'text-amber'}`}>
      {isComparing ? <Search size={13} strokeWidth={2.25} /> : <Wallet size={13} strokeWidth={2.25} />}
      {isComparing ? "Comparing" : "Price watch"}
    </span>
  );
}

export function ComparisonSetCard({ set, isTriggered }: { set: ComparisonSet; isTriggered?: boolean }) {
  const navigate = useNavigate();
  const items = useComparisonSetItems(set.id);
  const activeItems = items.filter(i => i.state === 'active');
  
  if (activeItems.length === 0) return null;

  return (
    <button 
      onClick={() => navigate(`/comparison/${set.id}`)}
      className="w-full flex items-center justify-between gap-4 py-4 text-left group border-b border-line"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {activeItems.slice(0, 3).map(item => (
              item.product.image_url ? (
                <img key={item.id} src={item.product.image_url} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-paper border-2 border-paper" />
              ) : (
                <div key={item.id} className="w-8 h-8 rounded-full bg-line flex items-center justify-center ring-2 ring-paper border-2 border-paper text-closed">
                  <Store size={14} />
                </div>
              )
            ))}
          </div>
          <div>
            <div className="text-[15px] font-medium text-ink">{set.name}</div>
            <ReasonBadge reason="comparing" />
          </div>
        </div>
        <div className="mt-1 text-[13px] text-closed">
          {activeItems.length} items, still deciding
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isTriggered && (
          <span className="text-[13px] text-amber font-medium">Needs attention</span>
        )}
        <ChevronRight size={16} className="text-closed group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

export function PriceDecisionCard({ decision, isTriggered }: { decision: Decision; isTriggered?: boolean }) {
  const navigate = useNavigate();
  const { product, current_price } = decision;

  return (
    <button 
      onClick={() => navigate(`/price/${decision.id}`)}
      className="w-full flex items-center justify-between gap-4 py-4 text-left group border-b border-line"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {product.image_url ? (
            <img src={product.image_url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-line flex items-center justify-center text-closed shrink-0">
              <Store size={14} />
            </div>
          )}
          <div>
            <div className="text-[15px] font-medium text-ink truncate max-w-[200px]">{product.title}</div>
            <ReasonBadge reason="waiting_for_price" />
          </div>
        </div>
        <div className="mt-1 text-[13px] text-closed">
          {current_price !== undefined ? (
            <>₹{product.price_at_save} &rarr; ₹{current_price}</>
          ) : (
            <>Watching · ₹{product.price_at_save}</>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isTriggered && (
          <span className="text-[13px] text-amber font-medium">Price dropped</span>
        )}
        <ChevronRight size={16} className="text-closed group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

export function ResolvedDecisionCard({ decision }: { decision: Decision }) {
  const { product, resolution_type, state } = decision;
  
  let Icon = Check;
  let label = 'Bought';

  if (state === 'dormant') {
    Icon = Moon;
    label = 'Dormant';
  } else if (resolution_type === 'declined') {
    Icon = X;
    label = 'Declined';
  } else if (resolution_type === 'replaced') {
    Icon = ArrowLeftRight;
    label = 'Replaced';
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-line">
      {product.image_url ? (
        <img src={product.image_url} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0 grayscale opacity-80" />
      ) : (
        <div className="w-7 h-7 rounded-lg bg-line flex items-center justify-center text-closed shrink-0">
          <Store size={12} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-ink truncate">{product.title}</div>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[13px] text-closed">
        <Icon size={13} strokeWidth={2.25} />
        {label}
      </span>
    </div>
  );
}
