# NSW Letters of Demand & Small Claims — Research Findings

> Compiled for Petty Lawsuits product positioning. This is a living document — each phase adds a new section.

---

## Phase 1: The Legal Process (What Actually Happens)

### 1.1 What Is a Letter of Demand?

A letter of demand is a formal written notice sent to a person or business that owes you money (or has otherwise breached an obligation), requesting they resolve the matter by a specified deadline. It is **not** a court document — it's a private communication. But it carries weight because:

- It shows you're serious and have documented the issue
- It creates a paper trail that courts and tribunals look favourably on ("Did you try to resolve this before filing?")
- NCAT and the Local Court both expect parties to have attempted resolution before filing — a letter of demand is the standard first step
- It often resolves the dispute without needing to escalate at all

There is **no mandatory template** prescribed by NSW law. The letter can be written by anyone — you don't need a lawyer. This is the core legal basis for Petty Lawsuits existing.

### 1.2 Essential Contents of a Letter of Demand

Based on guidance from NSW Legal Aid, the NSW Small Business Commissioner, and multiple law firms, a valid letter of demand in NSW should contain:

**Required elements:**

1. **Date** of the letter
2. **Sender's full details** — name, address, phone, email. If a business: ABN/ACN and registered business name
3. **Recipient's full details** — legal name (not trading name alone), address. If a company: registered office address, ACN
4. **Clear statement of the debt/obligation** — what is owed, why it's owed, referencing any contract, invoice, or agreement
5. **Amount claimed** — specific dollar figure with a breakdown (e.g. invoice amount + GST + interest if contractually entitled)
6. **Relevant dates** — when the goods/services were supplied, when payment was due, when the issue arose
7. **Deadline for response** — typically 7–14 days. Best practice: state both a number of days AND a calendar date (e.g. "within 14 days, by 5pm on Friday 18 April 2026")
8. **Consequence of non-payment** — a clear statement that you will take further action (e.g. filing with NCAT or the Local Court) if the matter is not resolved by the deadline
9. **Contact details for response** — how the recipient should respond (email, phone, postal)
10. **Signature** — wet ink or electronic

**Strongly recommended (not strictly required):**

- Copies of supporting documents (invoices, receipts, photos, contracts, correspondence)
- Reference to the specific legal basis (e.g. "pursuant to the consumer guarantees under the Australian Consumer Law, Schedule 2 of the Competition and Consumer Act 2010")
- A "without prejudice" or "save as to costs" header if you want the letter to be inadmissible in court (this is a strategic choice, not a requirement)
- A statement that you are open to resolving the matter without court action

**What to avoid:**

