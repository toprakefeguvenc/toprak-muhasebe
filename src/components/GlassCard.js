'use client'

import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = true, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -2, transition: { duration: 0.3 } } : {}}
      className={`glass-card p-5 md:p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
