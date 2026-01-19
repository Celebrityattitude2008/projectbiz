# CRITICAL: Complete Supabase Setup Checklist

## The Problem
Your login/signup/dashboard is showing "Invalid API" errors. This is likely because:
1. The `profiles` table doesn't exist in Supabase
2. RLS (Row Level Security) policies are blocking access
3. Authentication policies are misconfigured

## STEP 1: Verify Supabase Project
Go to https://supabase.com and open your project

Copy your credentials:
- Project URL: https://klvbjndadtvstjcmarhc.supabase.co
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdmJqbmRhZHR2c3RqY21hcmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Njc5OTksImV4cCI6MjA4NDM0Mzk5OX0.2K4XNHefvJIMbdGOflj6nkGsMM9xCtyJBLyEdJ4CDbU

## STEP 2: Create Tables in Supabase
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste ALL of the following SQL:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT auth.uid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  bio TEXT,
  skills TEXT[],
  resume_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS profiles_status_idx ON profiles(status);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at DESC);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (prevents duplicate errors)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can read pending" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can read approved" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update status" ON public.profiles;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Admin can read all pending profiles
CREATE POLICY "Admin can read pending" ON public.profiles
  FOR SELECT USING (auth.jwt() ->> 'email' = 'pauladamu600@gmail.com');

-- Policy 3: Anyone can read approved profiles
CREATE POLICY "Anyone can read approved" ON public.profiles
  FOR SELECT USING (status = 'approved');

-- Policy 4: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 5: Admin can update status
CREATE POLICY "Admin can update status" ON public.profiles
  FOR UPDATE USING (auth.jwt() ->> 'email' = 'pauladamu600@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'pauladamu600@gmail.com');

-- Optional: Policy to allow public to view everything (if too restrictive)
-- CREATE POLICY "Public can read approved" ON public.profiles
--   FOR SELECT USING (TRUE);
```

4. Click **Run** button

## STEP 3: Create Storage Bucket for Resumes
1. In Supabase, go to **Storage**
2. Click **Create a new bucket**
3. Name it: `resumes`
4. **IMPORTANT**: Make it **Public**
5. Click **Create bucket**

## STEP 4: Enable Authentication
1. Go to **Authentication > Settings**
2. Scroll down to **Email**
3. Make sure **Email Confirmation** is toggled as needed
4. For testing, you can disable it temporarily (toggle OFF)

## STEP 5: Test Login/Signup
1. Stop your dev server (Ctrl+C)
2. Run: `npm install` (to ensure all dependencies are installed)
3. Run: `npm run dev`
4. Go to http://localhost:3000/register
5. Try to sign up with a test email
6. Check browser console (F12) for any error messages

## STEP 6: Debug If Still Getting Errors

### Check 1: Verify Supabase Connection
Open browser DevTools (F12) > Console tab and paste:
```javascript
import { createClient } from '@supabase/supabase-js'
const client = createClient('https://klvbjndadtvstjcmarhc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdmJqbmRhZHR2c3RqY21hcmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Njc5OTksImV4cCI6MjA4NDM0Mzk5OX0.2K4XNHefvJIMbdGOflj6nkGsMM9xCtyJBLyEdJ4CDbU')
client.auth.getUser().then(r => console.log(r))
```

### Check 2: Verify Tables Exist
In Supabase SQL Editor, run:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';
```
Should return 1 row. If no rows, tables weren't created.

### Check 3: Check RLS Policies
In Supabase SQL Editor, run:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'profiles';
```
Should show 5 policies. If 0, policies weren't created.

## Still Not Working?
The "Invalid API" error could mean:
- **Auth API failing**: Check if Supabase auth is enabled
- **Database API failing**: Check if tables exist and RLS policies allow access
- **CORS issue**: Usually auto-handled by Supabase, but check browser console
- **Invalid credentials**: Verify URL and key in `.env.local` match Supabase project

Check the browser console (F12) for the exact error message and share it.
