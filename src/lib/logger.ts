type Level = "debug" | "info" | "warn" | "error";

/** Mask the local-part of an email so it is safe to put in a log line. */
export function redactEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  return `${email[0]}***${email.slice(at)}`;
}

/** Minimal structured logger. Used across every module. */
export function log(level: Level, message: string, fields: Record<string, unknown> = {}): void {
  const safeFields = fields && typeof fields === "object" ? fields : {};
  const line = { ts: new Date().toISOString(), level, message, ...safeFields };
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](JSON.stringify(line));
}
