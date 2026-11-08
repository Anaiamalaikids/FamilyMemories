import { useEffect, useRef } from 'react'
export default function Snow() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, g = c.getContext('2d'); let w, h, id
    const fit = () => { w = c.width = innerWidth; h = c.height = innerHeight }
    fit(); addEventListener('resize', fit)
    const f = Array.from({ length: 110 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2.6 + .6, s: Math.random() * .8 + .3, d: Math.random() * 6 }))
    const loop = t => {
      g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.8)'
      for (const p of f) {
        p.y += p.s; p.x += Math.sin(t / 1200 + p.d) * .4
        if (p.y > h) { p.y = -5; p.x = Math.random() * w }
        g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill()
      }
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(id); removeEventListener('resize', fit) }
  }, [])
  return <canvas ref={ref} className="snow" />
}
