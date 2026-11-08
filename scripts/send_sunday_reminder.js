/**
 * Sunday Automated Reminder Script for Secret Santa 2026
 * 
 * Runs automatically every Sunday or whenever triggered by the Admin!
 * Calculates the exact countdown and prepares the reminder roast message:
 * "Don't forget to buy the gift for your Secret Santa member because last year Sathya betrayed Sakthi!"
 */

const MEMBERS = [
  { name: 'Aadhi', phone: '9361386647' },
  { name: 'Sreedharan Kandavel', phone: '6383659695' },
  { name: 'Harikrishnan', phone: '7695898730' },
  { name: 'Brinda', phone: '9344858175' },
  { name: 'Sathya', phone: '9080636525' },
  { name: 'Shruthi', phone: '7010151872' },
  { name: 'Swarna Akshita', phone: '7812854115' },
  { name: 'Sailoga Prakash', phone: '6382896498' },
  { name: 'Aadhu', phone: '6383335626' },
  { name: 'Sarath Vikram', phone: '7010043287' },
  { name: 'Srinithi', phone: '9000000011' },
  { name: 'Sakthi', phone: '9344626769' },
]

function getCountdownDays() {
  const now = new Date()
  const newYear = new Date(now.getFullYear() + (now.getMonth() === 11 && now.getDate() > 25 ? 1 : 0), 0, 1)
  if (now > newYear) newYear.setFullYear(newYear.getFullYear() + 1)
  const diffTime = newYear - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function generateRoastMessage(member, daysLeft) {
  return `🎅 *FAMILY SECRET SANTA 2026 REMINDER* 🎁\n\nHey ${member.name}! Only *${daysLeft} days left* until our New Year Gift Exchange! 🎉\n\n⚠️ *CRITICAL RULE:* Don't forget to buy the gift for your Secret Santa person, because *LAST YEAR SATHYA BETRAYED SAKTHI!* 😭 Do NOT be like Sathya! Keep your gift wrapped and ready!\n\n🔑 Check your portal here:\nhttps://familymemories.vercel.app\n\n— *From Admin Sakthi 📜*`
}

console.log('='.repeat(65))
console.log('🎄 SECRET SANTA SUNDAY REMINDER GENERATOR (IST TIME) 🎄')
console.log('='.repeat(65))

const days = getCountdownDays()
console.log(`\n📅 Days remaining until New Year Gift Exchange: ${days} days\n`)

MEMBERS.forEach((m, idx) => {
  const msg = generateRoastMessage(m, days)
  const encodedMsg = encodeURIComponent(msg)
  const waUrl = `https://wa.me/91${m.phone}?text=${encodedMsg}`
  
  console.log(`[${idx + 1}/${MEMBERS.length}] ${m.name} (${m.phone})`)
  console.log(`👉 1-Click WhatsApp Link: ${waUrl}\n`)
})

console.log('='.repeat(65))
console.log('✨ You can click any link above to message them directly on WhatsApp!')
console.log('='.repeat(65))
