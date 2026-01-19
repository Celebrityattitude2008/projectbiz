'use server'

import { supabase } from '@/lib/supabase'

// Admin authentication check
export async function isAdmin(email: string): Promise<boolean> {
  const adminEmail: string | undefined = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  return email === adminEmail
}

// Approve user (Server Action)
export async function approveUser(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

// Reject user (Server Action)
export async function rejectUser(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

// Sign up user
export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  return { data, error }
}

// Sign in user
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

// Sign out user
export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
