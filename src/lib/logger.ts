type Level = "debug" | "info" | "warn" | "error";

/** Minimal structured logger. Used across every module. */
export function log(level: Level, message: string, fields: Record<string, unknown> = {}): void {
  const safeFields = fields && typeof fields === "object" ? fields : {};
  const line = { ts: new Date().toISOString(), level, message, ...safeFields };
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](JSON.stringify(line));
}
