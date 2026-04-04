import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create your document — Petty Lawsuits',
}

// Wizard has its own header strip built into the sidebar — suppress the global Header/Footer
export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
