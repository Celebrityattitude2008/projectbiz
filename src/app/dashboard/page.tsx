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
  const [copied, setCopied] = useState(false)

  // 1. UPDATE AVAILABILITY LOGIC
  const updateAvailability = async (newStatus: 'available' | 'unavailable') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          availability_status: newStatus,
          last_status_update: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      setMyProfile({ ...myProfile, availability_status: newStatus })
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  // 2. COPY LINK LOGIC
  const copyToClipboard = () => {
    const link = `${window.location.origin}/u/${myProfile.username}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
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

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">Loading Professional Suite...</div>

  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Hi, {myProfile?.full_name?.split(' ')[0] || 'Professional'}!
          </h1>
          <p className="text-lg text-gray-500">
            Account: <span className="text-green-600 font-bold uppercase tracking-widest text-sm bg-green-50 px-3 py-1 rounded-full">{myProfile?.status || 'Active'}</span>
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition"
        >
          Sign Out
        </button>
      </div>

      {/* THE HOOK: LIVE STATUS BOARD */}
      <section className="mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            {myProfile?.availability_status === 'available' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${myProfile?.availability_status === 'available' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Live Availability</h3>
            <p className="text-sm text-gray-500">Recruiters see your live status in the directory.</p>
          </div>
        </div>
        
        <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
          <button 
            onClick={() => updateAvailability('available')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${myProfile?.availability_status === 'available' ? 'bg-white text-green-600 shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
          >
            AVAILABLE
          </button>
          <button 
            onClick={() => updateAvailability('unavailable')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${myProfile?.availability_status === 'unavailable' ? 'bg-white text-gray-600 shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
          >
            BUSY
          </button>
        </div>
      </section>

      {/* THE HOOK: PROFESSIONAL LINK */}
      {myProfile?.username && (
        <section className="mb-10 bg-gray-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Your Personal Resume Link</h3>
            <p className="text-gray-400 text-sm mb-4 md:mb-0">A clean, high-speed landing page for your career.</p>
          </div>
          <div className="relative z-10 flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/10 w-full md:w-auto">
            <span className="px-4 py-2 font-mono text-xs text-blue-300 truncate max-w-[180px]">
              /u/{myProfile.username}
            </span>
            <button 
              onClick={copyToClipboard}
              className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:bg-blue-50'}`}
            >
              {copied ? 'COPIED!' : 'COPY LINK'}
            </button>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </section>
      )}

      {/* Navigation Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/directory" className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">🌍</div>
          <h3 className="font-bold text-xl mb-1 text-gray-900">Global Directory</h3>
          <p className="text-sm text-gray-500 italic">Browse professionals and make connections.</p>
        </Link>

        <Link href="/register" className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">⚙️</div>
          <h3 className="font-bold text-xl mb-1 text-gray-900">Manage Identity</h3>
          <p className="text-sm text-gray-500 italic">Update your resume, bio, and title.</p>
        </Link>
      </section>

      {/* Resume Card Preview */}
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Public Card Preview</h2>
          {myProfile?.resume_url && (
            <a href={myProfile.resume_url} target="_blank" className="flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 text-xs font-black uppercase rounded-full hover:bg-blue-100 transition tracking-widest">
              <span>View PDF</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1 space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Full Identity</label>
              <p className="text-lg font-bold text-gray-800">{myProfile?.full_name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Current Role</label>
              <p className="text-lg font-bold text-blue-600">{myProfile?.job_title || 'Not set'}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Contact</label>
              <p className="text-md font-medium text-gray-700">{myProfile?.phone_number || '---'}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Professional Narrative</label>
            <p className="text-gray-600 leading-relaxed text-lg italic">
              "{myProfile?.bio_description || 'You haven\'t written a bio yet. Click Edit Profile to add one.'}"
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}