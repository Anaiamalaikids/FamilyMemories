import { useEffect, useRef, useState } from "react";
import Santa from "./Santa.jsx";
import { login } from "./api.js";

export default function Login({ onDone }) {
  const [x, setX] = useState(0);
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [hide, setHide] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [isAngry, setIsAngry] = useState(false);

  // Video controls
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);



  // Santa follows pointer / touch
  useEffect(() => {
    const move = (e) => {
      const p = e.touches ? e.touches[0] : e;
      setX(Math.max(-1, Math.min(1, (p.clientX / window.innerWidth) * 2 - 1)));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("touchmove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("touchmove", move);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const playAngryVoice = () => {
    setIsAngry(true);
    try {
      const audio = new Audio('/santa_angry.mp3');
      audio.volume = 1.0;
      audio.play().catch(() => {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance('Make it as per the admin gave you, idiot!');
          u.rate = 1.05;
          u.pitch = 0.85;
          window.speechSynthesis.speak(u);
        }
      });
    } catch {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance('Make it as per the admin gave you, idiot!');
        window.speechSynthesis.speak(u);
      }
    }
    setTimeout(() => {
      setIsAngry(false);
    }, 4500);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const me = await login(phone.trim(), pw);
      if (!me) {
        setErr("Make it as per the admin gave you, idiot!");
        playAngryVoice();
      } else {
        onDone(me);
      }
    } catch {
      setErr("Could not reach the server. Please try again.");
    }
    setBusy(false);
  };



  return (
    <section className="login-section" id="home">
      {/* Ambient background video layer */}
      <div className="ambient-video-layer">
        <video
          className="ambient-bg-video"
          src="/sree.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="ambient-overlay" />
      </div>

      <div className="login-container">
        {/* Hero Header */}
        <div className="login-hero-header">
          <div className="badge-pill">Secret Santa 2026</div>
          <h1 className="hero-title">Family Secret Santa</h1>
          <p className="hero-sub">
            Watch the feature video below, enter your registered mobile number
            and password, and unlock your secret gift target.
          </p>
        </div>

        {/* Dual Layout: sree.mp4 Video Showcase on Left, Login on Right */}
        <div className="login-dual-grid">
          {/* Left Column: Secret Santa Feature Video (sree.mp4) */}
          <div className="video-card-container">
            <div className="festive-video-frame">
              <div className="video-frame-header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="frame-title">Secret Santa Feature Video</span>
              </div>

              <div className="video-wrapper">
                <video
                  ref={videoRef}
                  className="showcase-video"
                  src="/sree.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />

                {/* Floating Video Controls */}
                <div className="video-controls-overlay">
                  <button
                    className="video-ctrl-btn"
                    onClick={togglePlay}
                    title={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    className={`video-ctrl-btn ${!isMuted ? "active-audio" : ""}`}
                    onClick={toggleMute}
                    title={isMuted ? "Unmute video audio" : "Mute audio"}
                  >
                    {isMuted ? "Unmute Audio" : "Audio On"}
                  </button>
                </div>
              </div>

              <div className="video-frame-footer">
                <span>Featured Video</span>
                <span className="badge-live">HD</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Card with Santa */}
          <div className="login-form-column">
            <div className="rail">
              <Santa x={x} hideEyes={hide} isAngry={isAngry} />
            </div>

            <form
              className="login-card"
              onSubmit={submit}
              style={{
                transform: `perspective(70rem) rotateY(${x * 6}deg) rotateX(-2deg)`,
              }}
            >
              <div className="card-header">
                <h2>Member Login</h2>
                <span className="secure-badge">Secure</span>
              </div>
              <p className="card-sub">
                Enter your credentials to reveal who you are gifting.
              </p>

              <label className="input-group">
                <span className="input-label">Mobile Number</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="e.g. 9000000002"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>

              <label className="input-group">
                <span className="input-label">Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onFocus={() => setHide(true)}
                  onBlur={() => setHide(false)}
                  required
                />
              </label>

              {err && (
                <div className="error-banner" role="alert">
                  {err}
                </div>
              )}

              <button className="login-submit-btn" disabled={busy}>
                {busy ? (
                  <span className="btn-loading">
                    <span className="spinner" /> Verifying…
                  </span>
                ) : (
                  <span>Enter Secret Santa Portal</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
