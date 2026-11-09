/**
 * Monday Automated Reminder Script for Secret Santa 2026
 * 
 * Schedule: Runs every Monday at 2:00 PM IST (08:30 UTC)
 * Target Date: Christmas Gift Reveal (Dec 25, 2026)
 * 
 * Modes:
 * 1. Direct Clickable WhatsApp Links (default, 100% free, no setup required)
 * 2. Automated Gateway Dispatch (when ULTRAMSG_INSTANCE_ID / ULTRAMSG_TOKEN or GREEN_API keys are set)
 */

const MEMBERS = [
  { name: 'Aadhi', phone: '9361386647' },
  { name: 'Sreedharan Kandavel', phone: '6383659695' },
  { name: 'Brinda', phone: '9344858175' },
  { name: 'Sathya', phone: '9080636525' },
  { name: 'Shruthi', phone: '7010151872' },
  { name: 'Swarna Akshita', phone: '7812854115' },
  { name: 'Sailoga Prakash', phone: '6382896498' },
  { name: 'Aadhu', phone: '6383335626' },
  { name: 'Sarath Vikram', phone: '7010043287' },
  { name: 'Srenithi', phone: '9080369229' },
  { name: 'Sakthi', phone: '9344626769' },
]

function getCountdownDays() {
  const now = new Date()
  // Countdown to Christmas Reveal Day (Dec 25, 2026)
  const target = new Date(now.getFullYear(), 11, 25, 0, 0, 0)
  if (now > target) target.setFullYear(now.getFullYear() + 1)
  const diffTime = target - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function generateReminderMessage(member, daysLeft) {
  // Never mentions the assigned match to protect secrecy from lockscreen notification peeking
  return `Hey ${member.name}! Don't forget to prepare for the gift just ${daysLeft} days more you know someone betrayed someone else in the past so make sure you don't repeat same as them :)\n\nPortal: https://family-memories-inky.vercel.app/`
}

async function sendViaUltraMsg(phone, message) {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID
  const token = process.env.ULTRAMSG_TOKEN
  if (!instanceId || !token) return false

  const params = new URLSearchParams()
  params.append('token', token)
  params.append('to', `+91${phone}`)
  params.append('body', message)

  const res = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  })
  const json = await res.json()
  return json.sent === 'true' || json.status === 'ok'
}

async function sendViaGreenApi(phone, message) {
  const instanceId = process.env.GREEN_API_INSTANCE_ID
  const token = process.env.GREEN_API_TOKEN
  if (!instanceId || !token) return false

  const res = await fetch(`https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatId: `91${phone}@c.us`,
      message: message
    })
  })
  const json = await res.json()
  return !!json.idMessage
}

async function run() {
  console.log('='.repeat(70))
  console.log('🎄 SECRET SANTA MONDAY 2:00 PM AUTOMATED REMINDER 🎄')
  console.log('='.repeat(70))

  const days = getCountdownDays()
  console.log(`\n📅 Days remaining until Christmas Gift Handover: ${days} days\n`)

  const hasGreenApi = !!(process.env.GREEN_API_INSTANCE_ID && process.env.GREEN_API_TOKEN)
  const hasUltraMsg = !!(process.env.ULTRAMSG_INSTANCE_ID && process.env.ULTRAMSG_TOKEN)
  const hasApi = hasGreenApi || hasUltraMsg

  if (hasGreenApi) {
    console.log('🚀 Green-API Cloud WhatsApp detected! Dispatching messages...')
  } else if (hasUltraMsg) {
    console.log('🚀 UltraMsg Cloud WhatsApp detected! Dispatching messages...')
  } else {
    console.log('ℹ️  No WhatsApp API gateway keys configured. Generating direct 1-click WhatsApp links:\n')
  }

  for (let i = 0; i < MEMBERS.length; i++) {
    const m = MEMBERS[i]
    const msg = generateReminderMessage(m, days)

    if (hasApi) {
      try {
        let sent = false
        if (hasGreenApi) {
          sent = await sendViaGreenApi(m.phone, msg)
        } else if (hasUltraMsg) {
          sent = await sendViaUltraMsg(m.phone, msg)
        }
        console.log(`[${i + 1}/${MEMBERS.length}] Sent to ${m.name} (${m.phone}): ${sent ? '✅ SUCCESS' : '❌ FAILED'}`)
        // Polite 3-second delay between messages to stay completely under WhatsApp anti-spam radar
        if (i < MEMBERS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      } catch (err) {
        console.error(`[${i + 1}/${MEMBERS.length}] Error sending to ${m.name}:`, err.message)
      }
    } else {
      const encodedMsg = encodeURIComponent(msg)
      const waUrl = `https://wa.me/91${m.phone}?text=${encodedMsg}`
      console.log(`[${i + 1}/${MEMBERS.length}] ${m.name} (${m.phone})`)
      console.log(`👉 WhatsApp Link: ${waUrl}\n`)
    }
  }

  console.log('='.repeat(70))
  console.log('✨ Monday reminders processed successfully!')
  console.log('='.repeat(70))
}

run()
