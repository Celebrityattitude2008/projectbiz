/**
 * ADMIN VERIFICATION SYSTEM
 * 
 * How it works:
 * 1. Admin email is configured in .env.local as NEXT_PUBLIC_ADMIN_EMAIL
 * 2. When a user tries to access /admin page or admin features:
 *    - The isAdmin() function is called
 *    - It retrieves the current logged-in user
 *    - It compares the user's email with NEXT_PUBLIC_ADMIN_EMAIL
 *    - If emails match (case-insensitive), user is admin
 *    - If emails don't match, access is denied
 * 
 * Setup:
 * 1. Add the admin email to .env.local:
 *    NEXT_PUBLIC_ADMIN_EMAIL=pauladamu600@gmail.com
 * 
 * 2. Create an account with that email and sign up
 * 
 * 3. Only that account will have admin access to /admin page
 * 
 * Verification Layers:
 * 1. AdminPageClient wrapper - redirects non-admins to home
 * 2. AdminPendingUsers component - checks admin status before showing users
 * 3. Each admin action (approve/reject) is server-side validated
 * 
 * To change admin:
 * - Update NEXT_PUBLIC_ADMIN_EMAIL in .env.local
 * - Restart the application
 */
