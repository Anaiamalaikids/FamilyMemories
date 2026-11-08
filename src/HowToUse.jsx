import { useState } from 'react'

export default function HowToUse({ onGoToLogin }) {
  const [openFaq, setOpenFaq] = useState(null)

  const steps = [
    {
      step: '01',
      title: 'Get Your Credentials',
      badge: 'Step 1: Credentials',
      description:
        'Your login ID is your registered mobile number (e.g., 9000000001 through 9000000011). Your password has been given to you by the admin. Keep it private.'
    },
    {
      step: '02',
      title: 'Log In On Home Page',
      badge: 'Step 2: Authentication',
      description:
        'Go to the Home tab, watch the feature video, enter your phone number and password, and click “Enter Secret Santa Portal”.'
    },
    {
      step: '03',
      title: 'Click “Open My Gift”',
      badge: 'Step 3: Reveal Video',
      description:
        'Once inside your dashboard, click “Open My Gift”. The special Christmas video will play and lead into the reveal.'
    },
    {
      step: '04',
      title: 'Meet Your Target & Keep It Secret',
      badge: 'Step 4: Secrecy',
      description:
        'Your assigned family member’s name and picture will appear. Buy them a thoughtful gift and keep it 100% secret until exchange day.'
    }
  ]

  const faqs = [
    {
      q: 'Can I swap who I got?',
      a: 'No, assignments are randomly matched and final.'
    },
    {
      q: 'What if I forgot my password?',
      a: 'Reach out directly to the Admin to retrieve or reset your password.'
    },
    {
      q: 'Can other members see my match?',
      a: 'No. Only your account has access to view your assigned secret match.'
    },
    {
      q: 'Can I log back in later?',
      a: 'Yes, anytime. Your match remains saved.'
    }
  ]

  return (
    <section className="how-to-use-section" id="how-to-use">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">Instructions</div>
          <h2 className="section-title">How To Use The App</h2>
          <p className="section-sub">
            Follow these steps to log in, watch the video, and view your secret target.
          </p>
        </div>

        {/* The Admin Roast Note (Exact wording requested by user) */}
        <div className="roast-note-card">
          <div className="roast-header">
            <div className="roast-title-wrap">
              <span className="roast-tag">Notice from Admin</span>
              <h3 className="roast-heading">Read This First</h3>
            </div>
          </div>
          
          <div className="roast-speech-bubble">
            <p className="roast-text">
              “Yo bro, you're a total idiot because the admin already told you on how to do this. Still you're looking at it. Okay, I can explain you because you're not a talented fellow like him.”
            </p>
            <div className="roast-author">
              <span>— The Admin</span>
            </div>
          </div>
        </div>

        {/* 4 Step Cards */}
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.step} className="step-card">
              <div className="step-top-row">
                <span className="step-number">{s.step}</span>
              </div>
              <span className="step-badge">{s.badge}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Call to action button */}
        {onGoToLogin && (
          <div className="try-it-banner">
            <div className="banner-text">
              <h3>Ready to find out who you are gifting?</h3>
              <p>Jump to the login portal now.</p>
            </div>
            <button className="cta-jump-btn" onClick={onGoToLogin}>
              Go to Login
            </button>
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="faq-section">
          <h3 className="faq-main-title">Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-arrow">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
