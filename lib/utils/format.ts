export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "-";
  return value.toFixed(digits).replace(/\.00$/, "");
}

