// x: -1 (far left) .. 1 (far right); hideEyes: covers eyes while typing the password; isAngry: rage state
export default function Santa({ x, hideEyes, isAngry }) {
  return (
    <div
      className={`santa ${isAngry ? 'santa-raging' : ''}`}
      style={{
        transform: `translateX(calc(-50% + ${x * 9}rem)) perspective(40rem) rotateY(${x * 28}deg) rotateZ(${x * 4}deg)`
      }}
    >
      {/* Angry Speech Bubble */}
      {isAngry && (
        <div className="santa-speech-bubble" role="alert">
          <span className="bubble-icon">💢</span>
          <span className="bubble-text">Ho ho ho! Wrong credentials! Make it as per the admin gave you, idiot!</span>
          <span className="bubble-tail" />
        </div>
      )}

      <svg viewBox="0 0 200 190" width="100%">
        {/* Body */}
        <ellipse cx="100" cy="190" rx="82" ry="58" fill={isAngry ? '#b71c1c' : '#c62828'} />
        
        {/* Head (turns flushed red when angry) */}
        <circle cx="100" cy="92" r="46" fill={isAngry ? '#ff8a80' : '#ffd9b8'} />
        
        {/* Beard */}
        <path d="M52 100 Q100 196 148 100 Q100 128 52 100Z" fill="#fff" />
        
        {/* Hat */}
        <path d="M50 72 Q100 -24 150 72Z" fill="#d32f2f" />
        <rect x="46" y="62" width="108" height="22" rx="11" fill="#fff" />
        <circle cx="100" cy="22" r="12" fill="#fff" />
        
        {/* Eyes */}
        {[82, 118].map(cx => (
          <g key={cx}>
            <circle cx={cx} cy="94" r="8" fill="#fff" />
            <circle cx={cx + x * 3.5} cy="94" r="4.5" fill={isAngry ? '#b71c1c' : '#222'} />
          </g>
        ))}

        {/* Angry Eyebrows when raging */}
        {isAngry && (
          <g stroke="#222" strokeWidth="4" strokeLinecap="round">
            {/* Left brow angled steeply down toward center */}
            <line x1="72" y1="83" x2="92" y2="89" />
            {/* Right brow angled steeply down toward center */}
            <line x1="128" y1="83" x2="108" y2="89" />
            {/* Anger vein on forehead */}
            <path d="M96 52 L104 52 M100 48 L100 56" stroke="#b71c1c" strokeWidth="3" />
          </g>
        )}

        {/* Nose */}
        <circle cx="100" cy="108" r="6" fill={isAngry ? '#d50000' : '#f2a08a'} />

        {/* Mouth when angry: shouting oval */}
        {isAngry && (
          <ellipse cx="100" cy="124" rx="8" ry="6" fill="#3e1010" />
        )}

        {/* Hands covering eyes when typing password */}
        {!isAngry && (
          <g style={{ transition: 'opacity .25s, transform .25s', opacity: hideEyes ? 1 : 0, transform: `translateY(${hideEyes ? 0 : 14}px)` }}>
            <circle cx="82" cy="94" r="15" fill="#ffd9b8" stroke="#e0b898" />
            <circle cx="118" cy="94" r="15" fill="#ffd9b8" stroke="#e0b898" />
          </g>
        )}
      </svg>
    </div>
  )
}