- Threats (beyond stating you'll take legal action)
- Emotional language or accusations
- Claiming amounts you're not entitled to (e.g. interest not provided for in the contract)
- Anything that could be read as harassment or intimidation

### 1.3 Delivery / Service Methods

There is no single mandated delivery method for a letter of demand in NSW. Valid methods include:

| Method | Pros | Cons | Best for |
|--------|------|------|----------|
| **Registered post** (with signed proof of delivery) | Creates irrefutable proof of delivery; formal | Slower (2–5 business days); costs ~$10–15 | High-value disputes; where you expect litigation |
| **Email** (with read receipt, letter attached as signed PDF) | Fast; free; creates paper trail | Harder to prove receipt if disputed | Most disputes; where email is an established channel |
| **Express post with tracking** | Fast + trackable | Slightly less formal than registered | When speed matters |
| **Courier with delivery confirmation** | Fast + formal + proof | Expensive ($20–50+) | Large debts; uncertain recipient address |
| **Personal service** (delivered by hand) | Undeniable proof | Confrontational; impractical for many | Where you expect the recipient to deny receipt |

**Critical rule:** If the underlying contract has a "notices" clause specifying how notices must be served (e.g. "all notices to be sent to the registered office by post"), you should follow that method. Petty Lawsuits should prompt users to check their contract for a notices clause.

**For our product:** We should offer to generate the letter as a downloadable PDF, and provide clear instructions on how to send it via each method. We could explore a "send it for you" premium feature using registered post (Australia Post API) or email delivery with tracking.

### 1.4 The Escalation Path

Here's the full lifecycle of a dispute in NSW, from incident to enforcement:

```
INCIDENT
  │
  ▼
ATTEMPT INFORMAL RESOLUTION (phone call, email)
  │
  ▼
LETTER OF DEMAND ← This is where Petty Lawsuits comes in
  │
  ├── Resolved → Done
  │
  ▼
CONSIDER MEDIATION (free via Community Justice Centres NSW)
  │
  ├── Resolved → Done
  │
  ▼
FILE FORMAL CLAIM
  │
  ├── NCAT (consumer claims up to $40K for goods/services; tenancy; home building)
  │    Filing fee: ~$53–$110 (concession ~$13–$28)
  │    Process: Lodge form → Directions hearing → Mediation/conciliation → Hearing → Orders
  │    Timeline: Typically 4–12 weeks from filing to hearing
  │    No costs jurisdiction (each side pays own costs)
  │
  ├── Local Court — Small Claims Division (up to $20,000)
  │    Filing fee: ~$103–$527 depending on amount
  │    Process: File Statement of Claim → Serve on defendant → 28 day response window
  │             → Pre-trial review → Hearing
  │    No costs jurisdiction
  │
  ├── Local Court — General Division ($20,001–$100,000)
  │    More formal; costs can be awarded
  │
  ▼
HEARING / DETERMINATION
  │
  ├── Orders made (payment, refund, rectification, etc.)
  │
  ▼
ENFORCEMENT (if other party doesn't comply)
  │
  ├── Garnishee order (seize wages/bank account)
  ├── Writ for levy of property
  ├── Examination notice (court orders them to disclose assets)
  └── Bankruptcy notice (last resort, debts over $10,000)
```

**Where Petty Lawsuits' scope ends:** We generate the letter of demand. We could potentially help users prepare NCAT application forms (Phase 2 research will determine if the field overlap is significant enough). We do NOT represent users, advise on merits, or file on their behalf.

### 1.5 Which Courts/Tribunals Handle What

| Body | Claim types | Monetary limit | Key features |
|------|-------------|----------------|-------------|
| **NCAT — Consumer & Commercial Division** | Defective goods/services, consumer guarantees (ACL), motor vehicles, home building, strata | Up to $40K (consumer); up to $500K (home building) | Informal; no costs; self-representation expected; 82.5% of applications lodged online |
| **NCAT — Tenancy** | Bond disputes, repairs, rent arrears, termination | N/A (tenancy-specific) | Very high volume; landlords and tenants |
| **Local Court — Small Claims** | Debts, unpaid invoices, contract disputes, property damage | Up to $20,000 | No costs jurisdiction; rules of evidence relaxed |
| **Local Court — General** | Same as above, larger amounts | $20,001–$100,000 | More formal; costs can be awarded |

### 1.6 Statute of Limitations

This is critical — we need to warn users if their claim may be time-barred.

| Claim type | Time limit | Starts from |
|------------|-----------|-------------|
| **Simple contract** (e.g. unpaid invoice) | **6 years** | Date the debt became due |
| **Deed** (formal contract under seal) | **12 years** | Date of breach |
| **Consumer guarantee (ACL)** | **6 years** | Date of the breach (defect discovered) |
| **NCAT consumer claim** | **3 years** (to apply to NCAT) | When the cause of action accrued; goods/services must have been supplied within 10 years |
| **Personal injury** | **3 years** | Date of injury or discovery |
| **Secured debt (mortgage)** | **12 years** | Date debt first became due |

**NSW-specific quirk:** Unlike every other Australian state, in NSW the expiry of the limitation period actually **extinguishes the debt** — it doesn't just bar court action. The debt ceases to exist. This is a significant piece of information for users.

**Clock restarts if:** The debtor makes a written acknowledgement of the debt (signed) or makes a payment towards it.

### 1.7 Highest-Volume Claim Types (Product Priority)

While exact NCAT case volume statistics weren't available from search results (they're in the annual report PDF which was inaccessible), based on the structure of NCAT's divisions and multiple legal sources, the highest-volume dispute types in NSW are:

1. **Tenancy disputes** (bond, repairs, rent arrears, termination) — by far the highest volume at NCAT
2. **Consumer claims — goods and services** (defective products, poor workmanship, refunds, warranties)
3. **Motor vehicle disputes** (NCAT has a dedicated motor vehicle form)
4. **Home building disputes** (defective work, incomplete builds, payment disputes)
5. **Unpaid invoices / debt recovery** (Local Court small claims)
6. **Neighbourhood disputes** (fencing, trees, noise — some go to NCAT, some to Local Court)

**For Petty Lawsuits v1:** Letters of demand for unpaid debts, defective goods/services, and bond disputes are likely our highest-value initial categories. Tenancy bond disputes may be slightly different (they go through NSW Fair Trading first), so we should research that specific workflow in Phase 2.

### 1.8 Key Australian Consumer Law References

When generating letters about defective goods or services, we should reference the correct statutory provisions:

