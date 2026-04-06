import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const publicPages = [
  { name: 'Homepage', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Login', path: '/login' },
  { name: 'Signup', path: '/signup' },
]

for (const page of publicPages) {
  test(`${page.name} page has no critical accessibility violations`, async ({ page: pwPage }) => {
    await pwPage.goto(page.path)
    await pwPage.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page: pwPage })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const critical = results.violations.filter(v =>
      v.impact === 'critical' || v.impact === 'serious'
    )

    if (critical.length > 0) {
      const summary = critical.map(v =>
        `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instance${v.nodes.length > 1 ? 's' : ''})`
      ).join('\n')
      console.log(`Accessibility violations on ${page.name}:\n${summary}`)
    }

    expect(critical, `Critical/serious violations on ${page.name}`).toHaveLength(0)
  })
}

test('Wizard page has no critical accessibility violations', async ({ page }) => {
  await page.goto('/wizard')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const critical = results.violations.filter(v =>
    v.impact === 'critical' || v.impact === 'serious'
  )

  expect(critical, 'Critical/serious violations on Wizard').toHaveLength(0)
})
