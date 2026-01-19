import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  full_name: string
  email: string
  job_title: string
  bio?: string
  skills?: string[]
  resume_url?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

// Create a new profile
export async function createProfile(data: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert([{ ...data, status: 'pending' }])
    .select()
    .single()

  return { profile, error }
}

// Get all pending profiles (Admin only)
export async function getPendingProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return { data, error }
}

// Get all approved profiles (Public)
export async function getApprovedProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return { data, error }
}

// Get user profile by ID
export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

// Update profile status (Admin only)
export async function updateProfileStatus(id: string, status: 'approved' | 'rejected') {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

// Upload resume to storage
export async function uploadResume(file: File, userId: string) {
  const filename = `${userId}/${file.name}`
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(filename, file)

  return { data, error }
}

// Get public resume URL
export function getResumeUrl(path: string) {
  const { data } = supabase.storage.from('resumes').getPublicUrl(path)
  return data?.publicUrl || ''
}
