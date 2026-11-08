/**
 * Sunday Automated Reminder Script for Secret Santa 2026
 * 
 * Runs automatically every Sunday or whenever triggered by Admin Sakthi!
 * Sends a confidential WhatsApp reminder without revealing who anyone is gifting.
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
  const newYear = new Date(now.getFullYear() + (now.getMonth() === 11 && now.getDate() > 25 ? 1 : 0), 0, 1)
  if (now > newYear) newYear.setFullYear(newYear.getFullYear() + 1)
  const diffTime = newYear - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function generateReminderMessage(member, daysLeft) {
  // Never mentions assigned target to protect secrecy from lockscreen notification peeking
  return `Hey ${member.name}! Just a gentle reminder and the Secret Santa reveal will happen in just ${daysLeft} days, so make a gift ready. Because already Sakthi got betrayed by Sathya, so prepare it on time.\n\nPortal: https://family-memories-inky.vercel.app/`
}

console.log('='.repeat(65))
console.log('🎄 SECRET SANTA SUNDAY REMINDER GENERATOR 🎄')
console.log('='.repeat(65))

const days = getCountdownDays()
console.log(`\n📅 Days remaining until New Year Gift Exchange: ${days} days\n`)

MEMBERS.forEach((m, idx) => {
  const msg = generateReminderMessage(m, days)
  const encodedMsg = encodeURIComponent(msg)
  const waUrl = `https://wa.me/91${m.phone}?text=${encodedMsg}`
  
  console.log(`[${idx + 1}/${MEMBERS.length}] ${m.name} (${m.phone})`)
  console.log(`👉 WhatsApp Link: ${waUrl}\n`)
})

console.log('='.repeat(65))
console.log('✨ All confidential WhatsApp reminder links generated successfully!')
console.log('='.repeat(65))
