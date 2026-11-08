// Lightweight Christmas Confetti Burst
export function launchChristmasConfetti() {
  const canvas = document.createElement('canvas')
  canvas.id = 'festive-confetti-canvas'
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  let width = (canvas.width = window.innerWidth)
  let height = (canvas.height = window.innerHeight)

  const colors = [
    '#f6c453', // Gold
    '#e53935', // Holiday Red
    '#2e7d32', // Pine Green
    '#ffffff', // Snow White
    '#42a5f5', // Ice Blue
    '#ff80ab', // Candy Pink
  ]

  const pieces = []
  const count = 150

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2,
      vx: (Math.random() - 0.5) * 22,
      vy: Math.random() * -20 - 8,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.3 ? 'rect' : 'circle',
      opacity: 1,
    })
  }

  let animationFrame
  const startTime = Date.now()

  function update() {
    const elapsed = Date.now() - startTime
    ctx.clearRect(0, 0, width, height)

    for (let p of pieces) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.45 // gravity
      p.vx *= 0.985 // drag
      p.rotation += p.vRot
      if (elapsed > 2000) {
        p.opacity = Math.max(0, p.opacity - 0.02)
      }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    if (elapsed < 4500) {
      animationFrame = requestAnimationFrame(update)
    } else {
      cancelAnimationFrame(animationFrame)
      canvas.remove()
    }
  }

  animationFrame = requestAnimationFrame(update)
}
