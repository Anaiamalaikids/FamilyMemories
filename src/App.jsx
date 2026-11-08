import { useState, useEffect } from 'react'
import Snow from './Snow.jsx'
import Navbar from './Navbar.jsx'
import Login from './Login.jsx'
import Reveal from './Reveal.jsx'
import Memories from './Memories.jsx'
import Members from './Members.jsx'
import HowToUse from './HowToUse.jsx'
import AdminPanel from './AdminPanel.jsx'
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
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Listen to scroll position for Back-to-Top button
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 350)
    }
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  // Set initial history state on load
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ section: 'home' }, '')
    }
  }, [])

  // Listen for mobile back gesture / browser back button to navigate to home instead of leaving site
  useEffect(() => {
    const handlePopState = (e) => {
      // If a modal was open, it handled its own popstate
      if (e.state?.modal) return

      const target = e.state?.section || 'home'
      setActiveSection(target)
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(target)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [me])

  const handleNavigate = (sectionId, pushHistory = true) => {
    setActiveSection(sectionId)
    if (pushHistory) {
      window.history.pushState({ section: sectionId }, '')
    }
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
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
        {activeSection === 'admin' ? (
          <AdminPanel currentUser={me} onExit={() => handleNavigate('home')} />
        ) : me ? (
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

      {/* Floating Back to Top Button */}
      <button
        type="button"
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  )
}
