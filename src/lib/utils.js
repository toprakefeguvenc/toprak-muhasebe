export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatTL(n) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatShortDate(d) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}
