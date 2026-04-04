'use client'

import { useState } from 'react'

const JURISDICTIONS = [
  {
    code: 'NSW',
    tribunal: 'NCAT',
    name: 'New South Wales Civil & Administrative Tribunal',
    description: 'NCAT handles consumer claims, tenancy disputes, and home building complaints. Small claims up to $30,000 can be filed without a lawyer. Filing fees start from around $53.',
    legalAidName: 'LawAccess NSW',
    legalAidUrl: 'https://www.lawaccess.nsw.gov.au',
  },
  {
    code: 'VIC',
    tribunal: 'VCAT',
    name: 'Victorian Civil & Administrative Tribunal',
    description: 'VCAT resolves civil disputes, consumer claims, tenancy matters, and owners corporation issues. Claims under $10,000 qualify for the small claims track with simplified procedures.',
    legalAidName: 'Victoria Legal Aid',
    legalAidUrl: 'https://www.legalaid.vic.gov.au',
  },
  {
    code: 'QLD',
    tribunal: 'QCAT',
    name: 'Queensland Civil & Administrative Tribunal',
    description: 'QCAT covers minor civil disputes, consumer and trader claims, tenancy disputes, and tree/fencing matters. Minor civil disputes up to $25,000 are handled with streamlined processes.',
    legalAidName: 'Legal Aid Queensland',
    legalAidUrl: 'https://www.legalaid.qld.gov.au',
  },
  {
    code: 'WA',
    tribunal: 'SAT',
    name: 'State Administrative Tribunal (WA)',
    description: 'SAT handles commercial and civil matters, strata disputes, and some consumer claims. For general civil claims under $75,000, the Magistrates Court is the primary venue.',
    legalAidName: 'Legal Aid WA',
    legalAidUrl: 'https://www.legalaid.wa.gov.au',
  },
  {
    code: 'SA',
    tribunal: 'SACAT',
    name: 'South Australian Civil & Administrative Tribunal',
    description: 'SACAT deals with tenancy disputes, guardianship, and some civil matters. Minor civil claims up to $12,000 are handled in the Magistrates Court with informal procedures.',
    legalAidName: 'Legal Services Commission SA',
    legalAidUrl: 'https://lsc.sa.gov.au',
  },
  {
    code: 'TAS',
    tribunal: 'MRT',
    name: 'Magistrates Court (Administrative Appeals Division)',
    description: 'Tasmania uses the Magistrates Court for most minor civil disputes, with claims under $5,000 going through the Minor Civil Claims division. Procedures are designed to be accessible without legal representation.',
    legalAidName: 'Legal Aid Commission of Tasmania',
    legalAidUrl: 'https://www.legalaid.tas.gov.au',
  },
  {
    code: 'ACT',
    tribunal: 'ACAT',
    name: 'ACT Civil & Administrative Tribunal',
    description: 'ACAT resolves civil disputes, tenancy matters, and consumer claims in the ACT. Standard civil claims up to $25,000 can proceed without legal representation under simplified rules.',
    legalAidName: 'Legal Aid ACT',
    legalAidUrl: 'https://www.legalaidact.org.au',
  },
  {
    code: 'NT',
    tribunal: 'NTCAT',
    name: 'Northern Territory Civil & Administrative Tribunal',
    description: 'NTCAT handles tenancy disputes, consumer claims, and civil matters. For minor civil claims, the Local Court provides accessible dispute resolution processes suited to self-represented parties.',
    legalAidName: 'Northern Territory Legal Aid Commission',
    legalAidUrl: 'https://www.ntlac.nt.gov.au',
  },
]

export function JurisdictionMap() {
  const [selected, setSelected] = useState<string | null>(null)
  const active = JURISDICTIONS.find(j => j.code === selected)

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {JURISDICTIONS.map(j => (
          <button
            key={j.code}
            onClick={() => setSelected(selected === j.code ? null : j.code)}
            className="border rounded-lg px-5 py-3 transition-colors text-left"
            style={{
              borderColor: selected === j.code ? 'var(--accent)' : 'var(--border)',
              background: selected === j.code ? 'var(--accent-tint)' : 'var(--background)',
            }}
          >
            <p className="font-bold text-base">{j.code}</p>
            <p className="text-sm text-[var(--muted)]">{j.tribunal}</p>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="mt-6 mx-auto max-w-xl border rounded-lg p-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ borderColor: 'var(--accent)', background: 'var(--background)' }}
        >
          <h3 className="text-lg font-medium mb-1">{active.name}</h3>
          <p className="text-base text-[var(--muted)] leading-relaxed mb-4">{active.description}</p>
          <p className="text-sm">
            <span className="text-[var(--muted)]">Free legal help: </span>
            <a
              href={active.legalAidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {active.legalAidName}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
