import Link from 'next/link'

const LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/documents', label: 'Documents' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-0">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="font-['Instrument_Serif'] text-lg">Petty Lawsuits</p>
            <p className="text-sm text-[var(--muted)] mt-2 max-w-xs leading-relaxed">
              This is a document generation tool, not a legal service. It does not constitute legal advice.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted)]">&copy; 2026 Petty Lawsuits. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
