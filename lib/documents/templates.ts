export type DocumentField = {
  key: string
  label: string
  type: 'text' | 'date' | 'amount' | 'textarea'
}

export type DocumentTemplate = {
  id: string
  category: string
  label: string
  description: string
  fields: DocumentField[]
}

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'debt-recovery',
    category: 'Debt & Money',
    label: 'Debt Recovery Demand Letter',
    description: 'Formally demand repayment of money owed to you.',
    fields: [
      { key: 'creditor_name', label: 'Your full name', type: 'text' },
      { key: 'debtor_name', label: 'Debtor full name', type: 'text' },
      { key: 'amount_owed', label: 'Amount owed (AUD)', type: 'amount' },
      { key: 'due_date', label: 'Original due date', type: 'date' },
      { key: 'payment_deadline', label: 'Deadline to pay', type: 'date' },
      { key: 'payment_details', label: 'Your bank/payment details', type: 'text' },
    ],
  },
  {
    id: 'consumer-complaint',
    category: 'Consumer',
    label: 'Faulty Goods / Services Complaint',
    description: 'Demand a refund or remedy for faulty goods or poor service.',
    fields: [
      { key: 'complainant_name', label: 'Your full name', type: 'text' },
      { key: 'business_name', label: 'Business name', type: 'text' },
      { key: 'product_service', label: 'Product or service purchased', type: 'text' },
      { key: 'purchase_date', label: 'Date of purchase', type: 'date' },
      { key: 'amount_paid', label: 'Amount paid (AUD)', type: 'amount' },
      { key: 'remedy_sought', label: 'What remedy do you want? (refund, repair, replacement)', type: 'text' },
    ],
  },
  {
    id: 'bond-dispute',
    category: 'Tenancy',
    label: 'Bond Dispute Letter',
    description: 'Dispute an unfair bond deduction by your landlord or property manager.',
    fields: [
      { key: 'tenant_name', label: 'Your full name', type: 'text' },
      { key: 'landlord_name', label: 'Landlord / agent name', type: 'text' },
      { key: 'property_address', label: 'Rental property address', type: 'text' },
      { key: 'bond_amount', label: 'Total bond paid (AUD)', type: 'amount' },
      { key: 'disputed_amount', label: 'Amount being withheld (AUD)', type: 'amount' },
      { key: 'vacated_date', label: 'Date you vacated', type: 'date' },
    ],
  },
  {
    id: 'cease-and-desist',
    category: 'Cease & Desist',
    label: 'Cease & Desist Letter',
    description: 'Formally demand that someone stop a specified course of conduct.',
    fields: [
      { key: 'sender_name',       label: 'Your full name',                 type: 'text' },
      { key: 'recipient_name',    label: 'Recipient full name',            type: 'text' },
      { key: 'conduct_summary',   label: 'Conduct to cease (one line)',    type: 'text' },
      { key: 'conduct_recital',   label: 'Description of the conduct',     type: 'textarea' },
      { key: 'demand_paragraph',  label: 'The demand (cease and desist)',  type: 'textarea' },
      { key: 'deadline_date',     label: 'Date by which conduct must stop', type: 'date' },
      { key: 'consequences',      label: 'Consequences if not stopped',    type: 'textarea' },
      { key: 'sender_signature',  label: 'Sender signature block',         type: 'text' },
    ],
  },
]

export function getTemplate(id: string): DocumentTemplate | undefined {
  return TEMPLATES.find(t => t.id === id)
}

export const CATEGORIES = Array.from(new Set(TEMPLATES.map(t => t.category)))
