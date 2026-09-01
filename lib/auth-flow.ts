export const FRONTEND_OTP_CODE = "123456";

export function normaliseZambianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("260")) return `+${digits}`;
  if (digits.startsWith("0")) return `+260${digits.slice(1)}`;
  return `+260${digits}`;
}

export function isValidPhoneInput(value: string) {
  return normaliseZambianPhone(value).replace(/\D/g, "").length === 12;
}

export function isValidEmailInput(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidAuthIdentifier(value: string) {
  return isValidEmailInput(value) || isValidPhoneInput(value);
}

export function normaliseAuthIdentifier(value: string) {
  return isValidEmailInput(value) ? value.trim().toLowerCase() : normaliseZambianPhone(value);
}

export function isValidFrontendOtp(value: string) {
  return value.replace(/\s/g, "") === FRONTEND_OTP_CODE;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}
