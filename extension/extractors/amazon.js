window.TRYBUY_EXTRACTORS = window.TRYBUY_EXTRACTORS || {};

window.TRYBUY_EXTRACTORS.amazon = function(url, doc) {
  if (!url.includes('amazon.in') && !url.includes('amazon.com')) return null;

  const getPrice = () => {
    // Try the main price display block
    let priceStr = doc.querySelector('.a-price-whole')?.textContent;
    if (!priceStr) {
      // Fallback for some layouts
      priceStr = doc.querySelector('#priceblock_ourprice')?.textContent || doc.querySelector('#priceblock_dealprice')?.textContent;
    }
    if (priceStr) {
      const clean = priceStr.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(clean);
      if (!isNaN(parsed)) return parsed;
    }
    return undefined;
  };

  const getCurrency = () => {
    const symbol = doc.querySelector('.a-price-symbol')?.textContent;
    if (symbol?.includes('₹')) return 'INR';
    if (symbol?.includes('$')) return 'USD';
    if (url.includes('amazon.in')) return 'INR';
    return undefined;
  };

  const title = doc.querySelector('#productTitle')?.textContent?.trim() || undefined;
  const image = doc.querySelector('#landingImage')?.getAttribute('src') || doc.querySelector('#imgBlkFront')?.getAttribute('src') || undefined;

  // If we can't find at least a title, let generic fallback handle it
  if (!title) return null;

  return {
    merchant: 'Amazon',
    title,
    price: getPrice(),
    currency: getCurrency(),
    image_url: image
  };
};
