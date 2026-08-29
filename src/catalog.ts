/** Product catalog. Prices in whole currency units. */
export const CATALOG: Record<string, number> = {
  widget: 9,
  gadget: 13,
  sprocket: 4,
  bolt: 1,
};

export function priceOf(item: string): number {
  return CATALOG[item] ?? 0;
}
