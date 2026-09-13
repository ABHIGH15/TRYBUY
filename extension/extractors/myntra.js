window.TRYBUY_EXTRACTORS = window.TRYBUY_EXTRACTORS || {};

window.TRYBUY_EXTRACTORS.myntra = function(url, doc) {
  if (!url.includes('myntra.com')) return null;

  // Extract expected Product ID from the URL (e.g. .../20427300/buy)
  const urlMatch = url.match(/\/([0-9]+)(?:\/buy|\?|$)/i);
  const expectedId = urlMatch ? urlMatch[1] : null;

  let title, price, currency, image_url, merchant;
  let isStaleStateDetected = false;

  // Helper to validate ID matches
  const isValidProduct = (extractedId) => {
    if (!expectedId) return true; // If we can't parse URL, assume valid
    if (!extractedId) return false;
    return extractedId.toString() === expectedId;
  };

  // Helper to extract JSON-LD
  const getJsonLd = () => {
    let ldTitle, ldPrice, ldCurrency, ldImage, ldMerchant;
    const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    for (const script of scripts) {
      try {
        const parsed = JSON.parse(script.textContent);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          if (item['@type'] === 'Product' || (Array.isArray(item['@graph']) && item['@graph'].some(g => g['@type'] === 'Product'))) {
            const product = item['@type'] === 'Product' ? item : item['@graph'].find(g => g['@type'] === 'Product');
            
            // STRICT IDENTITY VALIDATION
            const extractedId = product.sku || product.mpn;
            if (expectedId && !isValidProduct(extractedId)) {
              console.warn(`[TRYBUY] JSON-LD stale state detected. Expected ${expectedId}, got ${extractedId}. Ignoring.`);
              isStaleStateDetected = true;
              continue; 
            }

            if (product.name) ldTitle = product.name;
            if (product.image) ldImage = Array.isArray(product.image) ? product.image[0] : product.image;
            if (product.brand?.name) ldMerchant = product.brand.name;
            if (product.offers) {
              const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
              if (offer.price) {
                const p = parseFloat(offer.price);
                if (!isNaN(p)) ldPrice = p;
              }
              if (offer.priceCurrency) ldCurrency = offer.priceCurrency;
            }
          }
        }
      } catch (e) {}
    }
    return { title: ldTitle, price: ldPrice, currency: ldCurrency, image_url: ldImage, merchant: ldMerchant };
  };

  // Helper to extract generic meta/DOM (least reliable for identity, only used as last resort)
  const getGeneric = () => {
    let gTitle = doc.title;
    let gImage, gPrice, gCurrency, gMerchant = 'Myntra';
    const getMeta = (prop) => doc.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') || doc.querySelector(`meta[name="${prop}"]`)?.getAttribute('content');
    
    gTitle = getMeta('og:title') || getMeta('twitter:title') || gTitle;
    gImage = getMeta('og:image') || getMeta('twitter:image');
    
    const priceStr = getMeta('product:price:amount') || getMeta('og:price:amount') || doc.querySelector('.pdp-price')?.textContent;
    if (priceStr) {
      const p = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
      if (!isNaN(p)) gPrice = p;
    }
    gCurrency = getMeta('product:price:currency') || getMeta('og:price:currency') || 'INR';
    gMerchant = getMeta('og:site_name') || gMerchant;
    
    return { title: gTitle, price: gPrice, currency: gCurrency, image_url: gImage, merchant: gMerchant };
  };

  // 1. Attempt window.__myx.pdpData
  try {
    const scripts = Array.from(doc.scripts);
    const myxScript = scripts.find(s => s.textContent.includes('window.__myx ='));
    if (myxScript) {
      const match = myxScript.textContent.match(/window\.__myx\s*=\s*(\{.*\})/s);
      if (match) {
        const myx = JSON.parse(match[1]);
        if (myx?.pdpData) {
          const pdp = myx.pdpData;
          
          // STRICT IDENTITY VALIDATION
          if (expectedId && !isValidProduct(pdp.id)) {
            console.warn(`[TRYBUY] __myx stale state detected. Expected ${expectedId}, got ${pdp.id}. Ignoring.`);
            isStaleStateDetected = true;
          } else {
            if (pdp.name) title = pdp.name;
            if (pdp.price?.discounted !== undefined) price = pdp.price.discounted;
            else if (pdp.price?.mrp !== undefined) price = pdp.price.mrp;
            
            if (pdp.brand?.name) merchant = pdp.brand.name;
            currency = 'INR';
            
            if (pdp.media?.albums?.[0]?.images?.[0]) {
              const imgObj = pdp.media.albums[0].images[0];
              image_url = imgObj.secureSrc || imgObj.src || imgObj.imageURL;
              if (image_url && image_url.includes('($height)')) {
                image_url = image_url.replace('h_($height),q_($qualityPercentage),w_($width)', 'h_1080,q_100,w_1080');
              }
            }
          }
        }
      }
    }
  } catch (e) {}

  // 2. Cascade Fallbacks
  const ld = getJsonLd();
  
  if (isStaleStateDetected) {
    console.warn(`[TRYBUY] Aborting extraction entirely due to stale SPA state.`);
    return null; 
  }
  
  const generic = getGeneric();

  // Merge with priority: __myx -> JSON-LD -> Generic
  title = title || ld.title || generic.title || undefined;
  price = price !== undefined ? price : (ld.price !== undefined ? ld.price : generic.price);
  currency = currency || ld.currency || generic.currency || undefined;
  image_url = image_url || ld.image_url || generic.image_url || undefined;
  merchant = merchant || ld.merchant || generic.merchant || 'Myntra';

  // Strict enforcement: if we couldn't confidently extract a title, fail completely
  if (!title) return null;

  return { title, price, currency, image_url, merchant };
};
