'use client'

import { SessionProvider } from 'next-auth/react'
import { SidebarProvider } from '@/components/ui/sidebar'
import MenuDashboard from '@/components/section/menu-dashboard'
import { Gauge } from 'lucide-react'
import React from 'react'

const menuItems = [
  {
    title: 'Dashboard',
    url: '/job-seeker',
    icon: Gauge,
  },
]

export default function JobSeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <MenuDashboard items={menuItems}>{children}</MenuDashboard>
      </SidebarProvider>
    </SessionProvider>
  )
}
