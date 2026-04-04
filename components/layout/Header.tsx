'use client'
import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/documents', label: 'Documents' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-['Instrument_Serif'] text-xl tracking-tight hover:opacity-80 transition-opacity">
          Petty Lawsuits
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wizard"
            className="text-base text-white px-5 py-2 rounded-full transition-colors"
            style={{ background: 'var(--accent)' }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--accent-dark)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-[var(--foreground)] transition-transform ${open ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-5 h-px bg-[var(--foreground)] transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-[var(--foreground)] transition-transform ${open ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-6 py-4 space-y-3">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-base text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wizard"
            onClick={() => setOpen(false)}
            className="block text-base text-white px-5 py-2.5 rounded-full text-center mt-4"
            style={{ background: 'var(--accent)' }}
          >
            Get Started
          </Link>
        </nav>
      )}
    </header>
  )
}
