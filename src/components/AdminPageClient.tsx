'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/clientAuth'

export function AdminPageClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const adminStatus = await isAdmin()
        if (!adminStatus) {
          // Not an admin, redirect to home
          router.push('/')
        } else {
          setAuthorized(true)
        }
      } catch (err) {
        console.error('Error checking admin status:', err)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Link
            href="/"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
