const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(url, key)

const toSnake = (s) => s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())

async function detectAvailableColumns(table, cols) {
  const available = []
  for (const col of cols) {
    try {
      const { data, error } = await supabase.from(table).select(col).limit(1)
      if (!error) available.push(col)
    } catch (e) {
      // ignore
    }
  }
  return available
}

async function tryInsertVariants(table, basePayload) {
  const variants = []
  // original
  variants.push(basePayload)
  // snake_case keys
  const snake = {}
  for (const k of Object.keys(basePayload)) snake[toSnake(k)] = basePayload[k]
  variants.push(snake)
  // camelCase from snake
  const camel = {}
  for (const k of Object.keys(snake)) {
    const parts = k.split('_')
    const c = parts[0] + parts.slice(1).map(p => p[0].toUpperCase()+p.slice(1)).join('')
    camel[c] = snake[k]
  }
  variants.push(camel)

  for (const payload of variants) {
    try {
      const { data, error } = await supabase.from(table).insert([payload]).select()
      if (error) {
        // If unknown column or other, continue to next variant
        console.log(`[${table}] insert variant failed:`, error.message || error.code)
        continue
      }
      return { data, payload }
    } catch (e) {
      console.log(`[${table}] unexpected error:`, e.message)
    }
  }
  return { data: null }
}

async function tryUpdate(table, id, updatePayload) {
  const { data, error } = await supabase.from(table).update(updatePayload).eq('id', id).select()
  if (error) {
    console.log(`[${table}] update failed:`, error.message || error.code)
    return null
  }
  return data
}

async function run() {
  console.log('Starting Supabase CRUD flow...')

  // 1) Create user
  const userPayload = { full_name: 'Test User', email: `test+${Date.now()}@example.com`, password: 'secret', phone_number: '123456' }
  let r = await tryInsertVariants('users', userPayload)
  if (!r.data) {
    console.error('Failed to create user in `users` table. Aborting.')
    return
  }
  const user = r.data[0]
  console.log('User created:', user)

  // 2) Update user
  const updated = await tryUpdate('users', user.id, { full_name: `${user.full_name} (updated)` })
  console.log('User updated result:', updated)

  // 3) Create pet linked to user (alignado con supabase_schema.sql)
  // schema: pets(name, species, breed, weight, gender, birth_date, owner_id)
  const petBase = { name: 'Firulais', species: 'dog', breed: 'mongrel', weight: 12.5, gender: ['male'], birth_date: new Date().toISOString().slice(0,10) }
  petBase.__foreignId = user.id
  const petKeyCandidates = ['owner_id','ownerId','user_id','userId','owner']
  const petCols = await detectAvailableColumns('pets', ['id','name','species','breed','weight','owner_id','birth_date','gender','age','user_id'])
  console.log('Detected pet columns:', petCols)
  let petInsert = null
  // Prefer owner_id if present, otherwise try other candidates. If none exist, insert pet without owner linkage.
  let tried = false
  for (const k of petKeyCandidates) {
    if (!petCols.includes(k) && !petCols.includes(toSnake(k))) continue
    tried = true
    const payload = { ...petBase }
    payload[k] = payload.__foreignId
    delete payload.__foreignId
    const res = await tryInsertVariants('pets', payload)
    if (res.data) { petInsert = { data: res.data, usedKey: k }; break }
  }
  if (!tried) {
    // Insert pet without owner reference
    const payload = { ...petBase }
    delete payload.__foreignId
    const res = await tryInsertVariants('pets', payload)
    if (res.data) { petInsert = { data: res.data, usedKey: null } }
  }
  if (!petInsert) { console.error('Failed to create pet linked to user.'); return }
  const pet = petInsert.data[0]
  console.log('Pet created:', pet, 'usedKey:', petInsert.usedKey)

  // 4) Update pet name
  const petUpdated = await tryUpdate('pets', pet.id, { name: `${pet.name} Jr.` })
  console.log('Pet updated:', petUpdated)

  // Create wellness history for the pet if table exists
  let wellnessHistory = null
  try {
    const whRes = await tryInsertVariants('wellness_histories', { general_notes: 'Initial history from script', pet_id: pet.id })
    if (whRes.data) wellnessHistory = whRes.data[0]
    else {
      // try alternative table name
      const alt = await tryInsertVariants('wellness_histories', { generalNotes: 'Initial history from script', petId: pet.id })
      if (alt.data) wellnessHistory = alt.data[0]
    }
  } catch (e) {
    // ignore
  }
  if (wellnessHistory) console.log('Wellness history created:', wellnessHistory)

  // 5) Create health record (table 'healths' in schema)
  const healthBase = { temperature: 38.5, weight: 12.3, symptoms: ['none'], observations: 'Checked by script' }
  healthBase.__foreignId = pet.id
  const healthKeys = ['pet_id','petId','pet']
  let healthRes = null
  // Try to attach pet id if possible, otherwise insert standalone health record
  const healthTableCandidates = ['healths', 'health_records', 'health', 'health_record']
  for (const tableName of healthTableCandidates) {
    for (const k of healthKeys) {
      const payload = { ...healthBase }
      payload[k] = payload.__foreignId
      delete payload.__foreignId
      // attach wellness_history_id if available and table expects it
      if (wellnessHistory) payload.wellness_history_id = wellnessHistory.id
      const res = await tryInsertVariants(tableName, payload)
      if (res.data) { healthRes = res; break }
    }
    if (healthRes) break
    // try without pet linkage in this table
    const basePayload = { temperature: healthBase.temperature, weight: healthBase.weight, symptoms: healthBase.symptoms, observations: healthBase.observations }
    if (wellnessHistory) basePayload.wellness_history_id = wellnessHistory.id
    const res = await tryInsertVariants(tableName, basePayload)
    if (res.data) { healthRes = res; break }
  }
  if (!healthRes) { console.error('Failed to create health record.'); } else { console.log('Health record created:', healthRes.data[0]) }

  // 6) Create feeding record (table 'feedings' in schema)
  const feedingBase = { food_type: ['kibble'], food_brand: 'Acme', amount: 200, schedule: '08:00', frequency: 1, observations: 'none' }
  feedingBase.__foreignId = pet.id
  const feedingKeys = ['pet_id','petId','pet']
  let feedingRes = null
  const feedingTableCandidates = ['feedings', 'feeding_records', 'feeding', 'feeding_record']
  for (const tableName of feedingTableCandidates) {
    for (const k of feedingKeys) {
      const payload = { ...feedingBase }
      payload[k] = payload.__foreignId
      delete payload.__foreignId
      if (wellnessHistory) payload.wellness_history_id = wellnessHistory.id
      const res = await tryInsertVariants(tableName, payload)
      if (res.data) { feedingRes = res; break }
    }
    if (feedingRes) break
    const basePayload = { food_type: feedingBase.food_type, food_brand: feedingBase.food_brand, amount: feedingBase.amount, schedule: feedingBase.schedule, frequency: feedingBase.frequency, observations: feedingBase.observations }
    if (wellnessHistory) basePayload.wellness_history_id = wellnessHistory.id
    const res = await tryInsertVariants(tableName, basePayload)
    if (res.data) { feedingRes = res; break }
  }
  if (!feedingRes) { console.error('Failed to create feeding record.'); } else { console.log('Feeding record created:', feedingRes.data[0]) }

  console.log('Flow finished.')
}

run()
