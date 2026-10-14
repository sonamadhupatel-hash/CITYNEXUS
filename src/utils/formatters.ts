/**
 * Currency & Formatting Utilities for City Nexus
 * All calculations and monetary displays in Indian Rupees (INR - ₹)
 * using Indian Numbering System (Crores and Lakhs).
 */

export function formatINR(amount: number, options?: { showDecimals?: boolean; compact?: boolean }): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  let formatted = '';
  if (abs >= 10000000) { // 1 Crore = 10,000,000
    const cr = abs / 10000000;
    formatted = `${cr.toFixed(cr >= 100 ? 1 : 2)} Cr`;
  } else if (abs >= 100000) { // 1 Lakh = 100,000
    const lakh = abs / 100000;
    formatted = `${lakh.toFixed(lakh >= 100 ? 1 : 2)} Lakh`;
  } else if (abs >= 1000) {
    formatted = `${abs.toLocaleString('en-IN')}`;
  } else {
    formatted = `${Math.round(abs)}`;
  }

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatCrores(amountINR: number, decimals: number = 2): string {
  const cr = amountINR / 10000000;
  return `₹${cr.toFixed(decimals)} Cr`;
}

export function formatLakhs(amountINR: number, decimals: number = 2): string {
  const lakh = amountINR / 100000;
  return `₹${lakh.toFixed(decimals)} Lakh`;
}
