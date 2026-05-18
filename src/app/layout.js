import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'Toprak Muhasebe',
  description: 'Damacana Su Satış Takip Sistemi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <nav className="bg-blue-700 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="font-bold text-lg">Toprak Muhasebe</Link>
              <div className="flex gap-6 text-sm font-medium">
                <Link href="/" className="hover:text-blue-200 transition">Ana Sayfa</Link>
                <Link href="/gunluk" className="hover:text-blue-200 transition">Günlük Giriş</Link>
                <Link href="/musteriler" className="hover:text-blue-200 transition">Müşteriler</Link>
                <Link href="/raporlar" className="hover:text-blue-200 transition">Raporlar</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
