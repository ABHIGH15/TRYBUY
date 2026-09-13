import type { ExtractionStatus } from '../types/domain';

export interface ExtractionResult {
  title?: string;
  image_url?: string;
  merchant?: string;
  price?: number;
  currency?: string;
  status: ExtractionStatus;
  domain: string;
}

/**
 * Stage 0 Extraction Boundary.
 * 
 * A real best-effort extraction attempt using a public CORS proxy; reliability varies by retailer and network conditions.
 * Manually parses OpenGraph/Standard metadata tags.
 */
export async function extractMetadata(url: string, signal?: AbortSignal): Promise<ExtractionResult> {
  let domain = 'unknown';
  try {
    const parsed = new URL(url);
    domain = parsed.hostname.replace('www.', '');
  } catch (e) {
    domain = 'invalid';
  }

  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    // Explicit timeout for extraction as it should not hang indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // Wire up the caller's signal if provided
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        controller.abort();
      });
    }

    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Extraction proxy request failed');
    }

    const data = await response.json();
    if (!data.contents) {
      throw new Error('No HTML content returned');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');

    // Helper to extract meta tags
    const getMeta = (property: string): string | undefined => 
      doc.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ||
      doc.querySelector(`meta[name="${property}"]`)?.getAttribute('content') || undefined;

    const title = getMeta('og:title') || getMeta('twitter:title') || doc.title;
    const image_url = getMeta('og:image') || getMeta('twitter:image');
    
    // Price scraping is notoriously flaky without a headless browser/JSON-LD parsing,
    // but we attempt basic OpenGraph extraction.
    const priceStr = getMeta('product:price:amount') || getMeta('og:price:amount');
    let price: number | undefined = undefined;
    
    if (priceStr) {
      // Clean up currency symbols/commas if any exist
      const cleanPrice = priceStr.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(cleanPrice);
      if (!isNaN(parsed)) {
        price = parsed;
      }
    }

    const currency = getMeta('product:price:currency') || getMeta('og:price:currency');
    const siteName = getMeta('og:site_name') || domain;

    if (title && image_url && price !== undefined) {
      return { title, image_url, merchant: siteName, price, currency, status: 'auto', domain };
    } else if (title) {
      return { title, image_url, merchant: siteName, price, currency, status: 'partial', domain };
    } else {
      return { status: 'manual', domain };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error; // Let the caller handle cancellation
    }
    // Total extraction failure
    return { status: 'manual', domain };
  }
}
