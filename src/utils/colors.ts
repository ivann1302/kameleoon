const VARIATION_COLORS = [
  '#FF6B35',
  '#4A90E2',
  '#5A5A5A',
  '#9B59B6',
];

export function getVariationColor(_variationId: string, index: number): string {
  const colorIndex = index % VARIATION_COLORS.length;
  return VARIATION_COLORS[colorIndex];
}

