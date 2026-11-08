import { useState, useEffect } from 'react'
import Snow from './Snow.jsx'
import Navbar from './Navbar.jsx'
import Login from './Login.jsx'
import Reveal from './Reveal.jsx'
import Memories from './Memories.jsx'
import Members from './Members.jsx'
import HowToUse from './HowToUse.jsx'
import Footer from './Footer.jsx'

const Trees = () => (
  <svg className="trees" viewBox="0 0 1260 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    {[...Array(14)].map((_, i) => (
      <polygon
        key={i}
        points={`${i * 90},120 ${i * 90 + 45},${18 + (i % 3) * 18} ${i * 90 + 90},120`}
        fill={i % 2 ? '#0f3d2e' : '#145a41'}
      />
    ))}
  </svg>
)

export default function App() {
  const [me, setMe] = useState(null)
  const [activeSection, setActiveSection] = useState('home')

  // Restore previous session from sessionStorage if any
  useEffect(() => {
    const saved = sessionStorage.getItem('secret_santa_user')
    if (saved) {
      try {
        setMe(JSON.parse(saved))
      } catch {
        sessionStorage.removeItem('secret_santa_user')
      }
    }
  }, [])

  const handleLoginSuccess = (user) => {
    setMe(user)
    sessionStorage.setItem('secret_santa_user', JSON.stringify(user))
    setActiveSection('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    setMe(null)
    sessionStorage.removeItem('secret_santa_user')
    setActiveSection('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId)
    // If not logged in, scroll to section on the page
    if (!me) {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // If logged in, scroll to top of the switched view
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="app-container">
      {/* Background festive snow canvas & trees */}
      <Snow />
      <Trees />

      {/* Top Navigation Bar with 'Secret Santa', Home, Memories, The 11 Elves, How to Use */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={me}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {/* LOGGED IN MODE: Clean, dedicated confidential view without background bleed */}
        {me ? (
          <>
            {activeSection === 'home' && (
              <Reveal
                me={me}
                onExit={handleLogout}
                onNavigate={handleNavigate}
              />
            )}
            {activeSection === 'memories' && <Memories />}
            {activeSection === 'members' && <Members />}
            {activeSection === 'how-to-use' && (
              <HowToUse onGoToLogin={() => handleNavigate('home')} />
            )}
          </>
        ) : (
          /* PUBLIC / LOGGED OUT MODE: Landing page with Login Hero and preview sections */
          <>
            <Login onDone={handleLoginSuccess} />
            <Memories />
            <Members />
            <HowToUse onGoToLogin={() => handleNavigate('home')} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}
