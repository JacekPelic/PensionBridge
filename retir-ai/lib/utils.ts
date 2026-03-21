export function formatCurrency(amount: number, showSign = false): string {
  const prefix = showSign && amount > 0 ? '+' : '';
  return `${prefix}€${Math.abs(amount).toLocaleString()}`;
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${Math.round(amount / 1000)}K`;
  return `€${amount}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
