// x: -1 (far left) .. 1 (far right); hideEyes: covers eyes while typing the password
export default function Santa({ x, hideEyes }) {
  return (
    <div className="santa" style={{ transform: `translateX(calc(-50% + ${x * 9}rem)) perspective(40rem) rotateY(${x * 28}deg) rotateZ(${x * 4}deg)` }}>
      <svg viewBox="0 0 200 190" width="100%">
        <ellipse cx="100" cy="190" rx="82" ry="58" fill="#c62828" />
        <circle cx="100" cy="92" r="46" fill="#ffd9b8" />
        <path d="M52 100 Q100 196 148 100 Q100 128 52 100Z" fill="#fff" />
        <path d="M50 72 Q100 -24 150 72Z" fill="#d32f2f" />
        <rect x="46" y="62" width="108" height="22" rx="11" fill="#fff" />
        <circle cx="100" cy="22" r="12" fill="#fff" />
        {[82, 118].map(cx => (
          <g key={cx}><circle cx={cx} cy="94" r="8" fill="#fff" /><circle cx={cx + x * 3.5} cy="94" r="4" fill="#222" /></g>
        ))}
        <circle cx="100" cy="108" r="6" fill="#f2a08a" />
        <g style={{ transition: 'opacity .25s, transform .25s', opacity: hideEyes ? 1 : 0, transform: `translateY(${hideEyes ? 0 : 14}px)` }}>
          <circle cx="82" cy="94" r="15" fill="#ffd9b8" stroke="#e0b898" /><circle cx="118" cy="94" r="15" fill="#ffd9b8" stroke="#e0b898" />
        </g>
      </svg>
    </div>
  )
}
