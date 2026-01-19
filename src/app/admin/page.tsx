import React from 'react'
import { AdminPendingUsers } from '@/components/AdminPendingUsers'
import { AdminPageClient } from '@/components/AdminPageClient'

export const metadata = {
  title: 'Admin Dashboard - BizConnect',
  description: 'Admin dashboard for approving professionals',
}

export default function AdminPage() {
  return (
    <AdminPageClient>
      <div className="py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage professional applications and approvals</p>
        </div>
        <AdminPendingUsers />
      </div>
    </AdminPageClient>
  )
}
