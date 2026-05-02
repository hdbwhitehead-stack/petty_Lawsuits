import Link from 'next/link'
import { StickerButton } from '@/components/ui/StickerButton'
import { StickerCard } from '@/components/ui/StickerCard'
import { Highlight } from '@/components/ui/Highlight'

const HOW_STEPS = [
  {
    num: '01',
    text: "You describe your dispute — who it's against, what happened, the amount you're claiming.",
    color: 'var(--sky-tint)',
    rotate: -1 as const,
  },
  {
    num: '02',
    text: "AI generates a formal document tailored to your state's tribunal and legislation.",
    color: 'var(--pink-tint)',
    rotate: 0.5 as const,
  },
  {
    num: '03',
    text: 'You review, edit, and download as PDF or Word. Ready to send.',
    color: 'var(--grass-tint)',
    rotate: -0.5 as const,
  },
]

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      <h1 className="font-display font-extrabold text-4xl md:text-5xl text-center mb-12 leading-tight text-balance">
        Built for <Highlight>the wronged Aussie</Highlight> who can&apos;t justify a lawyer
      </h1>

      <div className="space-y-5 text-lg leading-relaxed">
        <p>
          Most legal disputes in Australia aren&apos;t worth the cost of a lawyer. A $2,000 bond
          dispute, a $500 unpaid invoice, a faulty product that the retailer refuses to replace —
          these are <Highlight>real problems that deserve real solutions</Highlight>. But when the
          legal fees cost more than the claim itself, most people just give up.
        </p>
        <p>
          Petty Lawsuits exists to change that. We use AI to generate formal, jurisdiction-aware
          legal documents — demand letters, complaint notices, tribunal filings — in minutes
          instead of days, and for a fraction of what a lawyer would charge.
        </p>
        <p>
          Every document is tailored to Australian law, references the correct state tribunal,
          and is written in the formal language that gets taken seriously. You fill in the details,
          we handle the paperwork.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-14">
        <StickerCard color="var(--lemon-tint)" rotate={-1}>
          <h2 className="font-display font-extrabold text-2xl mb-4">What we are</h2>
          <p className="text-base leading-relaxed">
            A document generation tool. We produce legal document templates based on the information
            you provide. We make the process faster, cheaper, and less intimidating.
          </p>
        </StickerCard>
        <StickerCard color="var(--card)" rotate={0.5}>
          <h2 className="font-display font-extrabold text-2xl mb-4">What we are not</h2>
          <p className="text-base leading-relaxed">
            A law firm. We do not provide legal advice, represent you in court, or guarantee any
            legal outcome. If you are unsure about your rights or obligations, we recommend seeking
            independent legal advice from a qualified professional.
          </p>
        </StickerCard>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-14">
        {HOW_STEPS.map(step => (
          <StickerCard key={step.num} color={step.color} rotate={step.rotate}>
            <p className="font-display font-extrabold text-5xl leading-none mb-3">{step.num}</p>
            <p className="text-base leading-relaxed">{step.text}</p>
          </StickerCard>
        ))}
      </div>

      <StickerCard color="var(--lemon)" rotate={0} padding="48px 32px" className="mt-20 text-center">
        <h2 className="font-display font-extrabold text-3xl mb-2">Got something to be petty about?</h2>
        <p
          className="font-marker text-2xl -rotate-1 mb-6"
          style={{ color: 'var(--accent-dark)', display: 'inline-block' }}
        >
          we&apos;ll write it for you ✦
        </p>
        <div>
          <StickerButton as={Link} href="/wizard" variant="primary" size="lg">
            Sue someone
          </StickerButton>
        </div>
      </StickerCard>
    </main>
  )
}
