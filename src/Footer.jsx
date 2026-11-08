export default function Footer({ onNavigate }) {
  return (
    <footer className="simple-footer">
      <div className="footer-container">
        <div className="footer-top">
          <span className="footer-title">Secret Santa 2026</span>
          <div className="footer-nav">
            <button onClick={() => onNavigate('home')}>Home</button>
            <button onClick={() => onNavigate('memories')}>Memories</button>
            <button onClick={() => onNavigate('members')}>The 12 Elves</button>
            <button onClick={() => onNavigate('how-to-use')}>How to Use</button>
            <button onClick={() => onNavigate('admin')} className="footer-admin-link">Admin</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Family Secret Santa & New Year Gift Portal</p>
        </div>
      </div>
    </footer>
  )
}
