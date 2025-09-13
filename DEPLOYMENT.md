# Deployment Guide for Paramount Land Website

This guide provides step-by-step instructions for deploying the Paramount Land website to Vercel.

## 🚀 Quick Start

### 1. Environment Setup (Required)

**For new projects, use the interactive setup:**

```bash
npm run setup:env
```

**To validate your configuration:**

```bash
npm run validate:env
```

### 2. Build Verification

Test that your project builds successfully:

```bash
npm run build
```

If this fails, check your environment variables and fix any issues before deploying.

## ⚠️ CRITICAL: Set These Environment Variables in Vercel

Before deploying to Vercel, you **MUST** configure these environment variables in your Vercel project settings:

### 🗄️ **Database (REQUIRED)**

```env
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token_here
```

### 🔐 **Authentication (REQUIRED)**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_or_pk_live_your_clerk_key
CLERK_SECRET_KEY=sk_test_or_sk_live_your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
```

### 🖼️ **File Storage (REQUIRED)**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 🤖 **AI Integration (OPTIONAL)**

```env
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
```

### 🌐 **App Configuration**

```env
NEXT_PUBLIC_APP_URL=https://www.rizalparamountland.com
NEXTAUTH_SECRET=your_random_secret_string
```

## 🚀 How to Set Up Environment Variables in Vercel

1. **Go to Vercel Dashboard:**

   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `paramount-land-website` project

2. **Navigate to Settings:**

   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add Each Variable:**

   - Click "Add New"
   - Enter the variable name (e.g., `TURSO_DATABASE_URL`)
   - Enter the variable value
   - Select environment: `Production`, `Preview`, and `Development`
   - Click "Save"

4. **Redeploy:**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"

## 🔑 How to Get API Keys

### Turso Database

1. Visit [turso.tech](https://turso.tech)
2. Sign up/login
3. Create a new database
4. Get URL and auth token from dashboard

### Clerk Authentication

1. Visit [clerk.com](https://clerk.com)
2. Create new application
3. Get keys from "API Keys" section

### Cloudinary

1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get credentials from dashboard

### Google AI (Optional)

1. Visit [ai.google.dev](https://ai.google.dev)
2. Get API key for Gemini

## ❌ Common Deployment Errors

### Error: `URL_INVALID: The URL 'undefined'`

**Solution:** Missing `TURSO_DATABASE_URL` - add it to Vercel env vars

### Error: `CLERK_SECRET_KEY is missing`

**Solution:** Missing Clerk environment variables - add all Clerk vars

### Error: Build fails with Cloudinary

**Solution:** Missing Cloudinary environment variables

## 🛠️ CRITICAL FIX: Image Upload Error

### Problem: "Terjadi Kesalahan - Unexpected token 'R', Request En..."

This error occurs when uploading custom component images on Vercel due to serverless function limitations.

**✅ FIXED in this version:**

- Upload API now uses Cloudinary directly (no filesystem writes)
- File size limit reduced to 4MB (Vercel-compatible)
- Better error handling with Indonesian messages
- Client-side validation before upload
- Multiple fallback strategies

### Verification After Deployment:

1. **Test Custom Image Upload:**

   - Go to Landing Page Editor
   - Add Custom Image Component
   - Try uploading image < 4MB
   - Should see success message in Indonesian

2. **If Upload Still Fails:**

   ```bash
   # Check Cloudinary environment variables are set
   echo $NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   echo $CLOUDINARY_API_KEY
   echo $CLOUDINARY_API_SECRET
   ```

3. **File Size Guidelines:**
   - ✅ Maximum: 4MB per file
   - ✅ Optimal: 1-2MB for best performance
   - ✅ Formats: JPG, PNG, GIF, WebP

### Debug Upload Issues:

1. **Check Vercel Function Logs:**

   - Vercel Dashboard → Functions tab
   - Look for `/api/upload` errors

2. **Verify in Browser:**
   - Open Network tab in dev tools
   - Look for 413 (too large) or 408 (timeout) errors
   - Check actual API response format

**See `VERCEL_UPLOAD_FIX.md` for detailed technical information.**

## ✅ Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database URL is correct format
- [ ] Clerk keys are for correct environment (test vs production)
- [ ] **Cloudinary credentials are valid (CRITICAL for uploads)**
- [ ] Redeploy after setting environment variables
- [ ] **Test custom component image upload < 4MB**
- [ ] **Verify error messages appear in Indonesian**
