# NSW Letters of Demand & Small Claims — Research Plan

**Purpose:** Understand the end-to-end process of issuing a letter of demand in NSW, what information we must collect, and exactly where the legal/unlicensed line sits — so we can position Petty Lawsuits with confidence.

**Format:** I'll research in four phases, checking in with you after each one (~30 min intervals). Each phase produces a standalone section in a master research doc (`findings.md` in this folder). You can redirect me between phases if something changes priority.

---

## Phase 1 — The Legal Process (What Actually Happens)

Map the full lifecycle of a dispute from "I got ripped off" to resolution.

- **Letter of demand anatomy:** What goes in one, what makes it legally effective, what's optional vs essential in NSW
- **Service/delivery rules:** How must a letter be delivered? Email, registered post, hand delivery — what's accepted if it later goes to tribunal?
- **Timelines & deadlines:** Standard response windows (7–14 days), statute of limitations for different claim types (3 years consumer, 6 years contract), NCAT filing windows
- **Escalation path:** Letter of demand → NCAT application → hearing → enforcement. What happens at each step and where does our product's scope end?
- **Claim types that matter most:** Consumer disputes, unpaid invoices, bond disputes, defective goods/services, neighbourhood disputes — which are highest volume in NSW?

**Deliverable:** Process map from dispute → resolution, with Petty Lawsuits' role clearly scoped.

---

## Phase 2 — Information We Need to Collect

Determine the exact data fields the wizard must capture to produce a valid, useful letter of demand.

- **Claimant details:** Full name, address, contact info, ABN (if business), capacity (individual vs company)
- **Defendant details:** Full name, address (registered if company), ABN lookup, relationship to claimant
- **Dispute specifics:** Date(s) of incident, location (for jurisdiction inference), amount claimed, breakdown of damages, description of events
- **Supporting evidence:** What types of evidence strengthen a claim? Invoices, receipts, photos, correspondence, contracts — what should we prompt users to upload?
- **Legal requirements:** Are there mandatory fields that NCAT or courts look for? Do certain claim types (e.g. Australian Consumer Law) require specific statutory references?
- **Comparison with NCAT application form:** What fields on the actual NCAT form overlap with our letter of demand fields, so we can pre-fill if the user escalates?

**Deliverable:** Draft field list for the wizard, mapped against both letter of demand and NCAT form requirements.

---

## Phase 3 — Licensing Boundaries (What We Can & Can't Do)

The critical compliance question. Research the Legal Profession Uniform Law (NSW) and related case law.

- **Definition of "legal practice":** What does the LPUL define as engaging in legal practice? Where's the line between document preparation and legal advice?
- **The document-generation safe zone:** Precedent suggests filling in blanks on a standard form ≠ legal practice, but analysing facts to determine legal effect = legal practice. Where exactly does an AI wizard sit?
- **Disclaimers & safe harbour:** What disclaimers do competitors use? What language do we need in the UI and in generated documents?
- **Comparable services:** How do LawPath, LegalVision, Airtasker Legal, and similar platforms position themselves? Do they hold practising certificates or operate under exemptions?
- **What we must NOT do:** Advise on merits of a claim, recommend legal strategy, guarantee outcomes, represent users, draft court submissions
- **What we CAN do:** Provide templates, collect information via structured forms, generate documents from user-supplied facts, provide general legal information (not advice)

**Deliverable:** Compliance guardrails document — a clear "do / don't" list for the product and all generated copy.

---

## Phase 4 — Competitive Landscape & Positioning

Understand what's already out there and where the gap is.

- **Direct competitors:** pettylawsuit.com (US), LawPath, LegalVision, LawDepot AU, Amica (family law) — what do they charge, what do they generate, how's the UX?
- **Free alternatives:** NSW Legal Aid templates, NSW Small Business Commissioner templates, Justice Connect — how good are they and why would someone pay us instead?
- **Pricing benchmarks:** What do lawyers charge for a letter of demand in NSW? ($300–$1,500 seems typical.) What do online services charge? Where does our $29/$49 sit?
- **Friction points in the current process:** Where do self-represented people get stuck? (Finding the right form, knowing what to write, serving correctly, escalating)
- **Our positioning thesis:** "Lawyer-quality document, fraction of the cost, zero legal jargon" — does the research support this?

**Deliverable:** Competitive matrix + positioning summary.

---

## Timeline

| Phase | Focus | Est. time | Check-in |
|-------|-------|-----------|----------|
| 1 | Legal process | ~30 min | After completion |
| 2 | Information requirements | ~30 min | After completion |
| 3 | Licensing boundaries | ~30 min | After completion |
| 4 | Competitive landscape | ~30 min | After completion |

All findings go into `docs/research/findings.md`, building up section by section.

---

**Awaiting your approval to begin.** Let me know if you want me to reprioritise any phase, add/remove topics, or change the check-in cadence.
