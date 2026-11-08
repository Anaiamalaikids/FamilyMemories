export default function Navbar({ activeSection, onNavigate, currentUser, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'memories', label: 'Memories' },
    { id: 'members', label: 'The 12 Elves' },
    { id: 'how-to-use', label: 'How to Use' },
  ]

  const handleNavClick = (id) => {
    onNavigate(id)
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Top Header Row */}
        <div className="nav-top-row">
          <div
            className="nav-brand"
            onClick={() => handleNavClick('home')}
            role="button"
            tabIndex={0}
          >
            <span className="brand-text">Secret Santa</span>
          </div>

          {/* Desktop Navigation Links (No emojis, clean text) */}
          <ul className="nav-links desktop-only">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link-btn ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* User status / Portal CTA */}
          <div className="nav-actions">
            {currentUser ? (
              <div className="user-pill">
                <span className="user-avatar-mini" style={{ background: currentUser.color || '#c62828' }}>
                  {currentUser.name[0]}
                </span>
                <span className="user-name">{currentUser.name.split(' ')[0]}</span>
                <button className="nav-logout-btn" onClick={onLogout} title="Log out">
                  ✕
                </button>
              </div>
            ) : (
              <button className="nav-cta-btn" onClick={() => handleNavClick('home')}>
                Portal
              </button>
            )}
          </div>
        </div>

        {/* Mobile & Split-Screen Always-Visible Quick Nav Ribbon (Clean text tabs, no emojis) */}
        <div className="nav-mobile-ribbon" aria-label="Mobile Navigation">
          <div className="nav-ribbon-track">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`ribbon-tab-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="ribbon-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
