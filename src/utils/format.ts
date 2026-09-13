export function formatPrice(price: number | undefined | null, currency?: string): string {
  if (price === undefined || price === null || isNaN(price)) {
    return 'Price unknown';
  }

  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(price);
    } catch (e) {
      // Fallback if currency code is invalid
      return `${currency} ${price.toFixed(2)}`;
    }
  }

  // If no currency is known, just display the number
  return price.toFixed(2);
}
