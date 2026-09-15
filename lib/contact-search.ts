export function contactMatchesQuery(contact: { name: string; phone: string }, query: string) {
  const text = query.trim().toLocaleLowerCase();
  if (text.length < 2) return false;
  if (contact.name.toLocaleLowerCase().includes(text)) return true;
  const digits = query.replace(/\D/g, "");
  if (digits.length < 2 || /[a-z]/i.test(query)) return false;
  const phone = contact.phone.replace(/\D/g, "");
  const local = phone.startsWith("260") ? `0${phone.slice(3)}` : phone;
  return phone.includes(digits) || local.includes(digits);
}
