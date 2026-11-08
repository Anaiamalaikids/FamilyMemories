export default function Footer({ onNavigate }) {
  return (
    <footer className="festive-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-santa-icon">🎅</span>
          <h3>Family Secret Santa</h3>
          <p>Spreading holiday cheer, festive surprises, and confidential gifting since 2026.</p>
        </div>

        <div className="footer-nav-col">
          <h4>Navigation</h4>
          <button onClick={() => onNavigate('home')}>Home & Login</button>
          <button onClick={() => onNavigate('memories')}>Memories</button>
          <button onClick={() => onNavigate('members')}>The 11 Elves</button>
          <button onClick={() => onNavigate('how-to-use')}>How to Use</button>
        </div>

        <div className="footer-rules-col">
          <h4>Holiday Rules</h4>
          <p>🎁 Gift Budget: Thoughtful & Fun</p>
          <p>🤫 Secrecy Level: Maximum</p>
          <p>🎄 Reveal Date: Christmas Day</p>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>Crafted with ❤️ and Christmas magic for our family.</p>
        <p className="santa-blessing">Ho Ho Ho! Merry Christmas to all! 🌟</p>
      </div>
    </footer>
  )
}
