export type LegalDocumentId = "terms" | "privacy" | "payments";

export type LegalSection = { id: string; title: string; body: string };

export type LegalDocument = {
  id: LegalDocumentId;
  title: string;
  shortTitle: string;
  summary: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
  terms: {
    id: "terms",
    title: "Terms and Conditions",
    shortTitle: "Terms",
    summary: "How New WorldCargo services and customer responsibilities work.",
    effectiveDate: "Preview policy · Legal approval required before launch",
    sections: [
      { id: "service", title: "Using our services", body: "New WorldCargo helps customers request local delivery, city-to-city movement, imports, and tailored cargo support. A booking request is not a confirmed transport contract until New WorldCargo confirms availability, route, pricing, and collection arrangements." },
      { id: "booking", title: "Booking details and cargo", body: "You are responsible for providing accurate pickup, destination, contact, cargo, and handling information. Cargo must be lawful, safely packaged, and suitable for the requested service. We may ask for more details before confirming a request." },
      { id: "collection", title: "Pickup and delivery", body: "Pickup and delivery windows are estimates unless a confirmed schedule says otherwise. Customers should ensure that an authorized person is available at collection and handover. Changes, missed collection, or destination restrictions may affect timing and cost." },
      { id: "pricing", title: "Prices and payment", body: "A displayed estimate is for planning only until New WorldCargo confirms the final price. Payment methods, wallet use, invoices, receipts, and refund treatment are explained in the Payment and Refund Policy." },
      { id: "help", title: "Changes and support", body: "Use shipment management or Support in the app when you need to update instructions, ask about an exception, cancel an eligible request, or report a problem. We will explain the available next step for the service and shipment stage." },
    ],
  },
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    shortTitle: "Privacy",
    summary: "How account, route, and shipment information is handled.",
    effectiveDate: "Preview policy · Legal approval required before launch",
    sections: [
      { id: "information", title: "Information we use", body: "The app may use account details, contact information, saved places, shipment requests, route details, payment records, support messages, and device permission choices to provide cargo services and customer support." },
      { id: "purpose", title: "Why we use it", body: "Information is used to create and manage shipment requests, send operational updates, produce invoices and receipts, improve service support, protect customer accounts, and meet applicable operational requirements." },
      { id: "sharing", title: "When information is shared", body: "Only the information needed for a shipment or support request may be shared with relevant service teams, delivery partners, payment providers, or authorities where required. Marketing preferences do not control essential cargo or billing updates." },
      { id: "choices", title: "Your choices", body: "You can manage communication preferences, saved places, recipients, recognized devices, and data-control requests in Account settings. Requesting data export or account deletion starts a review process; it does not immediately remove records required for an active shipment or legal obligation." },
      { id: "security", title: "Security and contact", body: "Use a unique password and review recognized devices regularly. Contact Support through the app if you believe your account or information has been used without permission." },
    ],
  },
  payments: {
    id: "payments",
    title: "Payment and Refund Policy",
    shortTitle: "Payments & refunds",
    summary: "Billing, wallet, proof, refund, and dispute information.",
    effectiveDate: "Preview policy · Legal approval required before launch",
    sections: [
      { id: "estimates", title: "Quotes, invoices, and payment", body: "Shipment estimates help customers plan before a final price is confirmed. An invoice identifies the charge connected to a shipment or service. Pay only through approved New WorldCargo payment options shown in the app or confirmed by the service team." },
      { id: "wallet", title: "Cargo Wallet", body: "Cargo Wallet availability, balances, top-ups, and eligible use are displayed in the app. A wallet payment is confirmed only after the related invoice is paid and the transaction appears in customer records." },
      { id: "receipts", title: "Receipts and proof", body: "Paid invoices have customer receipts. Completed shipments may have proof of delivery. These documents help customers retain service records, but customers should review the details and contact Support if a record appears incorrect." },
      { id: "refunds", title: "Refunds and disputes", body: "A refund, credit, or charge review depends on the service, payment stage, and shipment circumstances. Customers can open a charge review from the related invoice. The app will show the request status and next action while the review is in progress." },
      { id: "changes", title: "Cancellations and changes", body: "Cancellation and change eligibility depends on whether collection, movement, or handover has started. The app shows available shipment-management actions and explains when Support review is required." },
    ],
  },
};

export function isLegalDocumentId(value: string | string[] | undefined): value is LegalDocumentId {
  return typeof value === "string" && value in legalDocuments;
}
