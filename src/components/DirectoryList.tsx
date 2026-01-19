'use client'

import React, { useEffect, useState } from 'react'
import { getApprovedProfiles, Profile } from '@/lib/database'

export function DirectoryList() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error: dbError } = await getApprovedProfiles()
        if (dbError) throw dbError
        setProfiles(data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load profiles')
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map(profile => (
        <div key={profile.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-gray-900">{profile.full_name}</h3>
          <p className="text-primary font-semibold mt-1">{profile.job_title}</p>
          <p className="text-gray-600 text-sm mt-3">{profile.bio}</p>
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700">Skills:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="bg-primary bg-opacity-10 text-primary text-xs px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-primary hover:text-secondary font-semibold text-sm"
            >
              📄 View Resume
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
