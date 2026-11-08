import { useState } from 'react'

export default function Navbar({ activeSection, onNavigate, currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'memories', label: 'Memories' },
    { id: 'members', label: 'The 11 Elves' },
    { id: 'how-to-use', label: 'How to Use' },
  ]

  const handleNavClick = (id) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Brand Logo - Secret Santa */}
        <div className="nav-brand" onClick={() => handleNavClick('home')} role="button" tabIndex={0}>
          <span className="brand-text">Secret Santa</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span>{item.label}</span>
                {activeSection === item.id && <span className="nav-indicator" />}
              </button>
            </li>
          ))}
        </ul>

        {/* Right side: User status / Login indicator */}
        <div className="nav-actions">
          {currentUser ? (
            <div className="user-pill">
              <span className="user-avatar-mini" style={{ background: currentUser.color || '#c62828' }}>
                {currentUser.name[0]}
              </span>
              <span className="user-name">Hi, {currentUser.name}</span>
              <button className="nav-logout-btn" onClick={onLogout} title="Log out">
                ✕
              </button>
            </div>
          ) : (
            <button className="nav-cta-btn" onClick={() => handleNavClick('home')}>
              Open Portal
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="nav-brand">
                <span className="brand-text">Secret Santa</span>
              </div>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`mobile-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="mobile-nav-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {currentUser && (
              <div className="mobile-user-box">
                <div className="mobile-user-info">
                  <span className="user-avatar-mini">{currentUser.name[0]}</span>
                  <span>Logged in as <strong>{currentUser.name}</strong></span>
                </div>
                <button className="mobile-logout-btn" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
