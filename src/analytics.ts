import type { ExtractionStatus, Reason, ResolutionType } from './types/domain';

export type AnalyticsEventPayloads = {
  decision_saved: { reason: Reason; source_domain: string; extraction_status: ExtractionStatus };
  capture_extraction_result: { domain: string; result: 'auto' | 'partial' | 'failed' };
  comparison_set_created: { set_id: string; item_count_after: number };
  comparison_item_added: { set_id: string; item_count_after: number };
  price_recheck_triggered: { decision_id: string; trigger: 'manual' | 'auto' };
  decision_resolved: { decision_id: string; resolution_type: ResolutionType; reason: Reason; days_since_saved: number };
  decision_dormant: { decision_id: string; reason: Reason; days_since_saved: number };
  home_opened: { open_decision_count: number; active_trigger_count: number };
};

export type AnalyticsEventName = keyof AnalyticsEventPayloads;

export interface AnalyticsEvent<T extends AnalyticsEventName> {
  id: string;
  eventName: T;
  timestamp: number;
  properties: AnalyticsEventPayloads[T];
}

class Analytics {
  track<T extends AnalyticsEventName>(eventName: T, properties: AnalyticsEventPayloads[T]) {
    const event: AnalyticsEvent<T> = {
      id: crypto.randomUUID(),
      eventName,
      timestamp: Date.now(),
      properties,
    };

    console.log(`[Analytics] ${eventName}`, event);

    try {
      const stored = localStorage.getItem('trybuy-analytics-events');
      const events: any[] = stored ? JSON.parse(stored) : [];
      events.push(event);
      localStorage.setItem('trybuy-analytics-events', JSON.stringify(events));
    } catch (e) {
      console.error("Failed to persist event", e);
    }
  }

  getEvents(): any[] {
    try {
      const stored = localStorage.getItem('trybuy-analytics-events');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  clearEvents() {
    localStorage.removeItem('trybuy-analytics-events');
  }
}

export const analytics = new Analytics();
