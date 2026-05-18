'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export default function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const totalSteps = 60
    const step = (end - start) / totalSteps
    let current = 0
    let stepCount = 0

    const timer = setInterval(() => {
      stepCount++
      current += step
      if (stepCount >= totalSteps) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(current)
      }
    }, (duration * 1000) / totalSteps)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}
