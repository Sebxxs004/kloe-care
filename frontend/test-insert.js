
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(url, key)

async function run() {
  try {
    const { data, error } = await supabase.from('todos').insert([{ name: 'test from script', done: false }])
    if (error) {
      console.error('Insert failed:', error)
      process.exit(1)
    }
    console.log('Insert succeeded:', data)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()