- **Section 54 ACL** — Guarantee as to acceptable quality (goods must be fit for purpose, safe, durable, free from defects)
- **Section 55 ACL** — Guarantee as to fitness for disclosed purpose
- **Section 56 ACL** — Guarantee that goods correspond with description
- **Section 57 ACL** — Guarantee that goods match sample
- **Section 60 ACL** — Guarantee as to fitness for purpose (services)
- **Section 61 ACL** — Guarantee that services will be rendered with due care and skill
- **Section 62 ACL** — Guarantee as to reasonable time for supply of services

These are automatic guarantees — they can't be contracted out of, and they apply to every consumer transaction.

### 1.9 Implications for Petty Lawsuits

| Finding | Product implication |
|---------|-------------------|
| No mandatory letter template in NSW | We have freedom in format/design — but should follow best practice structure |
| Courts expect prior resolution attempts | Our letter is the critical "proof you tried" step — we should frame it this way |
| Multiple delivery methods valid | Offer PDF download + send-for-you premium feature |
| NCAT form fields overlap with letter data | Pre-fill opportunity if user escalates (Phase 2 will confirm) |
| 6-year general limitation + NSW extinction rule | Build a limitation checker into the wizard ("When did this happen?") |
| ACL sections are standardised | We can auto-insert the correct statutory references based on claim type |
| Self-representation is the norm at NCAT | Our users are exactly the NCAT demographic — position as "step 1 before NCAT" |

---

*Phase 1 complete.*

---

## Phase 2: Information We Need to Collect

### 2.1 Master Field List for the Wizard

Based on cross-referencing letter of demand best practice, NCAT consumer claim application forms, NCAT tenancy forms, and Local Court Statement of Claim forms, here is the complete data model our wizard needs to capture. Fields are grouped by wizard step (matching our existing 4-step flow: Defendant → Claimant → Incident → Evidence).

#### Step 1: Who Are You Claiming Against? (Defendant / Respondent)

| Field | Required? | Notes |
|-------|-----------|-------|
| **Entity type** | Yes | Individual / Sole trader / Company / Partnership / Government body |
| **Full legal name** | Yes | For companies: registered company name (not just trading name). For individuals: full name |
| **Trading name** (if different) | If applicable | "Trading as [X]" — common for sole traders |
| **ABN** | Recommended | We should offer an ABN Lookup integration (free API from ABR) to auto-fill company details |
| **ACN** | If company | 9-digit ASIC company number — can be derived from ABN Lookup |
| **Street address** | Yes | For companies: registered office address. For individuals: last known address |
| **Suburb** | Yes | |
| **State / Territory** | Yes | NSW, VIC, QLD, etc. |
| **Postcode** | Yes | |
| **Email address** | Recommended | For service of the letter by email |
| **Phone number** | Optional | |
| **Relationship to you** | Yes | Seller / Landlord / Employer / Contractor / Neighbour / Other (free text) |

**ABN Lookup integration opportunity:** The Australian Business Register provides a free web services API. We can let users type a business name or ABN and auto-populate: legal name, ABN, ACN, GST registration status, registered address, and business type. This massively reduces friction and ensures accuracy. Registration is free — you just need an authentication GUID.

#### Step 2: Your Details (Claimant / Applicant)

| Field | Required? | Notes |
|-------|-----------|-------|
| **Entity type** | Yes | Individual / Sole trader / Company |
| **Full legal name** | Yes | |
| **Trading name** (if different) | If applicable | |
| **ABN** | If business | |
| **Street address** | Yes | Return address for the letter; address for service if matter escalates |
| **Suburb** | Yes | |
| **State / Territory** | Yes | Used for jurisdiction inference |
| **Postcode** | Yes | |
| **Email address** | Yes | Account email or separate correspondence email |
| **Phone number** | Recommended | Contact for the other party to respond |
| **Preferred contact method** | Optional | Email / Phone / Post — included in the letter |

#### Step 3: What Happened? (The Incident / Dispute)

This is the most complex step. The fields here vary by **claim category**. We need a category selector at the top that conditionally shows relevant fields.

**Universal fields (all categories):**

| Field | Required? | Notes |
|-------|-----------|-------|
| **Claim category** | Yes | Unpaid debt/invoice / Defective goods / Defective services / Bond dispute / Property damage / Neighbourhood dispute / Other |
| **Date(s) of incident** | Yes | When the issue occurred or when payment was due |
| **Location of incident** | Yes | Street address + suburb + state. Used for: jurisdiction inference, NCAT form pre-fill, correct tribunal determination |
| **Amount claimed** | Yes | Total dollar amount. Must be specific |
| **Amount breakdown** | Recommended | Line items (e.g. invoice amount, GST, interest, consequential loss). Free-text or structured |
| **Description of what happened** | Yes | Free-text narrative. This is where the AI enhancement (live narrative polish with 1s debounce) adds the most value |
| **What resolution do you want?** | Yes | Payment of $X / Refund / Repair / Replacement / Compensation / Other. Maps to "orders sought" on NCAT form |
| **Response deadline** | Yes (with default) | Default: 14 days. User can adjust. We auto-calculate the calendar date |
| **Have you already tried to resolve this?** | Recommended | Yes/No + free text. Strengthens the letter and is expected by courts |
| **Contract/agreement exists?** | Recommended | Yes/No. If yes: does it have a notices clause? (affects delivery method advice) |

