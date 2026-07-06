import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../context/CartContext'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PT. Cipta Sama Abadi - Solusi Pakan Unggas',
  description: 'Platform e-commerce untuk pakan unggas berkualitas dengan rekomendasi AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" duration={3000} />
        </CartProvider>
      </body>
    </html>
  )
}