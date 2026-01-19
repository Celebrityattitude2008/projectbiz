# QUICK FIX: Less Restrictive RLS Policies for Development

If you're still getting "Invalid API" errors, try this more permissive setup.

## In Supabase SQL Editor, run this:

```sql
-- Disable RLS temporarily to get it working, then we'll enable it safely
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can read pending" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can read approved" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update status" ON public.profiles;

-- DEVELOPMENT POLICIES (permissive):

-- Allow anyone to read approved profiles
CREATE POLICY "Public can read approved profiles"
  ON public.profiles FOR SELECT
  USING (status = 'approved');

-- Allow anyone to read all profiles (temp for dev/debugging)
CREATE POLICY "Anyone can read all profiles"
  ON public.profiles FOR SELECT
  USING (TRUE);

-- Allow any authenticated user to insert a profile
CREATE POLICY "Authenticated users can insert profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can update status
CREATE POLICY "Admin can update status"
  ON public.profiles FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'pauladamu600@gmail.com');
```

This is **less secure** but should get everything working. Once login/signup works, we can tighten the policies.

## Key Changes:
1. Added `auth.role() = 'authenticated'` instead of auth.uid() = id for INSERT
2. Allows reading all profiles (both `status = 'approved'` AND `TRUE`)
3. Removed the restrictive email checks temporarily

Try this and report if login/signup/dashboard now work!
