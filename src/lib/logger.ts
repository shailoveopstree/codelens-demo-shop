type Level = "debug" | "info" | "warn" | "error";

/** Minimal structured logger. Used across every module. */
export function log(level: Level, message: string, fields: Record<string, unknown> = {}): void {
  const line = { ts: new Date().toISOString(), level, message, ...fields };
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](JSON.stringify(line));
}
