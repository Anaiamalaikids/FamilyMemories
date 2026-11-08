import { useState } from 'react'
import { MEMBERS, createHolidayAvatar } from './membersData.js'

export default function Members() {
  const [search, setSearch] = useState('')

  const filteredMembers = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.badge.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="members-section" id="members">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">The 11 Family Members</div>
          <h2 className="section-title">Members & Personalities</h2>
          <p className="section-sub">
            The 11 members taking part in our gift exchange. Find out each person’s role, funny habits, and personality.
          </p>
        </div>

        {/* Search Bar */}
        <div className="members-search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or role (e.g., Kamal, Cookie, Alex)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* 11 Members Grid */}
        <div className="members-grid">
          {filteredMembers.map((member) => {
            const avatarUrl = createHolidayAvatar(member.name, member.color)
            return (
              <div
                key={member.id}
                className="member-card"
                style={{ '--member-color': member.color }}
              >
                <div className="card-top-accent" />
                
                <div className="member-avatar-wrapper">
                  <img
                    src={avatarUrl}
                    alt={member.name}
                    className="member-avatar-img"
                  />
                  <span className="member-badge-pill">{member.badge}</span>
                </div>

                <div className="member-content">
                  <div className="member-header-row">
                    <h3 className="member-name">{member.name}</h3>
                    <span className="member-id-tag">Member #{member.id}</span>
                  </div>

                  <div className="member-role-title">
                    {member.role}
                  </div>
                  {member.subtitle && (
                    <div className="member-subtitle">
                      {member.subtitle}
                    </div>
                  )}

                  <p className="member-bio">{member.bio}</p>

                  <div className="member-quote-box">
                    <span className="quote-mark">“</span>
                    <p className="quote-text">{member.quote}</p>
                    <span className="quote-mark">”</span>
                  </div>

                  <div className="member-card-footer">
                    <div className="status-badge">
                      <span className="status-dot green" />
                      <span>{member.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="no-members-found">
            <p>No members found matching "{search}".</p>
            <button className="reset-btn" onClick={() => setSearch('')}>Show All 11 Members</button>
          </div>
        )}
      </div>
    </section>
  )
}
