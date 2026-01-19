'use client'

import React, { useEffect, useState } from 'react'
import { getPendingProfiles, Profile } from '@/lib/database'
import { approveUser, rejectUser } from '@/lib/actions'
import { isAdmin } from '@/lib/clientAuth'

export function AdminPendingUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [adminAuthorized, setAdminAuthorized] = useState(false)

  useEffect(() => {
    const checkAndFetchProfiles = async () => {
      try {
        // Verify admin status first
        const isAdminUser = await isAdmin()
        if (!isAdminUser) {
          setError('Unauthorized: Admin access required')
          setLoading(false)
          return
        }

        setAdminAuthorized(true)

        // Fetch pending profiles
        const { data, error: dbError } = await getPendingProfiles()
        if (dbError) throw dbError
        setProfiles(data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load profiles')
      } finally {
        setLoading(false)
      }
    }

    checkAndFetchProfiles()
  }, [])

  const handleApprove = async (userId: string) => {
    setActionLoading(userId)
    try {
      const { data, error: actionError } = await approveUser(userId)
      if (actionError) throw actionError
      setProfiles(profiles.filter(p => p.id !== userId))
    } catch (err: any) {
      setError(err.message || 'Failed to approve user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId: string) => {
    setActionLoading(userId)
    try {
      const { error: actionError } = await rejectUser(userId)
      if (actionError) throw actionError
      setProfiles(profiles.filter(p => p.id !== userId))
    } catch (err: any) {
      setError(err.message || 'Failed to reject user')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>
  if (!adminAuthorized) return <div className="text-center py-8 text-red-600">Unauthorized access</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Pending Users ({profiles.length})</h2>
      {profiles.length === 0 ? (
        <p className="text-gray-500">No pending users</p>
      ) : (
        profiles.map(profile => (
          <div key={profile.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{profile.full_name}</h3>
                <p className="text-primary font-semibold">{profile.job_title}</p>
                <p className="text-gray-600 text-sm mt-2">{profile.email}</p>
                <p className="text-gray-600 mt-2">{profile.bio}</p>
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary font-semibold text-sm mt-2 inline-block"
                  >
                    📄 View Resume
                  </a>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleApprove(profile.id)}
                  disabled={actionLoading === profile.id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {actionLoading === profile.id ? '...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleReject(profile.id)}
                  disabled={actionLoading === profile.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                >
                  {actionLoading === profile.id ? '...' : '✗ Reject'}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
