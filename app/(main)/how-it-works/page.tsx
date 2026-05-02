import Link from 'next/link'
import { StickerButton } from '@/components/ui/StickerButton'
import { StickerCard } from '@/components/ui/StickerCard'
import { Highlight } from '@/components/ui/Highlight'
import { AchievementChip } from '@/components/ui/AchievementChip'

const STEPS = [
  {
    num: '01',
    title: 'Spill the tea',
    xp: 100,
    color: 'var(--lemon)',
    rotate: -1 as const,
    sections: [
      {
        heading: "Who's the offender?",
        text: "Start by entering the details of the person or business you're making a claim against — their name, address, and contact information. You can file against an individual or a business.",
      },
      {
        heading: "Who's bringing the petty?",
        text: 'Enter your own contact details so the document can be properly addressed. This information stays private and is only used within your document.',
      },
      {
        heading: 'Spill the tea',
        text: "Describe the incident in your own words. Our AI will help you refine it into formal, professional language suitable for a legal document. Select the type of claim, when and where it happened, and the amount you're claiming.",
      },
      {
        heading: 'Show us the receipts',
        text: 'Attach any supporting documents — receipts, invoices, correspondence, photos. These strengthen your claim and help generate a more specific document.',
      },
    ],
  },
  {
    num: '02',
    title: 'We cite their nonsense',
    xp: 150,
    color: 'var(--pink)',
    rotate: 0.5 as const,
    sections: [
      {
        heading: 'Tailored to your jurisdiction',
        text: 'Based on your location, we automatically determine the correct state tribunal (NCAT, VCAT, QCAT, etc.) and include the right filing thresholds and procedural references.',
      },
      {
        heading: 'Sounds like a real lawyer wrote it',
        text: 'The document is drafted in formal Australian English using a legal template structure. All the details you provided are woven into a coherent, professional demand letter.',
      },
      {
        heading: 'Not legal advice',
        text: "We generate document templates based on your inputs. This is a document preparation tool — not a law firm. We recommend seeking independent legal advice if you're unsure about your rights.",
      },
    ],
  },
  {
    num: '03',
    title: 'Fire it off',
    xp: 200,
    color: 'var(--sky)',
    rotate: -0.5 as const,
    sections: [
      {
        heading: 'Preview before you commit',
        text: 'See a partial preview of your document before committing to a purchase. The first section is shown in full — the rest is unlocked after payment.',
      },
      {
        heading: 'Tweak any detail',
        text: 'After unlocking, you can adjust any editable field — names, dates, amounts, addresses — directly in the browser. The legal structure stays intact.',
      },
      {
        heading: 'Print it. Email it. Send it registered post.',
        text: "Export your finished document as a PDF or Word file. It's ready to print, email, or send via registered post.",
      },
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <AchievementChip>4,218 Aussies got petty this week</AchievementChip>
        </div>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl mb-4 leading-tight">
          How to get <Highlight>petty</Highlight>
        </h1>
        <p
          className="font-marker text-2xl text-muted"
          style={{ display: 'inline-block', transform: 'rotate(-1deg)' }}
        >
          From angry texts to formal demands ✦ in like 5 mins
        </p>
      </div>

      <div className="space-y-14">
        {STEPS.map(step => (
          <StickerCard key={step.num} color={step.color} rotate={step.rotate}>
            <div className="flex flex-wrap items-baseline gap-4 mb-6">
              <span className="font-display font-extrabold text-6xl leading-none">
                {step.num}
              </span>
              <h2 className="font-display font-extrabold text-3xl">{step.title}</h2>
              <AchievementChip>+{step.xp} XP</AchievementChip>
            </div>
            <div className="space-y-5 md:pl-20">
              {step.sections.map(s => (
                <div key={s.heading} className="border-l-2 border-foreground pl-5">
                  <h3 className="font-display font-bold text-lg mb-1">{s.heading}</h3>
                  <p className="text-base leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </StickerCard>
        ))}
      </div>

      <StickerCard color="var(--lemon)" rotate={0} padding="48px 32px" className="mt-20 text-center">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-3">
          Ready to get <Highlight>petty</Highlight>?
        </h2>
        <p
          className="font-marker text-2xl"
          style={{ display: 'inline-block', transform: 'rotate(-1deg)', marginBottom: 24 }}
        >
          the whole thing takes about 5 mins ✦
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <StickerButton as={Link} href="/wizard" variant="primary" size="lg">
            Sue someone
          </StickerButton>
          <StickerButton as={Link} href="/documents" variant="ghost" size="lg">
            See the document types
          </StickerButton>
        </div>
      </StickerCard>
    </main>
  )
}
