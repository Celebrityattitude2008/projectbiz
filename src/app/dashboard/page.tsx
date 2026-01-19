'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/clientAuth'
import { getApprovedProfiles } from '@/lib/database'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/register')
        } else {
          setUser(currentUser)
        }

        // Fetch all approved profiles to show their skills
        const { data: profilesData, error } = await getApprovedProfiles()
        if (error) {
          console.error('Error fetching profiles:', error)
        } else {
          setProfiles(profilesData || [])
        }
      } catch (err) {
        console.error('Error loading data:', err)
        router.push('/register')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to BizConnect, {user?.user_metadata?.full_name || 'Professional'}!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your profile is ready. Start connecting with professionals in your network.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/directory"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">Browse Directory</h3>
          <p className="text-gray-600">
            Discover and connect with verified professionals
          </p>
        </Link>

        <Link
          href="/apply"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">Work Opportunities</h3>
          <p className="text-gray-600">
            Apply for exciting work opportunities with our partners
          </p>
        </Link>

        <Link
          href="/directory"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">Your Profile</h3>
          <p className="text-gray-600">
            View and manage your professional profile
          </p>
        </Link>
      </section>

      {/* Profile Summary */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="font-semibold text-gray-700">Email</span>
            <span className="text-gray-600">{user?.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="font-semibold text-gray-700">Full Name</span>
            <span className="text-gray-600">
              {user?.user_metadata?.full_name || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="font-semibold text-gray-700">Job Title</span>
            <span className="text-gray-600">
              {user?.user_metadata?.job_title || 'Not set'}
            </span>
          </div>
          <div className="py-3">
            <span className="font-semibold text-gray-700 block mb-2">Bio</span>
            <p className="text-gray-600">
              {user?.user_metadata?.bio || 'No bio added yet'}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-12 text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get More Out of BizConnect</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Complete your profile with skills and experience to increase your visibility and opportunities
        </p>
        <Link
          href="/directory"
          className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary"
        >
          Explore Opportunities
        </Link>
      </section>

      {/* Other Professionals' Skills */}
      {profiles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Connect with Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.full_name}</h3>
                  <p className="text-primary font-semibold mb-3">{profile.job_title}</p>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{profile.bio}</p>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {(typeof profile.skills === 'string' 
                          ? profile.skills.split(',').map((s: string) => s.trim()) 
                          : profile.skills
                        ).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                    {profile.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
