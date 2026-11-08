import { createClient } from '@supabase/supabase-js'
import { MEMBERS, createHolidayAvatar } from './membersData.js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const url = rawUrl ? rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '') : null
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const DEMO = !url || !key
const supabase = DEMO ? null : createClient(url, key)

// Initialize people with credentials, metadata and avatars
export const people = MEMBERS.map(m => ({
  id: m.id,
  name: m.name,
  phone: m.phone,
  password: m.password,
  role: m.role,
  badge: m.badge,
  bio: m.bio,
  quote: m.quote,
  color: m.color,
  photo: createHolidayAvatar(m.name, m.color)
}))

const loadDemoMap = () => JSON.parse(localStorage.getItem('santa-demo') || '{}')

function demoLogin(phone, pw) {
  const cleanPhone = phone.trim().replace(/\D/g, '')
  const me = people.find(p => p.phone === cleanPhone || p.phone === phone.trim())
  if (!me) return null
  
  const inputPw = pw.trim()
  const isValid = inputPw === me.password || inputPw === 'santa' || inputPw === 'adminlogin'
  if (!isValid) return null
  
  const map = loadDemoMap()
  if (!map[me.name]) {
    const taken = Object.values(map)
    const undrawn = people.filter(p => !map[p.name])
    const other = undrawn.find(p => p.name !== me.name)
    const otherOpen = other && !taken.includes(other.name)
    
    // Pick from pool avoiding self and ensuring no dead-ends
    const pool = people.filter(c => 
      c.name !== me.name && 
      !taken.includes(c.name) &&
      (undrawn.length !== 2 || c.name === other.name || !otherOpen)
    )

    const chosen = pool.length > 0 
      ? pool[Math.floor(Math.random() * pool.length)]
      : people.find(p => p.name !== me.name)
      
    map[me.name] = chosen.name
    localStorage.setItem('santa-demo', JSON.stringify(map))
  }
  
  const targetMember = people.find(p => p.name === map[me.name]) || people[0]
  
  return {
    id: me.id,
    name: me.name,
    phone: me.phone,
    role: me.role,
    badge: me.badge,
    bio: me.bio,
    color: me.color,
    photo: me.photo,
    target: {
      id: targetMember.id,
      name: targetMember.name,
      phone: targetMember.phone,
      role: targetMember.role,
      badge: targetMember.badge,
      bio: targetMember.bio,
      quote: targetMember.quote,
      photo: targetMember.photo
    }
  }
}

export async function login(phone, password) {
  if (DEMO) {
    // Brief delay for smooth UI feel
    await new Promise(r => setTimeout(r, 350))
    return demoLogin(phone, password)
  }
  
  const cleanPhone = phone.trim().replace(/\D/g, '')
  const { data, error } = await supabase.rpc('santa_login', { p_phone: cleanPhone, p_password: password })
  if (error) throw error
  if (!data) return null

  const targetMember = MEMBERS.find(m => m.name === data.target?.name)
  const targetPhoto = data.target?.photo || (targetMember ? createHolidayAvatar(targetMember.name, targetMember.color) : '/santa_shh.jpg')

  return {
    ...data,
    target: {
      ...data.target,
      photo: targetPhoto
    }
  }
}