**Category-specific fields:**

**Unpaid debt / invoice:**

| Field | Required? | Notes |
|-------|-----------|-------|
| Invoice number(s) | Recommended | |
| Original due date | Yes | When was payment due? |
| Amount originally invoiced | Yes | |
| Partial payments received | If applicable | |
| Interest clause in contract? | Optional | If yes, we can calculate interest owing |
| Payment method for resolution | Recommended | Bank details, PayID, etc. — included in the letter |

**Defective goods (ACL claim):**

| Field | Required? | Notes |
|-------|-----------|-------|
| What was purchased? | Yes | Description of goods |
| Date of purchase | Yes | |
| Purchase price | Yes | |
| Where purchased? | Yes | Store name + address (maps to NCAT "address where goods were paid for") |
| Nature of the defect | Yes | Free text, AI-enhanced |
| Is the failure major or minor? | Guided | We walk the user through the major/minor test (see 2.2 below) |
| Remedy sought | Yes | Refund / Replacement / Repair / Compensation for drop in value |
| Have you contacted the seller? | Recommended | Date + outcome |

**Defective services / poor workmanship:**

| Field | Required? | Notes |
|-------|-----------|-------|
| What services were provided? | Yes | Description |
| Date services were performed | Yes | |
| Amount paid | Yes | |
| What went wrong? | Yes | Free text, AI-enhanced |
| Licence number of tradesperson | Recommended | For building/trade work — can be verified via NSW Fair Trading |
| Contract or quote reference | Recommended | |
| Remedy sought | Yes | Redo the work / Refund / Compensation |

**Bond dispute (tenancy):**

| Field | Required? | Notes |
|-------|-----------|-------|
| Property address | Yes | Rental property address |
| Tenancy start date | Yes | |
| Tenancy end date | Yes | |
| Bond amount paid | Yes | |
| Bond lodged with Fair Trading? | Yes | Should be — required by law |
| Amount of bond in dispute | Yes | |
| Reason for dispute | Yes | Cleaning / Damage / Unpaid rent / Other |
| Condition report at start? | Recommended | Critical evidence |
| Has a bond claim been lodged via Rental Bonds Online? | Yes | This is a prerequisite before NCAT |

#### Step 4: Supporting Evidence

| Evidence type | Prompted for (category) | Format |
|---------------|------------------------|--------|
| **Invoices / receipts** | All | PDF, image |
| **Contract / agreement** | All | PDF, image, Word doc |
| **Photos of damage / defect** | Defective goods, services, bond | Image |
| **Text messages / emails** | All | Screenshot, PDF |
| **Condition report** | Bond dispute | PDF, image |
| **Quotes for repair** | Defective services, property damage | PDF, image |
| **Bank statements** | Unpaid debt, bond | PDF |
| **Expert reports** | Defective services, building | PDF |
| **Delivery records** | Defective goods | PDF, image |
| **Diary entries / timeline** | All | Free text |

For each category, we should show a **checklist of recommended evidence** specific to that claim type, with upload prompts. This was confirmed in the UX memory from the reference screenshots.

### 2.2 Major vs Minor Failure Decision Tree

For ACL claims about defective goods, the remedy depends on whether the failure is "major" or "minor." We should walk users through this with a guided questionnaire:

```
Is the failure MAJOR?
  A major failure exists if ANY of these are true:
  ├── You wouldn't have bought it if you'd known about the problem
  ├── It's significantly different from its description / sample / demo
  ├── It's substantially unfit for its common purpose AND can't easily be fixed
  ├── It's unsafe
  └── You told the seller you needed it for a specific purpose, and it can't do that

  If MAJOR → Consumer chooses: full refund OR replacement
              (or keep it + compensation for drop in value)
              + compensation for reasonably foreseeable losses

  If MINOR → Seller gets to choose: repair, replacement, or refund
             Seller must fix within a reasonable time
             If they can't/won't → escalates to major failure rights
```

This decision tree should be built into the wizard as a guided flow. The outcome determines:
1. What remedy we write into the letter
2. Which ACL sections we reference
3. The tone and legal strength of the letter

### 2.3 Cross-Reference: Our Fields vs NCAT Consumer Claim Form

The NCAT Consumer Claim Application form requires:

