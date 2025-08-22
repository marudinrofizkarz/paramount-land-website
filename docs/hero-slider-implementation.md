# Implementation Guide: Hero Slider Management Feature

This guide outlines the steps required to implement the hero slider management feature, including the Cloudinary image upload functionality and PlanetScale database integration.

## Prerequisites

1. A Next.js project (already in place)
2. Access to a Cloudinary account
3. Access to a PlanetScale database

## Step 1: Install Required Dependencies

```bash
npm install @prisma/client prisma cloudinary
```

## Step 2: Set Up Environment Variables

Create or update your `.env` file with the following variables:

```
# Database
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/your-database-name?sslaccept=strict"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 3: Initialize Prisma

```bash
npx prisma init
```

## Step 4: Set Up Database Schema

The schema has already been created at `prisma/schema.prisma`.

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

## Step 6: Push the Schema to PlanetScale

```bash
npx prisma db push
```

## Step 7: Test the Feature

1. Navigate to the dashboard at `/dashboard/hero-sliders`
2. Add a new hero slider by uploading desktop and mobile images
3. Check that the slider appears on the homepage
4. Edit and reorder sliders as needed

## Maintenance and Updates

- To update the database schema, modify `prisma/schema.prisma` and run `npx prisma db push`
- To add more features to the hero slider, modify the components in the `/src/components` directory

## Troubleshooting

- If images fail to upload, check Cloudinary credentials and connection
- If database operations fail, verify PlanetScale connection and credentials
- Check console logs for detailed error messages

## File Structure Overview

- `/prisma/schema.prisma` - Database schema
- `/src/lib/cloudinary.ts` - Cloudinary configuration and upload functions
- `/src/lib/prisma.ts` - Prisma client configuration
- `/src/lib/hero-slider-actions.ts` - Server actions for CRUD operations
- `/src/components/hero-slider-form.tsx` - Form for adding/editing sliders
- `/src/components/hero-slider-list.tsx` - List and reordering of sliders
- `/src/components/dynamic-hero-slider.tsx` - Dynamic slider component
- `/src/app/dashboard/hero-sliders/page.tsx` - Admin page for slider management
