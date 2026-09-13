window.TRYBUY_EXTRACTORS = window.TRYBUY_EXTRACTORS || {};

window.TRYBUY_EXTRACTORS.generic = function(url, doc) {
  let domain = 'unknown';
  try {
    domain = new URL(url).hostname.replace('www.', '');
  } catch(e) {}

  let title = undefined;
  let image_url = undefined;
  let price = undefined;
  let currency = undefined;
  let merchant = domain;

  const getMeta = (prop) => {
    const el = doc.querySelector(`meta[property="${prop}"]`) || doc.querySelector(`meta[name="${prop}"]`);
    return el ? el.getAttribute('content') : undefined;
  };

  // 1. JSON-LD Priority
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const parsed = JSON.parse(script.textContent);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item['@type'] === 'Product' || (Array.isArray(item['@graph']) && item['@graph'].some(g => g['@type'] === 'Product'))) {
          const product = item['@type'] === 'Product' ? item : item['@graph'].find(g => g['@type'] === 'Product');
          
          if (product.name) title = product.name;
          if (product.image) {
             image_url = Array.isArray(product.image) ? product.image[0] : product.image;
          }
          if (product.brand && product.brand.name) merchant = product.brand.name;
          
          if (product.offers) {
            const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
            if (offer.price) {
              const p = parseFloat(offer.price);
              if (!isNaN(p)) price = p;
            }
            if (offer.priceCurrency) currency = offer.priceCurrency;
          }
        }
      }
    } catch(e) {}
  }

  // 2. OpenGraph Fallbacks
  if (!title) title = getMeta('og:title') || getMeta('twitter:title') || doc.title;
  if (!image_url) image_url = getMeta('og:image') || getMeta('twitter:image');
  if (price === undefined) {
    const priceStr = getMeta('product:price:amount') || getMeta('og:price:amount');
    if (priceStr) {
      const clean = priceStr.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(clean);
      if (!isNaN(parsed)) price = parsed;
    }
  }
  if (!currency) currency = getMeta('product:price:currency') || getMeta('og:price:currency');
  
  const ogSiteName = getMeta('og:site_name');
  if (ogSiteName && merchant === domain) merchant = ogSiteName;

  return { title, image_url, price, currency, merchant };
};
