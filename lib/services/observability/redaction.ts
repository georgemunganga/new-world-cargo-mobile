export type RedactableProperties = Record<string, string | number | boolean | null | undefined>;

const sensitiveKeyPattern = /token|password|secret|authorization|cookie|phone|email|address/i;
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern = /(?:\+?\d[\d\s().-]{7,}\d)/g;
const bearerPattern = /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi;

export function redactSensitiveText(value: string) {
  return value
    .replace(bearerPattern, "Bearer [redacted]")
    .replace(emailPattern, "[redacted-email]")
    .replace(phonePattern, "[redacted-phone]");
}

export function redactSensitiveProperties(properties: RedactableProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => {
      if (sensitiveKeyPattern.test(key)) return [key, "[redacted]"];
      if (typeof value === "string") return [key, redactSensitiveText(value)];
      return [key, value];
    }),
  ) as RedactableProperties;
}