| NCAT field | Our wizard field | Pre-fillable? |
|------------|-----------------|---------------|
| Applicant type (individual/company/etc.) | Step 2: Entity type | Yes |
| Applicant name + contact details | Step 2: Full details | Yes |
| Respondent type | Step 1: Entity type | Yes |
| Respondent name + address for service | Step 1: Full details | Yes |
| Address where goods paid for / services provided | Step 3: Location of incident | Yes |
| Orders sought | Step 3: Resolution wanted | Yes (needs reformatting to NCAT language) |
| Facts giving rise to the claim | Step 3: Description + AI narrative | Yes (needs reformatting) |
| Aboriginal or Torres Strait Islander status | Not collected | Need to add (optional, for NCAT only) |
| Interpreter needs | Not collected | Need to add (optional, for NCAT only) |
| Disability support needs | Not collected | Need to add (optional, for NCAT only) |

**Key finding:** ~80% of the NCAT form can be pre-filled from our wizard data. The remaining fields are NCAT-specific (cultural identity, accessibility needs) and can be collected in a short "escalation" step if the user decides to file with NCAT.

### 2.4 Cross-Reference: Our Fields vs Local Court Statement of Claim

The NSW Local Court Statement of Claim (Form 3A) requires:

| Court field | Our wizard field | Pre-fillable? |
|-------------|-----------------|---------------|
| Plaintiff name + address | Step 2: Full details | Yes |
| Defendant name + address | Step 1: Full details | Yes |
| Type of claim (from UCPR list) | Step 3: Claim category | Needs mapping to court categories |
| Particulars of the claim | Step 3: Description + amount + dates | Yes (needs legal reformatting) |
| Amount claimed | Step 3: Amount claimed | Yes |
| Court filing fee | Not collected | Auto-calculated based on amount |

**Key finding:** The Statement of Claim requires more legal formality in how the "particulars" are written. If we offer a "prepare your court filing" feature, we'd need to reformat the AI narrative into proper court pleading language. This is a Phase 3+ feature.

### 2.5 Statutory References to Auto-Insert

Based on claim category, we should automatically reference the correct legislation in the letter:

| Category | Statutory references |
|----------|---------------------|
| **Defective goods** | Australian Consumer Law (Schedule 2, Competition and Consumer Act 2010), ss 54–57 (goods guarantees) |
| **Defective services** | ACL ss 60–62 (services guarantees) |
| **Misleading conduct** | ACL s 18 (misleading or deceptive conduct) |
| **Unpaid debt (contract)** | Reference the specific contract/agreement; no specific statute needed unless interest is claimed |
| **Bond dispute** | Residential Tenancies Act 2010 (NSW), relevant section for bond return |
| **Building defects** | Home Building Act 1989 (NSW), statutory warranty periods (6 years major, 2 years other) |
| **Property damage** | Common law negligence; Civil Liability Act 2002 (NSW) |

The AI should insert these references naturally into the letter, not as a raw citation dump. Example: "Under the consumer guarantees provided by the Australian Consumer Law, goods supplied to consumers must be of acceptable quality (section 54), fit for their disclosed purpose (section 55), and match their description (section 56)."

### 2.6 ABN Lookup Integration Spec

The Australian Business Register (ABR) provides a **free web services API**:

- **Endpoint:** `https://abr.business.gov.au/abrxmlsearch/`
- **Authentication:** Free GUID (register at abr.business.gov.au)
- **Methods available:** Search by ABN, search by name, search by ACN
- **Returns:** Legal name, trading name(s), ABN, ACN, entity type, GST registration, state, postcode, active/cancelled status
- **Format:** XML (with limited JSON support for ABN and name search)

**Product integration:** In Step 1 (Defendant details), we add a "Look up business" field. User types a business name or ABN → we hit the ABR API → auto-fill legal name, ABN, ACN, entity type, and registered state. This reduces form friction significantly and ensures the letter targets the correct legal entity (a common mistake in self-prepared letters).

### 2.7 Limitation Period Checker

Based on Phase 1 findings, we should build a limitation period check into Step 3:

```
When the user enters "Date of incident" or "Date payment was due":
  → Calculate years elapsed
  → If > 5 years: Show amber warning
     "Your claim may be approaching the limitation period.
      In NSW, most contract debts expire after 6 years.
      Consider acting soon."
  → If ≥ 6 years: Show red warning
     "In NSW, debts arising from a simple contract are extinguished
      after 6 years. If more than 6 years have passed since the debt
      became due (and the debtor hasn't acknowledged it in writing),
      you may no longer have a legal right to claim.
      Consider getting legal advice before proceeding."
  → Adjust threshold based on claim type (3 years for NCAT consumer claims,
    12 years for deeds, etc.)
```

