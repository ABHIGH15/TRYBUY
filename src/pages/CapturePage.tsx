import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Link, 
  Image as ImageIcon, 
  Tag, 
  Store, 
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useDecisionStore } from '../store/decisionStore';
import { createDecision, createComparisonSet as domainCreateComparisonSet } from '../types/domain';
import type { Reason, ComparisonSet } from '../types/domain';
import { extractMetadata } from '../services/extraction';
import { analytics } from '../analytics';

export function CapturePage() {
  const navigate = useNavigate();
  const { addDecision, comparisonSets, createComparisonSet, addToComparisonSet } = useDecisionStore();

  const abortControllerRef = useRef<AbortController | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [url, setUrl] = useState('');
  const [step, setStep] = useState<'input' | 'extracting' | 'editing'>('input');
  const [error, setError] = useState<string | null>(null);

  // Extracted/Edited Metadata
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [merchant, setMerchant] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('');
  const [extractionStatus, setExtractionStatus] = useState<'auto' | 'partial' | 'manual'>('manual');
  const [sourceDomain, setSourceDomain] = useState('');

  // Reason & Action
  const [reason, setReason] = useState<Reason | null>(null);
  
  // Price specific
  const [targetPrice, setTargetPrice] = useState('');
  
  // Comparing specific
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [newSetName, setNewSetName] = useState('');
  const [isCreatingSet, setIsCreatingSet] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('Please enter a valid product URL.');
      return;
    }
    
    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }
    
    try {
      new URL(validUrl);
    } catch {
      setError('That doesn\'t look like a valid URL.');
      return;
    }

    setUrl(validUrl);
    setStep('extracting');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const result = await extractMetadata(validUrl, abortController.signal);
      
      setTitle(result.title || '');
      setImageUrl(result.image_url || '');
      setMerchant(result.merchant || '');
      setPrice(result.price !== undefined ? result.price.toString() : '');
      setCurrency(result.currency || '');
      setExtractionStatus(result.status);
      setSourceDomain(result.domain);

      analytics.track('capture_extraction_result', {
        domain: result.domain,
        result: result.status === 'manual' ? 'failed' : result.status
      });

      setStep('editing');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // user submitted another URL, ignore this one
        return;
      }
      // Fallback to manual entry on complete crash/timeout
      setExtractionStatus('manual');
      setSourceDomain(new URL(validUrl).hostname);
      setStep('editing');
      
      analytics.track('capture_extraction_result', {
        domain: new URL(validUrl).hostname,
        result: 'failed'
      });
    }
  };

  const handleSave = () => {
    if (!reason || isSaving) return;
    setIsSaving(true);
    
    // Parse numbers safely
    const parsedPrice = parseFloat(price);
    const parsedTarget = targetPrice ? parseFloat(targetPrice) : undefined;
    
    const decision = createDecision({
      reason,
      unreachable: false,
      product: {
        title: title.trim() || 'Unknown Product',
        image_url: imageUrl.trim(),
        source_url: url,
        merchant: merchant.trim() || sourceDomain,
        price_at_save: isNaN(parsedPrice) ? undefined : parsedPrice,
        currency: currency || undefined
      },
      current_price: isNaN(parsedPrice) ? undefined : parsedPrice,
      target_price: parsedTarget && !isNaN(parsedTarget) ? parsedTarget : undefined,
      extraction_status: extractionStatus,
    });

    addDecision(decision);

    // Handle comparison set association
    if (reason === 'comparing') {
      let finalSetId = selectedSetId;
      
      if (isCreatingSet && newSetName.trim()) {
        const newSet = domainCreateComparisonSet(newSetName.trim());
        createComparisonSet(newSet);
        finalSetId = newSet.id;
        
        analytics.track('comparison_set_created', {
          set_id: finalSetId,
          item_count_after: 1
        });
      }

      if (finalSetId) {
        addToComparisonSet(finalSetId, decision.id);
        
        // Only track item_added if we didn't just create it (to avoid duplicate counting conceptually, though spec is loose here. Let's just track added).
        const updatedSet = useDecisionStore.getState().comparisonSets[finalSetId];
        if (!isCreatingSet) {
          analytics.track('comparison_item_added', {
            set_id: finalSetId,
            item_count_after: updatedSet?.decision_ids.length || 1
          });
        }
      }
    }

    analytics.track('decision_saved', {
      reason,
      source_domain: sourceDomain,
      extraction_status: extractionStatus
    });

    // Reset and navigate home/dashboard
    navigate('/');
  };

  const isSaveEnabled = () => {
    if (!reason) return false;
    if (reason === 'comparing' && isCreatingSet && !newSetName.trim()) return false;
    if (reason === 'comparing' && !isCreatingSet && !selectedSetId) return false;
    // We don't block on empty title/price because extraction failure shouldn't block saving (per spec).
    // We'll use defaults like 'Unknown Product' if they are left blank.
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          aria-label="Go back"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <span className="font-bold text-gray-900 uppercase tracking-wider text-xs">Capture</span>
        <div className="w-9" />
      </header>

      <main className="px-6 space-y-8">
        
        {/* Step 1: URL Input */}
        <section className={`transition-opacity duration-300 ${step === 'input' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <form onSubmit={handleFetch} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/product"
                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm"
                readOnly={step !== 'input'}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
            {step === 'input' && (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl font-medium shadow-sm hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 'extracting' && (
              <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-medium flex justify-center items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                Reading product page...
              </div>
            )}
          </form>
        </section>

        {/* Step 2: Editable Metadata & Reason Selection */}
        {step === 'editing' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product Details</h2>
                {extractionStatus === 'manual' && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Manual Entry</span>
                )}
                {extractionStatus === 'partial' && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Partial Data</span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <Tag className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Product Title"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Store className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={merchant} 
                      onChange={e => setMerchant(e.target.value)}
                      placeholder="Store Name"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>
                  <div className="flex w-1/2 relative">
                    <input
                      type="text"
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      placeholder="Cur"
                      className="w-14 px-2 py-2 bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg text-sm text-gray-500 focus:bg-white focus:ring-1 focus:ring-black outline-none uppercase"
                      maxLength={3}
                    />
                    <input 
                      type="number" 
                      step="0.01"
                      value={price} 
                      onChange={e => setPrice(e.target.value)}
                      placeholder="Price"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-r-lg text-sm focus:bg-white focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <ImageIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="url" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="Image URL (optional)"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">What are you waiting for?</h2>
              
              <div className="space-y-3">
                <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${reason === 'comparing' ? 'border-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="reason" 
                      value="comparing"
                      checked={reason === 'comparing'}
                      onChange={() => setReason('comparing')}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="font-medium text-gray-900">Comparing with other options</span>
                  </div>
                </label>

                {reason === 'comparing' && (
                  <div className="pl-8 pr-4 py-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {Object.keys(comparisonSets).length > 0 && !isCreatingSet && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Add to existing set</label>
                        <select 
                          value={selectedSetId}
                          onChange={e => setSelectedSetId(e.target.value)}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                        >
                          <option value="" disabled>Select a comparison set...</option>
                          {Object.values(comparisonSets).map((set: ComparisonSet) => (
                            <option key={set.id} value={set.id}>
                              {set.name} ({set.decision_ids.length} items)
                            </option>
                          ))}
                        </select>
                        <button 
                          type="button"
                          onClick={() => setIsCreatingSet(true)}
                          className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-2 hover:text-black transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Or create a new set
                        </button>
                      </div>
                    )}

                    {(Object.keys(comparisonSets).length === 0 || isCreatingSet) && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Create new comparison set</label>
                        <input 
                          type="text"
                          value={newSetName}
                          onChange={e => setNewSetName(e.target.value)}
                          placeholder='e.g. "Jackets" or "Living Room Rug"'
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                        />
                        {Object.keys(comparisonSets).length > 0 && (
                          <button 
                            type="button"
                            onClick={() => setIsCreatingSet(false)}
                            className="text-sm text-gray-500 font-medium mt-2 hover:text-black transition-colors"
                          >
                            Cancel and use existing set
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${reason === 'waiting_for_price' ? 'border-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="reason" 
                      value="waiting_for_price"
                      checked={reason === 'waiting_for_price'}
                      onChange={() => setReason('waiting_for_price')}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="font-medium text-gray-900">Waiting for a better price</span>
                  </div>
                </label>

                {reason === 'waiting_for_price' && (
                  <div className="pl-8 pr-4 py-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-gray-700">Target Price (Optional)</label>
                    <div className="flex relative w-1/2">
                      {currency && (
                        <div className="w-14 px-2 py-2 bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg text-sm text-gray-500 uppercase flex items-center justify-center">
                          {currency}
                        </div>
                      )}
                      <input 
                        type="number" 
                        step="0.01"
                        value={targetPrice}
                        onChange={e => setTargetPrice(e.target.value)}
                        placeholder="e.g. 150.00"
                        className={`w-full px-3 py-2 bg-white border border-gray-200 ${currency ? 'rounded-r-lg' : 'rounded-lg'} text-sm focus:ring-1 focus:ring-black outline-none`}
                      />
                    </div>
                    <p className="text-xs text-gray-500">We'll use your saved price as the baseline.</p>
                  </div>
                )}
              </div>
            </section>

            <button
              onClick={handleSave}
              disabled={!isSaveEnabled() || isSaving}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold shadow-md hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex justify-center items-center gap-2"
            >
              {isSaving ? 'Saving...' : 'Save to Workspace'}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
