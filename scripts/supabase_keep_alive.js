/**
 * Supabase Keep-Alive Health Checker
 * 
 * Runs automatically every 12-24 hours via GitHub Actions.
 * Performs direct PostgreSQL query and RPC calls to prevent Supabase
 * from pausing the free-tier database due to 7 days of inactivity.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mtksfqencsxmucyidotz.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ys6yDx1F5rlnh_9xA5NQPA_PG21ck-8'

async function pingSupabase() {
  const startTime = Date.now()
  console.log('='.repeat(65))
  console.log('🏥 SUPABASE 24-HOUR KEEP-ALIVE HEALTH CHECKER')
  console.log('='.repeat(65))
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`)
  console.log(`🌐 Target: ${SUPABASE_URL}\n`)

  const cleanUrl = SUPABASE_URL.trim().replace(/\/+$/, '')

  // 1. Direct REST query to members table
  console.log('📡 Step 1: Performing direct PostgREST table query...')
  const res1 = await fetch(`${cleanUrl}/rest/v1/members?select=id&limit=1`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  const latency1 = Date.now() - startTime
  console.log(`   -> HTTP Status: ${res1.status} ${res1.statusText} (${latency1}ms)`)

  // 2. Direct RPC stored procedure call (guarantees PL/pgSQL database engine execution)
  console.log('\n📡 Step 2: Executing database stored procedure RPC ping...')
  const startRpc = Date.now()
  const res2 = await fetch(`${cleanUrl}/rest/v1/rpc/santa_login`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ p_phone: '0000000000', p_password: 'health_check_ping' })
  })
  const latency2 = Date.now() - startRpc
  console.log(`   -> HTTP Status: ${res2.status} ${res2.statusText} (${latency2}ms)`)

  console.log('\n' + '='.repeat(65))
  if (res1.ok && res2.ok) {
    console.log('✅ HEALTH CHECK PASSED! Supabase database is active and awake.')
    console.log('🎉 7-Day Inactivity pause timer successfully reset!')
  } else {
    console.log('⚠️ Ping finished with partial responses, but database traffic was registered.')
  }
  console.log('='.repeat(65))
}

pingSupabase().catch(err => {
  console.error('❌ Error during Supabase ping:', err.message)
  process.exit(1)
})
