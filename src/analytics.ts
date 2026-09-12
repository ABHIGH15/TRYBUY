import { useExperimentStore } from "./store/experimentStore";
export type AnalyticsEventName = 
  | 'product_viewed'
  | 'save_clicked'
  | 'intent_prompt_shown'
  | 'intent_selected'
  | 'intent_skipped'
  | 'memory_viewed'
  | 'saved_product_revisited'
  | 'recommendation_clicked'
  | 'purchase_simulated'
  | 'reengagement_viewed'
  | 'reengagement_clicked'
  | 'bag_item_added'
  | 'bag_item_removed'
  | 'bag_quantity_changed'
  | 'checkout_attempted'
  | 'bag_viewed'
  | 'profile_viewed'
  | 'prototype_data_reset';

export interface AnalyticsEvent {
  id: string;
  eventName: AnalyticsEventName;
  timestamp: number;
  properties?: Record<string, any>;
  variant: 'control' | 'treatment';
}

class Analytics {
  private getVariant(): 'control' | 'treatment' {
    try {
      return useExperimentStore.getState().variant;
    } catch (e) {
      return 'control';
    }
  }

  track(eventName: AnalyticsEventName, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      eventName,
      timestamp: Date.now(),
      properties,
      variant: this.getVariant(),
    };

    // Log to console for prototype visibility
    console.log(`[Analytics] ${eventName}`, event);

    // Persist to local storage for demo purposes
    try {
      const stored = localStorage.getItem('trybuy-analytics-events');
      const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      events.push(event);
      localStorage.setItem('trybuy-analytics-events', JSON.stringify(events));
    } catch (e) {
      console.error("Failed to persist event", e);
    }
  }

  getEvents(): AnalyticsEvent[] {
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
