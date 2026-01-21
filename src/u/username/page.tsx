import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        {/* Availability Badge */}
        {profile.availability_status === 'available' && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1 rounded-full border border-green-100 mb-6">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-widest">Available Now</span>
          </div>
        )}

        <h1 className="text-4xl font-black text-gray-900 mb-2">{profile.full_name}</h1>
        <p className="text-xl text-blue-600 font-medium mb-8">{profile.job_title}</p>
        
        <p className="text-gray-500 mb-10 leading-relaxed">
          {profile.bio_description}
        </p>

        <div className="space-y-4">
          <a 
            href={profile.resume_url} 
            target="_blank"
            className="block w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl"
          >
            📄 View Full Resume
          </a>
          
          <a 
            href={`tel:${profile.phone_number}`}
            className="block w-full py-5 border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition"
          >
            📞 Contact Directly
          </a>
        </div>

        <p className="mt-12 text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
          BizConnect Professional Identity
        </p>
      </div>
    </div>
  )
}