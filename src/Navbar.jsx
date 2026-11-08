export default function Navbar({ activeSection, onNavigate, currentUser, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'memories', label: 'Memories', icon: '📸' },
    { id: 'members', label: '12 Elves', icon: '🧝' },
    { id: 'how-to-use', label: 'Guide', icon: '📜' },
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
            <span className="brand-santa-icon">🎅</span>
            <span className="brand-text">Secret Santa</span>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="nav-links desktop-only">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link-btn ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span>{item.id === 'members' ? 'The 12 Elves' : item.id === 'how-to-use' ? 'How to Use' : item.label}</span>
                  {activeSection === item.id && <span className="nav-indicator" />}
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
                <span className="user-name">Hi, {currentUser.name.split(' ')[0]}</span>
                <button className="nav-logout-btn" onClick={onLogout} title="Log out">
                  ✕
                </button>
              </div>
            ) : (
              <button className="nav-cta-btn" onClick={() => handleNavClick('home')}>
                Portal ➔
              </button>
            )}
          </div>
        </div>

        {/* Mobile & Split-Screen Always-Visible Quick Nav Ribbon */}
        <div className="nav-mobile-ribbon" aria-label="Mobile Navigation">
          <div className="nav-ribbon-track">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`ribbon-tab-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="ribbon-icon">{item.icon}</span>
                <span className="ribbon-label">{item.label}</span>
                {activeSection === item.id && <span className="ribbon-glow-dot" />}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
