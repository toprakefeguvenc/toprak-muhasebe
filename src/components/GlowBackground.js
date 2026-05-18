'use client'

import { useEffect, useRef } from 'react'

export default function GlowBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const blobs = container.querySelectorAll('.bg-glow')
    let mouseX = 0, mouseY = 0

    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 40
      mouseY = (e.clientY / window.innerHeight - 0.5) * 40
      blobs.forEach((blob, i) => {
        const speed = (i + 1) * 0.3
        blob.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`
      })
    }

    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ perspective: '1000px' }}>
      <div className="bg-glow glow-emerald animate-glow" style={{ width: '600px', height: '600px', top: '-10%', left: '-5%' }} />
      <div className="bg-glow glow-blue animate-glow" style={{ width: '500px', height: '500px', bottom: '-5%', right: '-5%', animationDelay: '2s' }} />
      <div className="bg-glow glow-purple animate-glow" style={{ width: '400px', height: '400px', top: '40%', left: '50%', animationDelay: '4s' }} />
      <div className="bg-glow glow-emerald animate-glow" style={{ width: '300px', height: '300px', top: '60%', left: '10%', animationDelay: '1s', opacity: 0.3 }} />
      <div className="bg-glow glow-blue animate-glow" style={{ width: '350px', height: '350px', top: '15%', right: '20%', animationDelay: '3s', opacity: 0.25 }} />
      <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.02) 0%, transparent 50%)' }} />
    </div>
  )
}
