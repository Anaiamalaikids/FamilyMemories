import { useState, useRef, useEffect } from 'react'
import { launchChristmasConfetti } from './confetti.js'
import { MEMBERS } from './membersData.js'

export default function Reveal({ me, onExit, onNavigate }) {
  // steps: 'welcome' | 'playing_video' | 'revealed'
  const [step, setStep] = useState('welcome')
  const videoRef = useRef(null)
  const [videoMuted, setVideoMuted] = useState(false)
  const [videoPaused, setVideoPaused] = useState(false)
  const [countdown, setCountdown] = useState({ days: 17, hours: 8, minutes: 24 })

  // Find target's rich data from MEMBERS if available
  const targetData = MEMBERS.find(m => m.name === me.target?.name) || {
    role: 'Secret Family Member',
    badge: 'Gift Recipient',
    quote: 'Excited to see what Santa brings!',
    bio: 'Ready to celebrate Christmas with the family.',
    color: '#c62828'
  }

  // Live countdown to Christmas Day (Dec 25)
  useEffect(() => {
    const calcTime = () => {
      const now = new Date()
      const christmas = new Date(now.getFullYear(), 11, 25, 0, 0, 0)
      if (now > christmas) christmas.setFullYear(now.getFullYear() + 1)
      const diff = christmas - now
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      })
    }
    calcTime()
    const timer = setInterval(calcTime, 60000)
    return () => clearInterval(timer)
  }, [])

  // Start video play when "Open My Gift" is clicked
  const handleOpenGift = () => {
    setStep('playing_video')
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true
            setVideoMuted(true)
            videoRef.current.play()
          }
        })
      }
    }, 100)
  }

  // Trigger grand reveal with confetti
  const triggerReveal = () => {
    setStep('revealed')
    launchChristmasConfetti()
  }

  // Video ended handler
  const handleVideoEnded = () => {
    triggerReveal()
  }

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setVideoPaused(false)
      } else {
        videoRef.current.pause()
        setVideoPaused(true)
      }
    }
  }

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setVideoMuted(videoRef.current.muted)
    }
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h >= 4 && h < 12) return 'Good morning'
    if (h >= 12 && h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="reveal-stage" id="home">
      {/* Background layer */}
      <div className="inside-bg-layer">
        <img
          src="/santa_bg.jpg"
          alt="Festive Background"
          className="inside-bg-image"
        />
        <div className="inside-bg-overlay" />
      </div>

      <div className="reveal-content-container">
        {/* Welcome State: Before clicking "Open My Gift" */}
        {step === 'welcome' && (
          <div className="reveal-card welcome-card">
            <div className="santa-shh-pill">
              <img src="/santa_shh.jpg" alt="Secret Santa" className="mini-shh-avatar" />
              <span>Official Secret Assignment</span>
            </div>

            <h1 className="reveal-greeting">{getGreeting()}, {me.name}</h1>
            <p className="reveal-sub">
              Your Secret Santa gift is locked and ready. Click below to play the Christmas reveal video and discover who you are gifting.
            </p>

            {/* Holiday Countdown Badge */}
            <div className="countdown-bar">
              <span className="countdown-text">
                Christmas in: <strong>{countdown.days}d {countdown.hours}h {countdown.minutes}m</strong>
              </span>
            </div>

            {/* 3D Animated Gift Box */}
            <div className="gift-box-wrapper" onClick={handleOpenGift} role="button" tabIndex={0}>
              <div className="gift-pulse-ring" />
              <div className="gift-3d">
                <i className="lid" />
                <i className="box" />
              </div>
            </div>

            {/* Action Button */}
            <button className="open-gift-btn" onClick={handleOpenGift}>
              <span className="btn-text">Open My Gift</span>
            </button>

            <p className="secrecy-note">
              Make sure nobody is peeking over your shoulder!
            </p>
          </div>
        )}

        {/* Video Playing State: Christmas Video Modal / Theater */}
        {step === 'playing_video' && (
          <div className="video-theater-overlay">
            <div className="video-theater-box">
              <div className="theater-header">
                <div className="theater-badge">
                  <span className="pulse-red" /> Unwrapping Gift Video…
                </div>
                <button className="theater-skip-btn" onClick={triggerReveal}>
                  Reveal Person Now ➔
                </button>
              </div>

              <div className="theater-video-wrapper">
                <video
                  ref={videoRef}
                  className="theater-video"
                  src="/christmas.mp4"
                  playsInline
                  onEnded={handleVideoEnded}
                  autoPlay
                />

                {/* Floating controls */}
                <div className="theater-controls">
                  <button className="theater-ctrl-btn" onClick={toggleVideoPlay}>
                    {videoPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    className={`theater-ctrl-btn ${!videoMuted ? 'active' : ''}`}
                    onClick={toggleVideoMute}
                  >
                    {videoMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </div>

              <div className="theater-footer">
                <button className="reveal-now-pill" onClick={triggerReveal}>
                  Reveal My Secret Target
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grand Revealed State: Target's Photo & Name */}
        {step === 'revealed' && (
          <div className="reveal-card revealed-card">
            <div className="revealed-badge">
              <span>Confidential Match Revealed</span>
            </div>

            <p className="revealed-pretitle">You are the Secret Santa for</p>

            {/* Target Person Image */}
            <div className="target-portrait-container">
              <div className="golden-wreath-glow" />
              <img
                className="target-photo-img"
                src={me.target.photo}
                alt={me.target.name}
              />
            </div>

            {/* Target Person Name */}
            <h2 className="target-name-big">{me.target.name}</h2>

            {/* Target Member Role Badge */}
            <div className="target-role-badge">
              <span>{targetData.badge}</span>
              <span className="role-sep">•</span>
              <span>{targetData.role}</span>
            </div>

            <blockquote className="target-quote">
              “{targetData.quote}”
            </blockquote>

            {/* Secret Mission Card */}
            <div className="secret-mission-box">
              <div className="mission-title">
                <strong>Your Secret Santa Mission:</strong>
              </div>
              <p className="mission-text">
                Find or prepare a special gift for <strong>{me.target.name}</strong>. Keep your identity completely secret until the family opens gifts together!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="revealed-actions">
              <button
                className="replay-video-btn"
                onClick={() => {
                  setStep('playing_video')
                  setTimeout(() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0
                      videoRef.current.play()
                    }
                  }, 100)
                }}
              >
                Watch Video Again
              </button>
              
              {onNavigate && (
                <button
                  className="memories-btn"
                  onClick={() => onNavigate('memories')}
                >
                  View Family Memories
                </button>
              )}

              <button className="logout-ghost-btn" onClick={onExit}>
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
