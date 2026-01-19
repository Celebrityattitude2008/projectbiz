# BizConnect

A professional networking platform to connect with vetted professionals. Built with Next.js, Supabase, and Tailwind CSS.

## Architecture Overview

### Frontend (Next.js & Tailwind CSS)
- **Routing**: File-based system with pages for `/register`, `/apply`, `/admin`, and `/directory`
- **State Management**: React Hooks for multi-step form handling
- **Styling**: Tailwind CSS utility-first approach

### Backend (Supabase)
- **Authentication**: Secure password encryption and session management via Supabase Auth
- **Database**: PostgreSQL for storing profile data, linked via UUID to auth.users
- **Storage**: Dedicated bucket for resume/PDF uploads
- **Row Level Security (RLS)**: Digital bouncer ensuring only admins can view pending users

### API & Logic (Server Actions & Client Functions)
- **Server Actions**: Sensitive operations (approvals, rejections) run server-side
- **Client Functions**: Profile creation, database queries use supabase-js
- **Data Lifecycle**: Pending → Review → Approved → Public Directory

### Deployment (Netlify)
- Git-based deployment with environment variables for Supabase keys

## Project Structure

```
src/
├── app/              # Next.js app directory (routes)
│   ├── layout.tsx    # Root layout with Header/Footer
│   ├── page.tsx      # Home page
│   ├── register/     # Sign up & profile creation
│   ├── apply/        # Application process page
│   ├── admin/        # Admin dashboard (pending approvals)
│   └── directory/    # Public professional directory
├── components/       # React components
│   ├── Header.tsx    # Navigation
│   ├── Footer.tsx    # Footer
│   ├── RegisterForm.tsx    # Multi-step registration
│   ├── DirectoryList.tsx   # Show approved profiles
│   └── AdminPendingUsers.tsx # Admin review interface
├── lib/
│   ├── supabase.ts   # Supabase client initialization
│   ├── database.ts   # Database queries & operations
│   └── actions.ts    # Server-side actions & auth
└── globals.css       # Tailwind CSS imports
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account

### Installation

1. **Clone and install**:
```bash
npm install
```

2. **Setup Supabase**:
   - Create a new Supabase project
   - Create the `profiles` table with columns:
     - `id` (UUID, primary key)
     - `full_name` (text)
     - `email` (text)
     - `job_title` (text)
     - `bio` (text)
     - `skills` (text array, nullable)
     - `resume_url` (text, nullable)
     - `status` (text enum: 'pending', 'approved', 'rejected')
     - `created_at` (timestamp)
     - `updated_at` (timestamp)
   
   - Create `resumes` storage bucket (public)
   
   - Enable RLS policies:
     ```sql
     -- Allow users to read their own profile
     CREATE POLICY "Users can read own profile" ON profiles
       FOR SELECT USING (auth.uid()::text = id);
     
     -- Allow admin to read pending profiles
     CREATE POLICY "Admin can read pending" ON profiles
       FOR SELECT USING (
         auth.jwt() ->> 'email' = 'your-admin-email@example.com'
         AND status = 'pending'
       );
     
     -- Allow anyone to read approved profiles
     CREATE POLICY "Anyone can read approved" ON profiles
       FOR SELECT USING (status = 'approved');
     ```

3. **Configure environment**:
```bash
cp .env.example .env.local
```

Then fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAIL`

4. **Run locally**:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Development

- **Pages**: Add new routes in `src/app/`
- **Components**: Create reusable components in `src/components/`
- **Database operations**: Use functions in `src/lib/database.ts`
- **Server logic**: Add to `src/lib/actions.ts`

## Deployment (Netlify)

1. Push code to GitHub
2. Connect repository in Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically on each push

## Key Features

✅ User registration with email/password  
✅ Multi-step profile creation  
✅ Resume upload to cloud storage  
✅ Admin dashboard for approvals  
✅ Public professional directory  
✅ Row-level security for data privacy  
✅ Responsive design with Tailwind CSS  

## License

MIT
