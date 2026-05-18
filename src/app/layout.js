import { Geist } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata = {
  title: "Toprak Muhasebe | Premium Finans Yönetimi",
  description: "Profesyonel damacana su satış takip ve muhasebe platformu",
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={geist.className}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
