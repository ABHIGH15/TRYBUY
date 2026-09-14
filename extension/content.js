const TRYBUY_CONFIG = {
  // Update this to your deployed app URL (e.g., https://trybuy-app.vercel.app)
  APP_URL: 'https://trybuy.vercel.app'
};

(function() {
  const url = window.location.href;
  const doc = document;
  
  let result = null;

  // 1. Amazon Extractor
  if (window.TRYBUY_EXTRACTORS?.amazon) {
    result = window.TRYBUY_EXTRACTORS.amazon(url, doc);
  }

  // 2. Myntra Extractor
  if (!result && window.TRYBUY_EXTRACTORS?.myntra) {
    result = window.TRYBUY_EXTRACTORS.myntra(url, doc);
  }

  // 3. Generic Extractor (JSON-LD / OG)
  if (!result && window.TRYBUY_EXTRACTORS?.generic) {
    result = window.TRYBUY_EXTRACTORS.generic(url, doc);
  }

  // Build the payload
  const payload = {
    source_url: url,
    title: result?.title || undefined,
    image: result?.image_url || undefined,
    price: result?.price !== undefined ? result.price : undefined,
    currency: result?.currency || undefined,
    merchant: result?.merchant || new URL(url).hostname.replace('www.', ''),
    extraction_status: (result?.title && result?.price !== undefined) ? 'auto' : (result?.title ? 'partial' : 'manual')
  };

  // Convert payload to base64 JSON string
  const payloadStr = JSON.stringify(payload);
  const encodedPayload = btoa(unescape(encodeURIComponent(payloadStr)));

  // Open the TRYBUY app with the payload
  const destination = `${TRYBUY_CONFIG.APP_URL.replace(/\/$/, '')}/capture?payload=${encodedPayload}`;
  window.open(destination, '_blank');
})();
