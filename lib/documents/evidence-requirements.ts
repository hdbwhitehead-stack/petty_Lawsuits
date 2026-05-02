export type EvidenceItem = { key: string; label: string; required: boolean }

export const EVIDENCE_REQUIREMENTS: Record<string, EvidenceItem[]> = {
  'consumer-complaint': [
    { key: 'purchase_receipt', label: 'Purchase Receipt', required: true },
    { key: 'communication_records', label: 'Communication Records', required: true },
    { key: 'product_service_docs', label: 'Product/Service Documentation', required: false },
  ],
  'bond-dispute': [
    { key: 'lease_agreement', label: 'Lease Agreement', required: true },
    { key: 'condition_report', label: 'Ingoing Condition Report', required: false },
    { key: 'correspondence', label: 'Correspondence with Landlord/Agent', required: true },
  ],
  'debt-recovery': [
    { key: 'invoice_or_agreement', label: 'Invoice or Written Agreement', required: true },
    { key: 'communication_records', label: 'Communication Records', required: true },
  ],
  'cease-and-desist': [
    { key: 'communication_records', label: 'Communication Records', required: true },
    { key: 'offending_material', label: 'Screenshots or Copies of the Offending Material', required: true },
    { key: 'prior_correspondence', label: 'Prior Correspondence Asking the Conduct to Stop', required: false },
  ],
}
