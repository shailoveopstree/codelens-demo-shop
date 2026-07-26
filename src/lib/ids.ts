let counter = 0;

/** Not cryptographically strong — fine for the in-memory demo store. */
export function newId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}
