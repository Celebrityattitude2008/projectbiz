'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function DirectoryList() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!error) {
        setProfiles(data || [])
        setFilteredProfiles(data || [])
      }
      setLoading(false)
    }
    fetchProfiles()
  }, [])

  // Handle Search Filtering
  useEffect(() => {
    const results = profiles.filter(profile =>
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio_description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProfiles(results)
  }, [searchTerm, profiles])

  if (loading) return <div className="text-center py-10 text-gray-500">Loading professionals...</div>

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Search Bar Section */}
      <div className="mb-10 max-w-md mx-auto">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, role, or keywords..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Showing {filteredProfiles.length} professional{filteredProfiles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-xl font-bold text-gray-900">{profile.full_name}</h3>
            <p className="text-blue-600 font-semibold mb-3">{profile.job_title}</p>
            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
              {profile.bio_description || "No description provided."}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              {profile.resume_url ? (
                <a 
                  href={profile.resume_url} 
                  target="_blank" 
                  className="text-sm font-bold text-gray-900 hover:text-blue-600 transition flex items-center gap-1"
                >
                  📄 View Resume
                </a>
              ) : (
                <span className="text-xs text-gray-400 italic">No resume</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProfiles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No professionals match your search.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-blue-600 font-bold mt-2"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}