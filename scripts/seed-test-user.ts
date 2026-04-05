/**
 * Seed script: creates a test user with sample documents.
 *
 * Usage:  npx tsx --env-file=.env.local scripts/seed-test-user.ts
 *
 * Credentials after running:
 *   Email:    test@pettylawsuits.com
 *   Password: TestPass123!
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const TEST_EMAIL = 'test@pettylawsuits.com'
const TEST_PASSWORD = 'TestPass123!'

async function main() {
  console.log('Seeding test user...\n')

  // 1. Check if user already exists — delete and recreate for a clean slate
  const { data: existing } = await supabase.auth.admin.listUsers()
  const existingUser = existing?.users?.find(u => u.email === TEST_EMAIL)

  if (existingUser) {
    // Clean up old documents first
    await supabase.from('documents').delete().eq('user_id', existingUser.id)
    await supabase.from('generation_attempts').delete().eq('user_id', existingUser.id)
    await supabase.from('subscriptions').delete().eq('user_id', existingUser.id)
    await supabase.auth.admin.deleteUser(existingUser.id)
    console.log('Removed previous test user.')
  }

  // 2. Create user
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
  })

  if (createErr || !created.user) {
    console.error('Failed to create user:', createErr?.message)
    process.exit(1)
  }

  const userId = created.user.id
  console.log(`Created user: ${TEST_EMAIL} (${userId})`)

  // 3. Insert sample documents
  const now = new Date().toISOString()

  const sampleDocs = [
    {
      user_id: userId,
      state: 'NSW',
      category: 'Debt & Money',
      status: 'ready',
      unlocked: true,
      original_content: {
        creditor_name: 'Harry Whitehead',
        debtor_name: 'John Smith',
        amount_owed: '2,500.00',
        due_date: '2026-01-15',
        payment_deadline: '2026-04-30',
        payment_details: 'BSB: 062-000 Account: 1234 5678',
      },
      current_content: {
        creditor_name: 'Harry Whitehead',
        debtor_name: 'John Smith',
        amount_owed: '2,500.00',
        due_date: '2026-01-15',
        payment_deadline: '2026-04-30',
        payment_details: 'BSB: 062-000 Account: 1234 5678',
      },
      created_at: now,
      updated_at: now,
    },
    {
      user_id: userId,
      state: 'VIC',
      category: 'Consumer',
      status: 'ready',
      unlocked: false,
      original_content: {
        complainant_name: 'Harry Whitehead',
        business_name: 'Dodgy Electronics Pty Ltd',
        product_service: 'Samsung 65" OLED TV',
        purchase_date: '2026-02-10',
        amount_paid: '1,899.00',
        remedy_sought: 'Full refund',
      },
      current_content: {
        complainant_name: 'Harry Whitehead',
        business_name: 'Dodgy Electronics Pty Ltd',
        product_service: 'Samsung 65" OLED TV',
        purchase_date: '2026-02-10',
        amount_paid: '1,899.00',
        remedy_sought: 'Full refund',
      },
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      user_id: userId,
      state: 'QLD',
      category: 'Tenancy',
      status: 'ready',
      unlocked: true,
      original_content: {
        tenant_name: 'Harry Whitehead',
        landlord_name: 'Greedy Property Management',
        property_address: '42 Example Street, Brisbane QLD 4000',
        bond_amount: '2,400.00',
        disputed_amount: '800.00',
        vacated_date: '2026-03-01',
      },
      current_content: {
        tenant_name: 'Harry Whitehead',
        landlord_name: 'Greedy Property Management',
        property_address: '42 Example Street, Brisbane QLD 4000',
        bond_amount: '2,400.00',
        disputed_amount: '800.00',
        vacated_date: '2026-03-01',
      },
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  ]

  const { error: insertErr } = await supabase.from('documents').insert(sampleDocs)

  if (insertErr) {
    console.error('Failed to insert documents:', insertErr.message)
    process.exit(1)
  }

  console.log(`Inserted ${sampleDocs.length} sample documents.`)
  console.log('\n---')
  console.log(`Email:    ${TEST_EMAIL}`)
  console.log(`Password: ${TEST_PASSWORD}`)
  console.log('---\n')
  console.log('2 unlocked (Debt & Money, Tenancy) + 1 locked (Consumer)')
  console.log('Log in at /login and you\'ll land on /dashboard.')
}

main()
