export type Reason = 'comparing' | 'waiting_for_price';
export type DecisionState = 'active' | 'resolved' | 'dormant';
export type ResolutionType = 'bought' | 'replaced' | 'declined';
export type ExtractionStatus = 'auto' | 'partial' | 'manual';

export interface ProductDetails {
  title: string;
  image_url: string;
  source_url: string;
  merchant: string;
  price_at_save?: number;
  currency?: string;
}

export interface Decision {
  id: string;
  reason: Reason;
  state: DecisionState;
  resolution_type: ResolutionType | null;
  resolution_note?: string;
  unreachable: boolean;
  product: ProductDetails;
  
  // Specific to waiting_for_price
  current_price?: number;
  target_price?: number;
  
  // Specific to comparing
  comparison_set_id?: string;
  
  extraction_status: ExtractionStatus;
  created_at: number;
  updated_at: number;
  resolved_at?: number;
}

export interface ComparisonSet {
  id: string;
  name: string;
  decision_ids: string[];
  created_at: number;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export type DecisionCreatePayload = Omit<Decision, 'id' | 'state' | 'resolution_type' | 'resolution_note' | 'created_at' | 'updated_at' | 'resolved_at'>;

export function createDecision(payload: DecisionCreatePayload): Decision {
  return {
    ...payload,
    id: generateId(),
    state: 'active',
    resolution_type: null,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}

export function createComparisonSet(name: string): ComparisonSet {
  return {
    id: generateId(),
    name,
    decision_ids: [],
    created_at: Date.now(),
  };
}

// Runtime Validation for safe persistence
export function validateDecision(obj: any): Decision | null {
  if (typeof obj !== 'object' || obj === null) return null;
  
  if (typeof obj.id !== 'string') return null;
  if (obj.reason !== 'comparing' && obj.reason !== 'waiting_for_price') return null;
  if (!['active', 'resolved', 'dormant'].includes(obj.state)) return null;
  
  // Impossible state checks
  if (obj.state === 'resolved' && !['bought', 'replaced', 'declined'].includes(obj.resolution_type)) return null;
  if (obj.state !== 'resolved' && obj.resolution_type !== null) return null;
  
  if (typeof obj.unreachable !== 'boolean') return null;
  
  if (typeof obj.product !== 'object' || obj.product === null) return null;
  if (typeof obj.product.title !== 'string') return null;
  if (typeof obj.product.source_url !== 'string') return null;
  if (obj.product.price_at_save !== undefined && typeof obj.product.price_at_save !== 'number') return null;
  if (obj.product.currency !== undefined && typeof obj.product.currency !== 'string') return null;
  
  if (typeof obj.extraction_status !== 'string') return null;
  if (typeof obj.created_at !== 'number') return null;
  if (typeof obj.updated_at !== 'number') return null;
  if (obj.resolved_at !== undefined && typeof obj.resolved_at !== 'number') return null;
  
  return obj as Decision;
}

export function validateComparisonSet(obj: any): ComparisonSet | null {
  if (typeof obj !== 'object' || obj === null) return null;
  if (typeof obj.id !== 'string') return null;
  if (typeof obj.name !== 'string') return null;
  if (!Array.isArray(obj.decision_ids)) return null;
  if (typeof obj.created_at !== 'number') return null;
  return obj as ComparisonSet;
}