### 2.8 Product Implications

| Finding | Product implication |
|---------|-------------------|
| ~80% of NCAT form pre-fillable from our data | Offer "Prepare your NCAT application" as an upsell / premium feature |
| ABN Lookup API is free | Integrate into Step 1 for business defendant lookup — major UX differentiator |
| Evidence requirements vary by claim type | Show category-specific evidence checklists (already in UX plan) |
| Major/minor failure distinction drives remedy | Build guided decision tree into defective goods flow |
| Statutory references are predictable per category | Auto-insert correct ACL/legislation references — saves users from legal research |
| Limitation periods vary by claim type | Build smart warning system into date fields |
| Bond disputes have a specific prerequisite (Rental Bonds Online claim) | Add gateway check: "Have you lodged a bond claim via Rental Bonds Online?" |
| Building work has specific warranty periods (6yr/2yr) | Factor into limitation checker for building category |

---

*Phase 2 complete.*

---

## Phase 3: Licensing Boundaries (What We Can & Can't Do)

### 3.1 The Legal Framework

The governing legislation is the **Legal Profession Uniform Law (NSW)**, specifically:

- **Section 10** — Prohibition on engaging in legal practice by unqualified entities. Penalty: 250 penalty units (~$27,500) or 2 years imprisonment, or both.
- **Section 11** — Prohibition on representing that an unqualified entity is entitled to engage in legal practice.
- **Section 6** — Definitions: "engage in legal practice" includes "practise law" or "provide legal services." "Legal services" means work done, or business transacted, in the ordinary course of legal practice.

There is no statutory definition of "legal practice" itself — the boundaries are defined by case law.

### 3.2 The Key Test: Cornall v Nagle

The foundational test comes from *Cornall v Nagle* [1995] 2 VR 188 (Supreme Court of Victoria, widely applied across Australia):

> Legal practice is "doing something which, in order that the public might be adequately protected, is required to be done only by those who have the necessary training and expertise in the law."

The court further held that "the giving of legal advice, at least as part of a course of conduct and for reward, can properly be said to lie at or near the very centre of the practice of the law."

### 3.3 The Critical Distinction: Where the Line Falls

Based on the case law, Law Society guidance, and academic analysis, the distinction breaks down as follows:

#### NOT legal practice (we CAN do this):

| Activity | Why it's permitted |
|----------|-------------------|
| **Providing general legal information** | Explaining what the law says in general terms (e.g. "Under the ACL, goods must be of acceptable quality") is information, not advice |
| **Providing template documents** | Selling or providing blank/standard-form templates for users to fill in themselves |
| **Clerical document preparation** | "Filling blanks in a printed form or preparing documents of a general type without determining the legal effect of facts" (Law Society guidance) |
| **Collecting facts via structured forms** | Asking users to input their own information through a wizard — we're not analysing the legal significance of those facts |
| **Auto-inserting statutory references based on category** | If the user selects "defective goods," we reference ACL s54–57. This is mechanical categorisation, not legal analysis |
| **Calculating deadlines and limitation periods** | Mathematical/date calculations based on user inputs — this is information, not advice |
| **Providing information about processes** | Explaining how NCAT works, what the filing process is, what evidence helps — this is general information |

#### IS legal practice (we MUST NOT do this):

| Activity | Why it crosses the line |
|----------|----------------------|
| **Advising on the merits of a claim** | "You have a strong case" or "You should sue" = legal advice about a specific situation |
| **Recommending a legal strategy** | "You should file with NCAT rather than Local Court" = legal advice |
| **Tailoring documents based on legal analysis of facts** | If we analyse a user's specific facts to determine which legal provisions apply and craft arguments — that's legal practice |
| **Guaranteeing outcomes** | "This letter will get your money back" = representing legal expertise |
| **Representing the user** | Filing on their behalf, corresponding with the other party as their representative |
| **Drafting court submissions** | Preparing pleadings, affidavits, or legal arguments for court/tribunal proceedings |
| **Advising on quantum of damages** | "You should claim $X for pain and suffering" = legal advice |
| **Interpreting contracts** | "Based on clause 7 of your contract, you're entitled to..." = legal analysis |

### 3.4 Where Our AI Wizard Sits — The Grey Zone

This is the most important analysis for our product. Our wizard collects user-supplied facts and generates a letter of demand. The critical question: **does the AI's role in shaping the letter cross from "clerical preparation" into "legal practice"?**

**Arguments that we're in the safe zone:**

