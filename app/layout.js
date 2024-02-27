import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BTM Studio Home Page',
  description: 'by Elias Montilla',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



