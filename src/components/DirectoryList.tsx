'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function DirectoryList() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfiles() {
      // 1. UPDATED QUERY: We now select projects linked to each profile
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          projects (*)
        `)
        .eq('status', 'approved')
        .order('availability_status', { ascending: true }) 
        .order('created_at', { ascending: false })

      if (!error) {
        setProfiles(data || [])
        setFilteredProfiles(data || [])
      }
      setLoading(false)
    }
    fetchProfiles()
  }, [])

  useEffect(() => {
    let results = profiles.filter(profile =>
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio_description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (showOnlyAvailable) {
      results = results.filter(p => p.availability_status === 'available')
    }

    setFilteredProfiles(results)
  }, [searchTerm, profiles, showOnlyAvailable])

  if (loading) return <div className="text-center py-10 text-gray-500 font-medium">Scanning live professionals...</div>

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Search & Filter Header */}
      <div className="mb-10 flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, role, or keywords..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-all font-bold text-sm ${
            showOnlyAvailable 
            ? 'bg-green-600 border-green-600 text-white shadow-lg' 
            : 'bg-white border-gray-100 text-gray-600 hover:border-green-400'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${showOnlyAvailable ? 'bg-white animate-pulse' : 'bg-green-500'}`}></span>
          {showOnlyAvailable ? 'Showing Available Only' : 'Show Available Now'}
        </button>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <div 
            key={profile.id} 
            className={`flex flex-col relative bg-white p-6 rounded-3xl shadow-sm border-2 transition-all hover:shadow-md ${
              profile.availability_status === 'available' ? 'border-green-50' : 'border-gray-50'
            }`}
          >
            {/* Live Indicator */}
            {profile.availability_status === 'available' && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                <span className="h-1.5 w-1.5 bg-green-600 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">Live Now</span>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 pr-20">{profile.full_name}</h3>
            <p className="text-blue-600 font-bold mb-3 text-sm">{profile.job_title}</p>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {profile.bio_description || "No description provided."}
            </p>

            {/* 2. SKILL PROOF: PROJECT GALLERY SECTION */}
            {profile.projects && profile.projects.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Proof of Work</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {profile.projects.map((project: any) => (
                    <div key={project.id} className="group relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                        <span className="text-[8px] text-white font-bold text-center leading-tight">{project.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              {profile.resume_url ? (
                <a 
                  href={profile.resume_url} 
                  target="_blank" 
                  className="text-sm font-bold text-gray-900 hover:text-blue-600 transition flex items-center gap-2"
                >
                  <span className="bg-gray-100 p-1.5 rounded-lg text-lg">📄</span>
                  Resume
                </a>
              ) : (
                <span className="text-xs text-gray-400 italic">No resume</span>
              )}
              
              {profile.username && (
                <a href={`/u/${profile.username}`} className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition">
                  Full Card →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProfiles.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">No professionals match your search criteria.</p>
        </div>
      )}
    </div>
  )
}