1. **User supplies all facts.** We don't investigate or verify — the user tells us what happened, who's involved, and what they want. We structure their inputs into a letter format.
2. **Category selection is user-driven.** The user chooses "defective goods" — we don't diagnose their legal situation. This is closer to selecting a template than receiving legal advice.
3. **Statutory references are mechanical.** If category = defective goods → insert ACL s54. No legal judgment required — it's a lookup table.
4. **We don't advise on merits.** We never say "you have a good case" or "you should proceed."
5. **The letter template structure is standardised.** Every letter of demand follows the same basic structure. We're formatting, not strategising.

**Arguments that we might be approaching the line:**

1. **AI narrative enhancement.** If the AI rewrites the user's description to make it more "legally effective" — e.g., restructuring their story to emphasise legally relevant facts — this could be seen as applying legal judgment to shape a document.
2. **Major/minor failure determination.** Walking users through whether their issue is a "major" or "minor" failure is arguably providing guidance that informs their legal rights. However, this is arguably just presenting the statutory test (information) and letting the user decide.
3. **Remedy suggestion.** If the wizard suggests "based on your answers, you may be entitled to a full refund" — that's getting close to legal advice.

**Our approach (recommended):**

Stay firmly in the "information + structured collection + template generation" zone:

- The AI enhances **writing quality** (grammar, clarity, tone) but does NOT add legal arguments or reframe facts for legal effect
- The major/minor failure flow presents the **statutory test questions** and lets the **user** determine which applies — we don't make the determination
- For remedies, we present **all available options** with general information about when each applies, and the **user selects** their preferred remedy
- Every generated document includes a clear disclaimer (see 3.6)
- We never use language like "we recommend," "you should," "your claim is strong/weak"

### 3.5 How Competitors Position Themselves

| Platform | Model | Disclaimer approach |
|----------|-------|-------------------|
| **Lawpath** | Operates with an incorporated legal practice (Lawpath Legal) for lawyer services, but the platform itself disclaims: "Lawpath is not a law firm, is not engaging in legal practice and does not offer any legal services." Templates and documents are "general in nature." Users can separately engage actual lawyers through the platform. |
| **LegalVision** | Operates as an actual law firm (incorporated legal practice). Lawyers review and draft documents. Subscription model. This is a fundamentally different model — they ARE engaging in legal practice, with qualified practitioners. |
| **LawDepot / Genie AI** | Template-only services. User fills in blanks. Disclaimers state templates are "general in nature" and "do not constitute legal advice." No legal analysis applied. |
| **NSW Legal Aid templates** | Government-provided free templates. General information only. No personalisation. |
| **Cleardocs** | Backed by a law firm (Maddocks). Documents generated through structured Q&A. Positioned as document generation, with lawyer review available. |

**Key insight:** Lawpath's dual structure is the most instructive for us. The platform itself is NOT a law firm and does NOT provide legal services — it provides templates, information, and a marketplace to connect users with actual lawyers. The document generation is explicitly disclaimed as not being legal advice. This is the model we should follow.

### 3.6 Required Disclaimers

Based on competitor analysis and legal requirements, we need disclaimers in at least four places:

**1. Website footer / Terms of Service:**
> Petty Lawsuits is not a law firm and does not provide legal advice or legal services. The information and documents generated through this platform are general in nature and are provided for informational purposes only. They do not constitute legal advice, and no solicitor-client relationship is created by using this service. You should obtain independent legal advice before making any decisions about your legal rights or obligations.

**2. Every generated document (footer or cover page):**
> This document was generated using Petty Lawsuits (pettylawsuits.com.au) based on information provided by the user. It does not constitute legal advice. The recipient should seek independent legal advice if they are uncertain about their legal rights or obligations.

**3. Wizard flow (before generation):**
> Important: Petty Lawsuits helps you create documents based on the information you provide. We do not review your situation, assess the strength of your claim, or provide legal advice. If you're unsure about your legal rights, consider consulting a lawyer. You can find free or low-cost legal help through [NSW Legal Aid / Law Access NSW / Justice Connect].

**4. In-app prompts at key decision points:**
> Where the user is making choices that have legal significance (e.g., choosing a remedy, deciding whether the failure is "major"), we should display a brief note: "This information is provided to help you understand your options. It is not legal advice. If you're unsure which option applies to your situation, consider seeking legal advice."

### 3.7 Things We Must NEVER Do

This is the hard "no" list — non-negotiable compliance boundaries:

