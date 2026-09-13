import { useNavigate } from 'react-router-dom';
import { Store, CheckCircle2, XCircle, ArrowDown, Clock } from 'lucide-react';
import type { Decision, ComparisonSet } from '../../types/domain';
import { useComparisonSetItems } from '../../hooks/useDashboard';
import { formatPrice } from '../../utils/format';

export function ComparisonSetCard({ set, isTriggered }: { set: ComparisonSet; isTriggered?: boolean }) {
  const navigate = useNavigate();
  const items = useComparisonSetItems(set.id);
  const activeItems = items.filter(i => i.state === 'active');
  
  if (activeItems.length === 0) return null;

  return (
    <div 
      onClick={() => navigate(`/comparison/${set.id}`)}
      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer hover:border-black ${isTriggered ? 'border-orange-200 bg-orange-50/50' : 'border-gray-100 bg-white'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{set.name}</h3>
          <p className="text-sm text-gray-500">{activeItems.length} options • You're comparing these</p>
        </div>
        {isTriggered && (
          <span className="flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" /> Time to decide
          </span>
        )}
      </div>

      <div className="flex gap-2 overflow-hidden mb-4">
        {activeItems.slice(0, 3).map(item => (
          <div key={item.id} className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
            {item.product.image_url ? (
              <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Store className="w-6 h-6" />
              </div>
            )}
          </div>
        ))}
        {activeItems.length > 3 && (
          <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-gray-500">+{activeItems.length - 3}</span>
          </div>
        )}
      </div>

      <div className="flex items-center text-sm font-semibold text-black gap-1">
        Continue deciding <span aria-hidden="true">&rarr;</span>
      </div>
    </div>
  );
}

export function PriceDecisionCard({ decision, isTriggered }: { decision: Decision; isTriggered?: boolean }) {
  const navigate = useNavigate();
  const { product, target_price, current_price } = decision;
  const isDrop = isTriggered && current_price !== undefined && product.price_at_save !== undefined && current_price < product.price_at_save;
  const targetReached = isTriggered && target_price !== undefined && current_price !== undefined && current_price <= target_price;

  return (
    <div 
      onClick={() => navigate(`/price/${decision.id}`)}
      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:border-black flex gap-4 ${isTriggered ? 'border-green-200 bg-green-50/50' : 'border-gray-100 bg-white'}`}
    >
      <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Store className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 truncate mb-1">{product.merchant}</p>
        
        <div className="flex items-center gap-2">
          {current_price !== undefined ? (
            <>
              <span className="font-bold text-gray-900">{formatPrice(current_price, product.currency)}</span>
              {product.price_at_save !== undefined && current_price < product.price_at_save && (
                <span className="text-xs text-gray-500 line-through">{formatPrice(product.price_at_save, product.currency)}</span>
              )}
            </>
          ) : (
            <span className="font-bold text-gray-900">{formatPrice(product.price_at_save, product.currency)}</span>
          )}
        </div>
      </div>

      {isTriggered && (
        <div className="flex flex-col items-end justify-center gap-2 pl-2">
          {targetReached ? (
            <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3" /> Target hit
            </span>
          ) : isDrop ? (
            <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
              <ArrowDown className="w-3 h-3" /> Price dropped
            </span>
          ) : null}
          <span className="text-sm font-semibold text-black">Revisit</span>
        </div>
      )}
    </div>
  );
}

export function ResolvedDecisionCard({ decision }: { decision: Decision }) {
  const { product, resolution_type, resolved_at } = decision;
  
  let Icon = CheckCircle2;
  let color = 'text-green-600 bg-green-50';
  let label = 'Bought';

  if (resolution_type === 'declined' || decision.state === 'dormant') {
    Icon = XCircle;
    color = 'text-gray-500 bg-gray-100';
    label = decision.state === 'dormant' ? 'Dormant' : 'Decided against';
  } else if (resolution_type === 'replaced') {
    Icon = CheckCircle2;
    color = 'text-blue-600 bg-blue-50';
    label = 'Replaced';
  }

  const dateStr = resolved_at ? new Date(resolved_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

  return (
    <div className="p-3 rounded-xl border border-gray-100 bg-white flex items-center gap-3 opacity-75 grayscale-[0.5]">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h4>
        <p className="text-xs text-gray-500">{label} • {dateStr}</p>
      </div>
    </div>
  );
}
