import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import '@/globals.css'

export const metadata = {
  title: 'BizConnect - Connect with Top Professionals',
  description: 'Find and connect with approved professionals in your network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
