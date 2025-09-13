# Environment Variables Setup Guide for Vercel

## Required Environment Variables

Set these environment variables in Vercel Dashboard → Project → Settings → Environment Variables:

### Database (Turso)

```
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

### Cloudinary (Image Upload)

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Application URL

```
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## Optional Environment Variables

### Legacy Support (if needed)

```
DATABASE_URL=libsql://your-database-url.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
```

### JWT Secret (for auth)

```
JWT_SECRET=your-jwt-secret-key
```

## Vercel Deployment Steps

1. **Set Environment Variables**

   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables above
   - Set for Production, Preview, and Development environments

2. **Database Setup**

   - Ensure your Turso database is accessible from Vercel
   - Test connection using the Turso CLI or dashboard
   - Make sure auth token has proper permissions

3. **Cloudinary Setup**

   - Verify API keys are correct
   - Test upload functionality after deployment
   - Check CORS settings if needed

4. **Build Configuration**

   - The project uses a custom build script: `scripts/build-production.js`
   - This validates environment variables before building
   - Build will fail if required variables are missing in production

5. **Landing Page Components**
   - All components have been tested and are TypeScript-compliant
   - Location Map component sync issue has been fixed
   - SafeImage component handles image fallbacks properly

## Testing After Deployment

1. **Landing Pages**

   - Visit `/lp/[slug]` routes to test landing pages
   - Test component editing in `/dashboard/landing-pages`
   - Verify image uploads work with Cloudinary
   - Check Location Map component editing functionality

2. **Database Operations**

   - Test creating/editing landing pages
   - Verify component configurations save properly
   - Check that marketing gallery edits sync correctly

3. **Performance**
   - Landing pages should load quickly
   - Images should be optimized via Cloudinary
   - Components should render without errors

## Troubleshooting

If deployment fails:

1. **Check build logs** for specific error messages
2. **Verify environment variables** are set correctly
3. **Test database connection** using provided URLs
4. **Check Cloudinary configuration** for image upload issues
5. **Review API routes** for any Next.js 15 compatibility issues

All major TypeScript and build errors have been resolved for clean deployment.
