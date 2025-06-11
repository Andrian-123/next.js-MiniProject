'use client'

import { SessionProvider } from 'next-auth/react'
import NavbarMenu from '@/components/section/navbar-menu'

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <NavbarMenu />
        <main className="p-4">{children}</main>
      </div>
    </SessionProvider>
  )
}
