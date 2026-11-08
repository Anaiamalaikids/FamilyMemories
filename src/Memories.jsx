import { useState, useEffect } from 'react'
import { MEMORY_ALBUMS } from './memoriesData.js'

export default function Memories() {
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [likes, setLikes] = useState({ starts: 24, 'pongal-2025': 31, 'diwali-2025': 28 })
  const [touchStart, setTouchStart] = useState(null)

  const openAlbum = (album) => {
    setActiveAlbum(album)
    setPhotoIndex(0)
  }

  const closeAlbum = () => {
    setActiveAlbum(null)
    setPhotoIndex(0)
  }

  const handleNextPhoto = (total) => {
    setPhotoIndex((prev) => (prev + 1) % total)
  }

  const handlePrevPhoto = (total) => {
    setPhotoIndex((prev) => (prev - 1 + total) % total)
  }

  const toggleLike = (albumId) => {
    setLikes((prev) => ({
      ...prev,
      [albumId]: (prev[albumId] || 0) + 1,
    }))
  }

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!activeAlbum) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNextPhoto(activeAlbum.images.length)
      if (e.key === 'ArrowLeft') handlePrevPhoto(activeAlbum.images.length)
      if (e.key === 'Escape') closeAlbum()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeAlbum])

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (!touchStart || !activeAlbum) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (diff > 50) {
      handleNextPhoto(activeAlbum.images.length)
    } else if (diff < -50) {
      handlePrevPhoto(activeAlbum.images.length)
    }
    setTouchStart(null)
  }

  return (
    <section className="memories-section" id="memories">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">Family Memories</div>
          <h2 className="section-title">Memories & Gatherings</h2>
          <p className="section-sub">
            Our journey together over the years. Click any album to browse through the photos in full screen.
          </p>
        </div>

        {/* 3 Main Albums Grid: STARTS (First), PONGAL 25, DIWALI 25 */}
        <div className="albums-grid">
          {MEMORY_ALBUMS.map((album, idx) => {
            const hasImages = album.images && album.images.length > 0
            const count = hasImages ? album.images.length : 0
            const firstImg = hasImages ? album.images[0].src : null

            return (
              <div
                key={album.id}
                className="album-card"
                onClick={() => openAlbum(album)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === 'Enter' && openAlbum(album)}
              >
                <div className="album-card-top" style={{ borderColor: album.accentColor }}>
                  <div className="album-order-badge">#{idx + 1}</div>
                  <div className="album-photo-count">{count} Photos</div>
                </div>

                <div className="album-cover-stage">
                  {firstImg ? (
                    <img
                      src={firstImg}
                      alt={album.name}
                      className="album-cover-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="album-placeholder-cover">
                      <div className="placeholder-icon-box">
                        <span className="folder-label">{album.folder.split('/').pop()}</span>
                      </div>
                      <span className="placeholder-sub">Click to view post</span>
                    </div>
                  )}
                  <div className="album-hover-overlay">
                    <span className="view-post-btn">Open Album ({count} photos)</span>
                  </div>
                </div>

                <div className="album-info">
                  <div className="album-date-tag">{album.date}</div>
                  <h3 className="album-title">{album.name}</h3>
                  <div className="album-tagline">{album.tagline}</div>
                  <p className="album-desc">{album.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Instagram Post Modal Viewer */}
        {activeAlbum && (
          <div className="ig-modal-backdrop" onClick={closeAlbum}>
            <div className="ig-post-card" onClick={(e) => e.stopPropagation()}>
              {/* Instagram Post Header */}
              <div className="ig-post-header">
                <div className="ig-user-info">
                  <div className="ig-avatar-ring">
                    <span className="ig-avatar-initial">{activeAlbum.name[0]}</span>
                  </div>
                  <div className="ig-user-details">
                    <strong className="ig-username">{activeAlbum.name}</strong>
                    <span className="ig-location">{activeAlbum.tagline} • {activeAlbum.date}</span>
                  </div>
                </div>
                <button className="ig-close-btn" onClick={closeAlbum} aria-label="Close post">
                  ✕
                </button>
              </div>

              {/* Instagram Media Viewport - Handles both 9:16 and 16:9 */}
              <div
                className="ig-media-viewport"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {activeAlbum.images && activeAlbum.images.length > 0 ? (
                  <>
                    {/* Blurred backdrop for seamless vertical/horizontal fit */}
                    <div
                      className="ig-media-backdrop"
                      style={{
                        backgroundImage: `url("${activeAlbum.images[photoIndex]?.src}")`,
                      }}
                    />
                    
                    {/* Main image with object-fit: contain to ensure zero cropping */}
                    <img
                      src={activeAlbum.images[photoIndex]?.src}
                      alt={`${activeAlbum.name} photo ${photoIndex + 1}`}
                      className="ig-main-photo"
                    />

                    {/* Left / Right Nav Arrows if multiple images */}
                    {activeAlbum.images.length > 1 && (
                      <>
                        <button
                          className="ig-nav-btn prev"
                          onClick={() => handlePrevPhoto(activeAlbum.images.length)}
                          aria-label="Previous photo"
                        >
                          ‹
                        </button>
                        <button
                          className="ig-nav-btn next"
                          onClick={() => handleNextPhoto(activeAlbum.images.length)}
                          aria-label="Next photo"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Photo index indicator */}
                    <div className="ig-index-badge">
                      {photoIndex + 1} / {activeAlbum.images.length}
                    </div>
                  </>
                ) : (
                  <div className="ig-empty-viewport">
                    <div className="ig-empty-content">
                      <div className="folder-box-badge">
                        <code>{activeAlbum.folder}</code>
                      </div>
                      <h4>Ready for {activeAlbum.name} Photos</h4>
                      <p>
                        Drop your <strong>9:16</strong> (portrait) or <strong>16:9</strong> (landscape) photos into:
                      </p>
                      <pre className="folder-code-path">
                        public/STARTS_PONGAL_25_DIWALI_25/{activeAlbum.folder.split('/').pop()}/
                      </pre>
                      <p className="ig-empty-note">
                        Once copied into that folder, they will appear right here in this Instagram carousel!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram Post Footer */}
              <div className="ig-post-footer">
                {/* Dots indicator for carousel */}
                {activeAlbum.images && activeAlbum.images.length > 1 && (
                  <div className="ig-dots-row">
                    {activeAlbum.images.map((_, i) => (
                      <span
                        key={i}
                        className={`ig-dot ${i === photoIndex ? 'active' : ''}`}
                        onClick={() => setPhotoIndex(i)}
                      />
                    ))}
                  </div>
                )}

                {/* Actions row: Like */}
                <div className="ig-actions-row">
                  <div className="ig-action-left">
                    <button
                      className="ig-action-btn like"
                      onClick={() => toggleLike(activeAlbum.id)}
                    >
                      <span className="heart-icon">♥</span>
                      <span className="like-count">{likes[activeAlbum.id] || 0}</span>
                    </button>
                    <span className="ig-post-label">{activeAlbum.images[photoIndex]?.title || activeAlbum.date}</span>
                  </div>
                  <span className="ig-album-folder-hint">{activeAlbum.images[photoIndex]?.aspect || 'Photo'}</span>
                </div>

                {/* Caption */}
                <div className="ig-caption-block">
                  <strong className="ig-caption-author">{activeAlbum.name}</strong>{' '}
                  <span className="ig-caption-text">
                    {activeAlbum.images[photoIndex]?.caption || activeAlbum.description}
                  </span>
                </div>

                {/* Thumbnails strip */}
                {activeAlbum.images && activeAlbum.images.length > 1 && (
                  <div className="ig-thumbnails-strip">
                    {activeAlbum.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.src}
                        alt={`Thumb ${idx + 1}`}
                        className={`ig-thumb ${idx === photoIndex ? 'active' : ''}`}
                        onClick={() => setPhotoIndex(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
