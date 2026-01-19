import { supabase } from '@/lib/supabase'

export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  return { data, error }
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return user
}

export async function isAdmin() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user || !user.email) {
      return false
    }

    // Get admin email from environment variable
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    
    if (!adminEmail) {
      console.warn('NEXT_PUBLIC_ADMIN_EMAIL is not configured')
      return false
    }

    // Check if current user's email matches admin email
    const isAdminUser = user.email.toLowerCase() === adminEmail.toLowerCase()
    
    return isAdminUser
  } catch (err) {
    console.error('Error checking admin status:', err)
    return false
  }
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function updateUserProfile(updates: Record<string, any>) {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: userError || new Error('No user found') }
  }

  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  })

  return { data, error }
}

