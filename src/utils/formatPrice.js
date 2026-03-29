/**
 * Formats a number as Indian Rupees.
 * e.g. 1299.99 → ₹1,299.99
 */
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatPrice = (amount) => formatter.format(amount);
