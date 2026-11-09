import { useState, useEffect } from 'react'
import {
  adminGetMembers,
  adminResetAllDraws,
  adminResetSingleDraw,
  adminAddMember,
  adminRemoveMember
} from './api.js'

export default function AdminPanel({ currentUser, onExit }) {
  const [adminPw, setAdminPw] = useState(() => sessionStorage.getItem('admin_pw') || '')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showResetAllModal, setShowResetAllModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [memberToReset, setMemberToReset] = useState(null)

  // Add form fields
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPhoto, setNewPhoto] = useState('/santa_shh.jpg')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const loadData = async (password) => {
    setLoading(true)
    try {
      const data = await adminGetMembers(password)
      setMembers(data)
      setIsUnlocked(true)
      sessionStorage.setItem('admin_pw', password)
      setLoginError('')
    } catch (err) {
      setLoginError(err.message || 'Incorrect admin password. Access denied.')
      setIsUnlocked(false)
    }
    setLoading(false)
  }

  // Auto-attempt unlock if password stored or if admin logged in as Sakthi
  useEffect(() => {
    if (adminPw) {
      loadData(adminPw)
    } else if (currentUser?.phone === '9344626769') {
      // Default admin password for Sakthi
      loadData('adminlogin')
      setAdminPw('adminlogin')
    }
  }, [currentUser])

  const handleUnlock = (e) => {
    e.preventDefault()
    if (!pwInput.trim()) return
    const pw = pwInput.trim()
    setAdminPw(pw)
    loadData(pw)
  }

  const handleResetAll = async () => {
    setShowResetAllModal(false)
    setLoading(true)
    try {
      await adminResetAllDraws(adminPw)
      showToast('All Secret Santa draws have been reset to fresh!')
      await loadData(adminPw)
    } catch (err) {
      showToast(err.message || 'Failed to reset draws', 'error')
    }
    setLoading(false)
  }

  const handleResetSingle = async () => {
    if (!memberToReset) return
    const target = memberToReset
    setMemberToReset(null)
    setLoading(true)
    try {
      await adminResetSingleDraw(adminPw, target.id)
      showToast(`Reset draw for ${target.name}!`)
      await loadData(adminPw)
    } catch (err) {
      showToast(err.message || 'Failed to reset draw', 'error')
    }
    setLoading(false)
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    if (!newName.trim() || !newPhone.trim() || !newPassword.trim()) {
      showToast('Please fill in name, phone, and password', 'error')
      return
    }
    setLoading(true)
    try {
      await adminAddMember(adminPw, {
        name: newName,
        phone: newPhone,
        password: newPassword,
        photo: newPhoto
      })
      showToast(`Added ${newName} to the database!`)
      setShowAddModal(false)
      setNewName('')
      setNewPhone('')
      setNewPassword('')
      await loadData(adminPw)
    } catch (err) {
      showToast(err.message || 'Failed to add member', 'error')
    }
    setLoading(false)
  }

  const handleDeleteMember = async () => {
    if (!memberToDelete) return
    const target = memberToDelete
    setMemberToDelete(null)
    setLoading(true)
    try {
      await adminRemoveMember(adminPw, target.id)
      showToast(`Removed ${target.name} from database.`)
      await loadData(adminPw)
    } catch (err) {
      showToast(err.message || 'Failed to remove member', 'error')
    }
    setLoading(false)
  }

  const drawnCount = members.filter((m) => m.has_drawn).length
  const pendingCount = members.length - drawnCount

  const getDaysLeft = () => {
    const now = new Date()
    const christmas = new Date(now.getFullYear(), 11, 25, 0, 0, 0)
    if (now > christmas) christmas.setFullYear(now.getFullYear() + 1)
    const diffTime = christmas - now
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getReminderMsg = (name) => {
    const days = getDaysLeft()
    return `Hey ${name}! Don't forget to prepare for the gift just ${days} days more you know someone betrayed someone else in the past so make sure you don't repeat same as them :)\n\nPortal: https://family-memories-inky.vercel.app/`
  }

  const sendWhatsApp = (member) => {
    const text = getReminderMsg(member.name)
    const url = `https://wa.me/91${member.phone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleBroadcastShare = async () => {
    const days = getDaysLeft()
    const text = `Don't forget to prepare for the gift just ${days} days more you know someone betrayed someone else in the past so make sure you don't repeat same as them :)\n\nPortal: https://family-memories-inky.vercel.app/`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Secret Santa Reminder',
          text: text,
        })
        showToast('Shared to WhatsApp successfully!', 'success')
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(text)
          showToast('Copied to clipboard! Open WhatsApp and paste.', 'success')
        }
      }
    } else {
      navigator.clipboard.writeText(text)
      showToast('Copied to clipboard! Open WhatsApp and paste into Broadcast List.', 'success')
    }
  }

  const handleCopyBroadcast = () => {
    const days = getDaysLeft()
    const text = `Don't forget to prepare for the gift just ${days} days more you know someone betrayed someone else in the past so make sure you don't repeat same as them :)\n\nPortal: https://family-memories-inky.vercel.app/`
    navigator.clipboard.writeText(text)
    showToast('Message copied! Open WhatsApp Broadcast List and paste.', 'success')
  }

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      m.name?.toLowerCase().includes(q) ||
      m.phone?.includes(q) ||
      m.target_name?.toLowerCase().includes(q)
    )
  })

  // Available elf photos for easy dropdown selection
  const elfPhotos = [
    { label: 'Santa Shh (Default)', url: '/santa_shh.jpg' },
    { label: 'Aadhi', url: '/elves/aadhi.jpg' },
    { label: 'Sreedharan', url: '/elves/sreedharan.jpg' },
    { label: 'Brinda', url: '/elves/brinda.jpg' },
    { label: 'Sathya', url: '/elves/sathya.jpg' },
    { label: 'Shruthi', url: '/elves/shruthi.jpg' },
    { label: 'Swarna Akshita', url: '/elves/achu.jpg' },
    { label: 'Sailoga Prakash', url: '/elves/sailoga.jpg' },
    { label: 'Aadhu', url: '/elves/aadhu.jpg' },
    { label: 'Sarath Vikram', url: '/elves/sarath.jpg' },
    { label: 'Srenithi', url: '/elves/srenithi.jpg' },
    { label: 'Sakthi', url: '/elves/sakthi.jpg' },
  ]

  return (
    <section className="admin-section" id="admin">
      <div className="admin-container">
        {/* Header Bar */}
        <div className="admin-header-row">
          <div>
            <div className="badge-pill">Admin Console</div>
            <h1 className="admin-title">Secret Santa Control Panel</h1>
            <p className="admin-subtitle">
              Manage members, monitor live draws, and reset assignments directly from your phone.
            </p>
          </div>
          <button className="admin-exit-btn" onClick={onExit}>
            ← Back to Portal
          </button>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* LOCKED STATE: Password Gate */}
        {!isUnlocked ? (
          <div className="admin-gate-card">
            <div className="gate-icon">🔐</div>
            <h2>Admin Authentication</h2>
            <p>Enter the admin password to unlock management controls.</p>

            <form onSubmit={handleUnlock} className="gate-form">
              <input
                type="password"
                placeholder="Enter Admin Password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                autoFocus
                className="admin-input"
              />
              <button type="submit" className="admin-btn primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Unlock Admin Panel'}
              </button>
            </form>

            {loginError && <p className="admin-error-text">{loginError}</p>}
          </div>
        ) : (
          /* UNLOCKED STATE: Full Admin Dashboard */
          <>
            {/* Live Stats Row */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="stat-label">Total Participating Members</span>
                <span className="stat-value">{members.length}</span>
                <span className="stat-sub">Registered in database</span>
              </div>
              <div className="admin-stat-card success">
                <span className="stat-label">Draws Completed</span>
                <span className="stat-value">{drawnCount}</span>
                <span className="stat-sub">
                  {members.length > 0 ? Math.round((drawnCount / members.length) * 100) : 0}% completed
                </span>
              </div>
              <div className="admin-stat-card pending">
                <span className="stat-label">Pending Draws</span>
                <span className="stat-value">{pendingCount}</span>
                <span className="stat-sub">Haven't logged in yet</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="admin-actions-bar">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name, phone or target..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="action-buttons-group">
                <button
                  className="admin-btn secondary"
                  onClick={() => loadData(adminPw)}
                  disabled={loading}
                  title="Reload live database data"
                >
                  ↻ Refresh
                </button>
                <button
                  className="admin-btn primary"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Member
                </button>
                <button
                  className="admin-btn whatsapp-btn"
                  onClick={() => setShowReminderModal(true)}
                  title="Open Monday 2:00 PM WhatsApp Reminders"
                >
                  📱 WhatsApp Reminders
                </button>
                <button
                  className="admin-btn danger"
                  onClick={() => setShowResetAllModal(true)}
                  disabled={loading}
                >
                  🔄 Reset All Draws
                </button>
              </div>
            </div>

            {/* Members List Cards */}
            <div className="admin-members-grid">
              {filteredMembers.map((m) => (
                <div key={m.id} className="admin-member-card">
                  <div className="member-top-info">
                    <img
                      src={m.photo_url || '/santa_shh.jpg'}
                      alt={m.name}
                      className="admin-avatar-img"
                      onError={(e) => {
                        e.target.src = '/santa_shh.jpg'
                      }}
                    />
                    <div className="member-details">
                      <h3 className="admin-member-name">{m.name}</h3>
                      <span className="admin-member-phone">📞 {m.phone}</span>
                    </div>
                  </div>

                  <div className="member-draw-status">
                    {m.has_drawn ? (
                      <div className="status-badge drawn">
                        <span className="status-dot green" />
                        <span>Gifting: <strong>{m.target_name || 'Assigned'}</strong></span>
                      </div>
                    ) : (
                      <div className="status-badge pending">
                        <span className="status-dot gray" />
                        <span>Pending (Not drawn yet)</span>
                      </div>
                    )}
                  </div>

                  <div className="member-card-footer">
                    <button
                      className="card-action-btn remind"
                      onClick={() => sendWhatsApp(m)}
                      title={`Send WhatsApp reminder to ${m.name}`}
                    >
                      📲 Remind
                    </button>
                    {m.has_drawn && (
                      <button
                        className="card-action-btn reset"
                        onClick={() => setMemberToReset(m)}
                        title="Reset this member's draw"
                      >
                        Reset Draw
                      </button>
                    )}
                    <button
                      className="card-action-btn delete"
                      onClick={() => setMemberToDelete(m)}
                      title="Remove member from database"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="no-members-found">
                  <p>No members found matching your search.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* MODAL: Add New Member */}
        {showAddModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Family Member</h3>
                <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="modal-form">
                <label className="modal-field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </label>

                <label className="modal-field">
                  <span>Mobile Number (Login ID)</span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </label>

                <label className="modal-field">
                  <span>Password</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. holiday2026"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>

                <label className="modal-field">
                  <span>Profile Photo</span>
                  <select value={newPhoto} onChange={(e) => setNewPhoto(e.target.value)}>
                    {elfPhotos.map((p) => (
                      <option key={p.url} value={p.url}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="admin-btn secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add to Database'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Confirm Reset All Draws */}
        {showResetAllModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowResetAllModal(false)}>
            <div className="admin-modal-card alert" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>⚠️ Reset All Secret Santa Draws?</h3>
                <button className="modal-close-btn" onClick={() => setShowResetAllModal(false)}>
                  ✕
                </button>
              </div>

              <p className="modal-body-text">
                This will reset the <code>giving_to</code> status of <strong>all {members.length} members</strong> back to empty.
                Everyone will get to draw a fresh secret target the next time they log in.
              </p>

              <div className="modal-actions">
                <button
                  className="admin-btn secondary"
                  onClick={() => setShowResetAllModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="admin-btn danger"
                  onClick={handleResetAll}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Yes, Reset All Draws'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Confirm Single Member Reset */}
        {memberToReset && (
          <div className="admin-modal-backdrop" onClick={() => setMemberToReset(null)}>
            <div className="admin-modal-card alert" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Reset Draw for {memberToReset.name}?</h3>
                <button className="modal-close-btn" onClick={() => setMemberToReset(null)}>
                  ✕
                </button>
              </div>

              <p className="modal-body-text">
                Currently gifting <strong>{memberToReset.target_name || 'someone'}</strong>.
                Resetting will clear their target so they can draw again.
              </p>

              <div className="modal-actions">
                <button
                  className="admin-btn secondary"
                  onClick={() => setMemberToReset(null)}
                >
                  Cancel
                </button>
                <button
                  className="admin-btn danger"
                  onClick={handleResetSingle}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Draw'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Confirm Delete Member */}
        {memberToDelete && (
          <div className="admin-modal-backdrop" onClick={() => setMemberToDelete(null)}>
            <div className="admin-modal-card alert" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Remove {memberToDelete.name}?</h3>
                <button className="modal-close-btn" onClick={() => setMemberToDelete(null)}>
                  ✕
                </button>
              </div>

              <p className="modal-body-text">
                Are you sure you want to remove <strong>{memberToDelete.name}</strong> ({memberToDelete.phone}) from the database?
                Any assignment linking to them will also be cleared.
              </p>

              <div className="modal-actions">
                <button
                  className="admin-btn secondary"
                  onClick={() => setMemberToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="admin-btn danger"
                  onClick={handleDeleteMember}
                  disabled={loading}
                >
                  {loading ? 'Removing...' : 'Delete Member'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Monday WhatsApp Reminders Broadcast */}
        {showReminderModal && (
          <div className="admin-modal-backdrop" onClick={() => setShowReminderModal(false)}>
            <div className="admin-modal-card reminder-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📱</span> Monday 2:00 PM WhatsApp Broadcast
                  </h3>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: 'var(--gold)' }}>
                    Countdown: <strong>{getDaysLeft()} days left</strong> until Christmas Reveal
                  </p>
                </div>
                <button className="modal-close-btn" onClick={() => setShowReminderModal(false)}>
                  ✕
                </button>
              </div>

              <div className="reminder-preview-box">
                <span className="preview-label">Live Message Preview:</span>
                <p className="preview-text">{getReminderMsg('{Name}')}</p>
              </div>

              {/* 1-Click Broadcast Actions */}
              <div className="broadcast-quick-actions">
                <button
                  className="admin-btn whatsapp-broadcast-all-btn"
                  onClick={handleBroadcastShare}
                >
                  🚀 Send to Everyone (1-Click)
                </button>
                <button
                  className="admin-btn copy-broadcast-btn"
                  onClick={handleCopyBroadcast}
                >
                  📋 Copy Message for Broadcast List
                </button>
              </div>

              <div className="broadcast-tip-card">
                <strong>💡 Send to All in 1 Click via WhatsApp:</strong>
                <p>
                  In your mobile WhatsApp: Tap <strong>⋮ Menu → New Broadcast</strong>, select your 11 family members, and name it <em>Secret Santa 2026</em>.
                  Now tapping <strong>"Send to Everyone"</strong> or pasting there delivers this message to all 11 people individually in one single click!
                </p>
              </div>

              <div className="reminder-list-header">
                <span>Or message members individually:</span>
              </div>

              <div className="reminder-members-list">
                {members.map((m) => (
                  <div key={m.id} className="reminder-member-row">
                    <div className="reminder-member-info">
                      <span className="reminder-name">{m.name}</span>
                      <span className="reminder-phone">📞 {m.phone}</span>
                    </div>
                    <button
                      className="admin-btn whatsapp-send-btn"
                      onClick={() => sendWhatsApp(m)}
                    >
                      Open WhatsApp ↗
                    </button>
                  </div>
                ))}
              </div>

              <div className="modal-actions" style={{ marginTop: '1.2rem' }}>
                <button
                  className="admin-btn secondary"
                  onClick={() => setShowReminderModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
