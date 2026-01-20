'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [myProfile, setMyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Function to handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // Send user back to home page after logout
    router.refresh() // Force a refresh to clear any cached data
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          router.push('/register')
          return
        }
        setUser(authUser)

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        setMyProfile(profileData)
      } catch (err) {
        console.error('Dashboard Error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router])

  if (loading) return <div className="text-center py-20">Loading Dashboard...</div>

  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      {/* Top Navigation / Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {myProfile?.full_name || 'Professional'}!
          </h1>
          <p className="text-xl text-gray-600">
            Status: <span className="text-green-600 font-bold uppercase">{myProfile?.status || 'Active'}</span>
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-100 transition"
        >
          Log Out
        </button>
      </div>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/directory" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-bold text-lg">Browse Directory</h3>
          <p className="text-sm text-gray-500">Connect with others</p>
        </Link>

        <Link href="/register" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <div className="text-3xl mb-2">✏️</div>
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <p className="text-sm text-gray-500">Update your details</p>
        </Link>

        <div className="bg-blue-600 p-6 rounded-xl shadow-sm text-white">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="font-bold text-lg">Resume Live</h3>
          <p className="text-sm opacity-90">Your resume is visible to employers</p>
        </div>
      </section>

      {/* Profile Details Card */}
      <section className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Professional Card</h2>
          {myProfile?.resume_url && (
            <a href={myProfile.resume_url} target="_blank" className="text-blue-600 text-sm font-bold hover:underline">
              View Uploaded PDF →
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
              <p className="text-lg font-medium text-gray-800">{myProfile?.full_name || '---'}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Job Title</label>
              <p className="text-lg font-medium text-gray-800">{myProfile?.job_title || '---'}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
              <p className="text-lg font-medium text-gray-800">{myProfile?.phone_number || '---'}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Professional Bio</label>
            <p className="text-gray-600 leading-relaxed mt-1">
              {myProfile?.bio_description || 'No bio added yet.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}