1. **Never advise on the merits of a claim.** No "you have a strong case," no "this is unlikely to succeed," no assessment of whether the user should proceed.
2. **Never recommend a legal strategy.** No "you should file with NCAT," no "consider mediation first," no "you might want to include X claim."
3. **Never guarantee outcomes.** No "this letter will get your money back," no success rates, no implied guarantees.
4. **Never represent the user.** We don't send letters on behalf of the user as their representative. If we offer a "send it for you" service, it must be purely a delivery/postal service — we're a mail carrier, not a representative.
5. **Never draft court submissions.** Statements of claim, affidavits, and NCAT applications are court documents. Generating these (as opposed to helping users understand what fields to fill in) likely crosses the line. The NCAT pre-fill feature should populate fields, not draft legal arguments.
6. **Never interpret contracts.** We can ask users "do you have a contract?" but we can't read it and tell them what it means.
7. **Never hold ourselves out as lawyers.** No "our legal team," no "our experts," no language implying legal qualifications.
8. **Never use the word "advice" in relation to what we provide.** Always "information," "guidance," or "tools."

### 3.8 Things We CAN Do (The Green Zone)

1. **Provide general legal information.** Explain what the ACL says, what NCAT does, what a letter of demand is, what the limitation periods are.
2. **Collect user-supplied facts through structured forms.** This is the core of the wizard.
3. **Generate documents from templates populated with user facts.** The letter is a templated structure filled with the user's inputs.
4. **Improve writing quality.** The AI can fix grammar, improve clarity, and ensure a professional tone — as long as it's not reframing facts for legal advantage.
5. **Auto-insert correct statutory references.** Based on the user's selected category, insert the relevant legislation. This is a lookup, not analysis.
6. **Calculate deadlines and limitation periods.** Date math based on user inputs.
7. **Provide checklists and process guides.** "Here's what evidence helps in this type of claim" is information, not advice.
8. **Offer a postal delivery service.** Physically sending the user's letter by registered post is a delivery service, not a legal service.
9. **Link users to free legal resources.** NSW Legal Aid, Law Access NSW, Community Legal Centres, Justice Connect.
10. **Show NCAT/court form field mappings.** "Here are the fields on the NCAT form and what your wizard answers map to" is information.

### 3.9 The "Send It For You" Feature — Compliance Analysis

If we offer a premium feature to physically send the letter by registered post on behalf of the user:

- **This is a postal/delivery service, not a legal service.** We're acting as a mail carrier. The user authors the letter; we post it.
- **The letter should come FROM the user, not from Petty Lawsuits.** The sender details on the letter are the user's name and address. We're just the mechanism of delivery.
- **We should NOT include any Petty Lawsuits branding on the actual letter.** The letter should look like it came directly from the user. Our branding on the letter could imply we're acting as the user's representative.
- **We CAN include a tracking confirmation/receipt to the user.** "Your letter was sent by registered post on [date] to [address]. Tracking number: [X]."

### 3.10 AI Enhancement Guardrails

For the AI narrative enhancement feature (Step 3 of wizard), we need specific guardrails:

**The AI SHOULD:**
- Fix grammar and spelling
- Improve sentence structure and clarity
- Ensure professional, neutral tone
- Remove emotional language or accusations
- Ensure the description is factual and chronological
- Add time connectors ("On [date]...", "Subsequently...", "Despite this...")

**The AI SHOULD NOT:**
- Add legal arguments not present in the user's original description
- Reframe facts to emphasise legal elements the user didn't mention
- Insert legal conclusions ("This constitutes a breach of...")
- Add claims the user didn't make
- Suggest additional causes of action
- Use overly legalistic language that implies lawyer involvement
- Characterise the severity of the issue ("This is a serious breach...")

### 3.11 Risk Assessment

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| Regulator determines our AI constitutes legal practice | Low–Medium | High | Strong disclaimers, user-driven decisions, no merits assessment, no strategy advice |
| User relies on our output as legal advice and suffers loss | Medium | Medium | Disclaimers in every touchpoint, links to free legal help, no outcome guarantees |
| Competitor or lawyer complains to Law Society | Low | Medium | Clear positioning as information/template service, not law firm |
| User sends a letter that's factually wrong or legally baseless | Medium | Low (for us) | Disclaimer on every document; user is responsible for accuracy of their inputs |

The biggest risk is the AI narrative enhancement feature. If the AI is perceived as applying legal judgment to shape documents, that's the closest we get to the line. The guardrails in 3.10 are designed to keep us on the right side.

### 3.12 Recommended Legal Review

Before launch, we should get a short compliance opinion (1–2 hours of a tech/regulatory lawyer's time) confirming:

1. Our service model (structured form → template generation → user review → download) does not constitute engaging in legal practice under the LPUL
2. Our disclaimer language is sufficient
3. The AI enhancement feature, with the guardrails described, stays on the right side of the line
4. The "send it for you" feature is positioned correctly as a postal service

This should cost $500–$1,000 and would give us significant comfort. Worth doing before going live.

---

*Phase 3 complete. Phase 4 (Competitive Landscape & Positioning) begins next.*
