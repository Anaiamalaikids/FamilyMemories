import { useState } from 'react'
import { launchChristmasConfetti } from './confetti.js'

export default function HowToUse({ onGoToLogin }) {
  const [pledged, setPledged] = useState(false)
  const [loyaltyScore, setLoyaltyScore] = useState(null)
  const [reported, setReported] = useState(false)

  const steps = [
    {
      num: '01',
      icon: '🤫',
      title: 'Get Your Secret Credentials',
      badge: 'Step 1: Admin Dispatch',
      desc: 'Sakthi (The Admin) has your registered phone number and private password. Memorize it and never share it in the group chat!'
    },
    {
      num: '02',
      icon: '🔐',
      title: 'Enter The Portal On Home Page',
      badge: 'Step 2: Authentication',
      desc: 'Head to Home, look Santa in the eye, and log in. If you enter the wrong password, prepare to be yelled at by an angry Santa!'
    },
    {
      num: '03',
      icon: '🎬',
      title: 'Click "Reveal Who I\'m Gifting"',
      badge: 'Step 3: Confidential Video',
      desc: 'Watch the festive reveal video unfold. At the end, your confidential target\'s real face and personality match will appear on screen.'
    },
    {
      num: '04',
      icon: '🎁',
      title: 'New Year Gift Handover',
      badge: 'Step 4: The Big Exchange',
      desc: 'Secret Santa names are drawn on Christmas, but gifts are opened together on New Year 2026! Bring a thoughtful gift with zero excuses.'
    }
  ]

  const rules = [
    {
      id: 'sathya-clause',
      icon: '🛡️',
      tag: 'Zero-Tolerance Policy',
      title: 'The "Sathya Clause" of 2026',
      text: 'Last year Sathya betrayed Sakthi. Never again! Anyone who fails to buy a gift, arrives empty-handed, or betrays their person on New Year will be publicly roasted and their most embarrassing baby photo will become the family WhatsApp DP for one month!'
    },
    {
      id: 'gossip-blackout',
      icon: '📻',
      tag: 'Top Secret Rule',
      title: 'The Harikrishnan Blackout',
      text: 'Do NOT tell Harikrishnan who you are gifting under any circumstances! He is the undisputed Chief Broadcast Officer of the brothers. If he finds out, it will become breaking news across the entire family in less than 4 minutes.'
    },
    {
      id: 'new-year-handover',
      icon: '🎉',
      tag: 'Event Schedule',
      title: 'Christmas Reveal, New Year Handover',
      text: 'We do our secret online draw on Christmas, and we exchange the physical gifts together on New Year 2026. Wrapped in newspaper? Totally fine. Regifting old used items? Instant disqualification!'
    },
    {
      id: 'atomic-lock',
      icon: '🔒',
      tag: 'Database Integrity',
      title: 'Permanent Database Lock',
      text: 'Once your match is revealed, it is permanently locked inside the Supabase PostgreSQL database. There are no rerolls, no returns, and no trading cousins behind the admin\'s back!'
    }
  ]

  const handlePledge = () => {
    setPledged(true)
    launchChristmasConfetti()
  }

  const handleTestLoyalty = () => {
    const scores = [99.8, 100, 99.4, 98.9, 100]
    const randomScore = scores[Math.floor(Math.random() * scores.length)]
    setLoyaltyScore(randomScore)
    launchChristmasConfetti()
  }

  const handleReport = () => {
    setReported(true)
    setTimeout(() => setReported(false), 3500)
  }

  return (
    <section className="how-to-use-section" id="how-to-use">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">Family Playbook 2026</div>
          <h2 className="section-title">How It Works & Family Rules</h2>
          <p className="section-sub">
            The official, non-negotiable rules for our Secret Santa draw & New Year gift exchange.
          </p>
        </div>

        {/* The Famous Admin Roast Notice */}
        <div className="roast-note-card interactive-3d-card">
          <div className="roast-top-flag">
            <span className="roast-icon">📢</span>
            <span className="roast-tag">Mandatory Notice from The Admin</span>
          </div>

          <div className="roast-speech-bubble">
            <p className="roast-text">
              “Yo bro, you're a total idiot because the admin already told you on how to do this. Still you're looking at it. Okay, I can explain you because you're not a talented fellow like him.”
            </p>
            <div className="roast-footer">
              <span className="roast-author">— Sakthi (The Admin)</span>
              <span className="roast-stamp">100% Genuine Roast 🎯</span>
            </div>
          </div>
        </div>

        {/* 4 Interactive 3D Step Cards */}
        <div className="steps-3d-grid">
          {steps.map((s) => (
            <div key={s.num} className="step-3d-card">
              <div className="step-card-glass">
                <div className="step-header-row">
                  <span className="step-icon-big">{s.icon}</span>
                  <span className="step-counter">{s.num}</span>
                </div>
                <div className="step-badge-pill">{s.badge}</div>
                <h3 className="step-card-title">{s.title}</h3>
                <p className="step-card-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* The Sacred Family Honor Code */}
        <div className="honor-code-container">
          <div className="honor-header">
            <span className="honor-badge">⚠️ Code of Conduct</span>
            <h3 className="honor-title">The Sacred Family Honor Code</h3>
            <p className="honor-sub">Break any of these and face public family roasting until 2027.</p>
          </div>

          <div className="honor-grid">
            {rules.map((rule) => (
              <div key={rule.id} className="honor-card">
                <div className="honor-card-top">
                  <span className="honor-icon">{rule.icon}</span>
                  <span className="honor-tag">{rule.tag}</span>
                </div>
                <h4 className="honor-rule-title">{rule.title}</h4>
                <p className="honor-rule-text">{rule.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Loyalty & Betrayal Tracker Widget */}
        <div className="loyalty-widget-card">
          <div className="loyalty-header">
            <span className="loyalty-badge">Interactive Loyalty Console</span>
            <h3 className="loyalty-title">Family Loyalty & Sathya-Defense System 🛡️</h3>
            <p className="loyalty-desc">Verify your loyalty before opening the portal to prove you will not betray your match this year!</p>
          </div>

          <div className="loyalty-actions-row">
            <button
              className={`loyalty-btn pledge-btn ${pledged ? 'active' : ''}`}
              onClick={handlePledge}
            >
              {pledged ? '✅ Pledged: I Will Not Betray!' : '🤝 I Swear On My Honor Not to Betray'}
            </button>

            <button
              className="loyalty-btn test-btn"
              onClick={handleTestLoyalty}
            >
              🎲 Check My Loyalty Score
            </button>

            <button
              className="loyalty-btn alert-btn"
              onClick={handleReport}
            >
              🚨 Report Secret Peeking
            </button>
          </div>

          {loyaltyScore && (
            <div className="loyalty-score-banner">
              <span>🌟 Your Loyalty Score: <strong>{loyaltyScore}%</strong> — Qualified for Gift Exchange! 🎅</span>
            </div>
          )}

          {reported && (
            <div className="report-alert-banner">
              <span>🚨 Alert Sent to Admin Sakthi: "Someone is acting suspicious around the screen!" 👀</span>
            </div>
          )}
        </div>

        {/* Final Jump to Portal CTA */}
        {onGoToLogin && (
          <div className="portal-jump-banner">
            <div className="jump-content">
              <h3>Ready to meet the person you're gifting?</h3>
              <p>Enter the portal now and see your secret match.</p>
            </div>
            <button className="jump-cta-btn" onClick={onGoToLogin}>
              Enter Secret Santa Portal ➔
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
