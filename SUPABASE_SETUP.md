# Supabase Setup Guide for BizConnect

## 1. Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
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
CREATE INDEX profiles_status_idx ON profiles(status);
CREATE INDEX profiles_created_at_idx ON profiles(created_at DESC);

-- Update timestamp on changes
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION moddatetime (updated_at);
```

## 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id
  );

-- Policy 2: Admin can read all pending profiles
CREATE POLICY "Admin can read pending" ON public.profiles
  FOR SELECT USING (
    auth.jwt() ->> 'email' = 'your-admin-email@example.com'
  );

-- Policy 3: Anyone can read approved profiles
CREATE POLICY "Anyone can read approved" ON public.profiles
  FOR SELECT USING (
    status = 'approved'
  );

-- Policy 4: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id
  );

-- Policy 5: Admin can update status
CREATE POLICY "Admin can update status" ON public.profiles
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = 'your-admin-email@example.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'your-admin-email@example.com'
  );
```

## 3. Create Storage Bucket

In Supabase Storage tab:

1. Create new bucket named `resumes`
2. Make it **Public**
3. Add CORS policy to allow uploads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["Content-Length"],
    "MaxAgeSeconds": 3600
  }
]
```

## 4. Get Your Credentials

1. Go to **Settings > API** in your Supabase project
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Anon Public Key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 5. Environment Variables

In your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://klvbjndadtvstjcmarhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdmJqbmRhZHR2c3RqY21hcmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Njc5OTksImV4cCI6MjA4NDM0Mzk5OX0.2K4XNHefvJIMbdGOflj6nkGsMM9xCtyJBLyEdJ4CDbU
NEXT_PUBLIC_ADMIN_EMAIL=pauladamu600@gmail.com
```

## 6. Webhooks (Optional)

To get notified when new users register:

1. Go to **Database > Webhooks** in Supabase
2. Create webhook for `INSERT` on `profiles` table
3. Send to your email service or Slack

Example payload:
```json
{
  "type": "INSERT",
  "record": {
    "id": "...",
    "full_name": "John Doe",
    "email": "john@example.com",
    "status": "pending"
  }
}
```

## Testing

1. Register a new user at `/register`
2. Check Supabase > Auth > Users
3. View profile in database
4. Sign in as admin at `/admin`
5. Approve/reject pending users
6. Profile appears in `/directory` when approved

---

**Note**: Replace `your-admin-email@example.com` with your actual admin email address!
