'use client'
import UnlockTierCard from './UnlockTierCard'

type Props = {
  documentId: string
  recipientName: string
}

export default function UnlockModal({ documentId, recipientName }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Your Letter Is Ready</h2>
        <p className="text-center text-gray-600 mb-8">
          Demand letter to <strong>{recipientName}</strong> has been generated.
          Unlock it to view, edit, and download.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UnlockTierCard
            name="Send the Letter"
            price="$29"
            tierType="send"
            documentId={documentId}
            features={[
              'Full document access',
              'Download as PDF',
              'Email delivery to recipient',
            ]}
          />
          <UnlockTierCard
            name="Go Full Petty"
            price="$49"
            tierType="full_petty"
            documentId={documentId}
            highlight
            features={[
              'Everything in Send the Letter',
              'Download as Word doc',
              'Edit all fields in-browser',
              'Certified mail tracking',
              'Follow-up letter template',
            ]}
          />
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          This document was generated using a template tool. It is not legal advice.
        </p>
      </div>
    </div>
  )
}
