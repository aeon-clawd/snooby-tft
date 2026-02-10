# 🔐 Authentication Setup Guide

Quick setup guide for the NextAuth admin authentication system.

## 🚀 Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - **Type:** Web application
   - **Authorized redirect URIs:**
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.vercel.app/api/auth/callback/google`

5. Copy **Client ID** and **Client Secret** to `.env.local`

### 3. Update .env.local

```bash
# NextAuth - Already configured
NEXTAUTH_SECRET=xVwgsl0CDaGmCo61KTf3kx9r4RibMD1wBsFiZWuiygA=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth - ADD YOUR CREDENTIALS HERE
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456

# Admin Access - Already configured
ADMIN_EMAIL=brotons22@gmail.com
ADMIN_PASSWORD=optional-backup-password
```

### 4. Test Locally

```bash
npm run dev
```

Visit:
- Login page: `http://localhost:3000/login`
- Admin panel: `http://localhost:3000/admin` (redirects to login if not authenticated)

## 🔒 Security Features

✅ **OAuth 2.0** - Secure Google authentication  
✅ **Email Allowlist** - Only `brotons22@gmail.com` can access  
✅ **JWT Sessions** - Stateless, secure sessions (30 days)  
✅ **Route Protection** - Middleware protects all `/admin/*` routes  
✅ **Backup Auth** - Optional credentials login (emergency access)

## 🧪 Testing

### Test Login Flow

1. Navigate to `/login`
2. Click "Sign in with Google"
3. Authenticate with `brotons22@gmail.com`
4. Verify redirect to `/admin`
5. Check navbar shows name and email
6. Test logout button

### Test Access Control

1. Logout completely
2. Try accessing `/admin` directly → should redirect to `/login`
3. Try logging in with different email → should show "Access denied"

## 🚀 Deploy to Production

### Vercel Setup

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (change to production domain)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD` (optional)

4. Update Google OAuth redirect URI to production URL
5. Deploy!

## 📝 Files Reference

- `/lib/auth.ts` - NextAuth configuration
- `/app/api/auth/[...nextauth]/route.ts` - Auth API handler
- `/middleware.ts` - Route protection
- `/app/login/page.tsx` - Login page
- `/app/admin/page.tsx` - Protected admin dashboard
- `/types/next-auth.d.ts` - TypeScript type definitions

## 🔧 Troubleshooting

### "Access denied" error
- Verify `ADMIN_EMAIL` matches the Google account you're using
- Check console logs for denied email address

### OAuth redirect error
- Verify redirect URI in Google Console matches exactly
- Check `NEXTAUTH_URL` is set correctly

### Session not persisting
- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set and matches between deploys

## 🎯 Next Steps

- [ ] Configure real Google OAuth credentials
- [ ] Test login/logout flow
- [ ] Deploy to production
- [ ] Build admin UI features
- [ ] Add audit logging (optional)
- [ ] Implement 2FA (optional)

For detailed documentation, see: `/home/ubuntu/Obsidia-notas/Tickets/tk-e71n7d7o3p38.md`
