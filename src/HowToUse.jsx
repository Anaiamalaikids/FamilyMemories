export default function HowToUse({ onGoToLogin }) {
  const steps = [
    {
      num: '01',
      badge: 'Step 1: Credentials',
      title: 'Get Your Credentials',
      desc: 'Your login ID is your registered mobile number. Your password has been assigned by the admin. Keep it private.'
    },
    {
      num: '02',
      badge: 'Step 2: Authentication',
      title: 'Log In on Home Page',
      desc: 'Head to the Home page, enter your registered mobile number and password, and click Enter Secret Santa Portal.'
    },
    {
      num: '03',
      badge: 'Step 3: Reveal Target',
      title: 'Reveal Who You Are Gifting',
      desc: 'Click the reveal button to watch the video and discover who you will be gifting for New Year 2026.'
    },
    {
      num: '04',
      badge: 'Step 4: Keep Confidential',
      title: 'Prepare Gift & Keep Secret',
      desc: 'Your assigned match is saved. Prepare their gift and keep your identity secret until gifts are exchanged on New Year.'
    }
  ]

  return (
    <section className="how-to-use-section" id="how-to-use">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">Instructions</div>
          <h2 className="section-title">How to Use</h2>
          <p className="section-sub">
            Follow these steps to log in, watch the reveal video, and view your secret target.
          </p>
        </div>

        {/* The Admin Roast Note */}
        <div className="roast-note-card">
          <div className="roast-header">
            <span className="roast-tag">Notice from Admin</span>
            <h3 className="roast-heading">Read This First</h3>
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

        {/* 4 Clean Step Cards */}
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-top-row">
                <span className="step-number">{s.num}</span>
                <span className="step-badge">{s.badge}</span>
              </div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Responsive Jump to Login Banner */}
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
      </div>
    </section>
  )
}
