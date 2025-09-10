# Profile Management Implementation Guide

## Overview

Implementasi sistem manajemen profile lengkap dengan upload avatar ke Cloudinary dan update data ke database.

## Features

### 1. Avatar Management

- **Upload to Cloudinary**: Upload gambar avatar ke cloud storage
- **File Validation**: Validasi tipe file (hanya image) dan ukuran (max 5MB)
- **Automatic Optimization**: Cloudinary otomatis optimize gambar
- **Database Integration**: URL avatar tersimpan di database

### 2. Profile Update

- **Real-time Validation**: Validasi email dan username unik
- **Password Update**: Opsi untuk mengubah password dengan konfirmasi
- **Partial Updates**: Hanya field yang berubah yang diupdate
- **Secure**: Password di-hash dengan bcrypt

### 3. User Interface

- **View Mode**: Tampilan read-only profile user
- **Edit Mode**: Form lengkap untuk edit profile
- **Real-time Preview**: Avatar preview saat upload
- **Responsive Design**: Optimized untuk mobile dan desktop

## File Structure

```
src/
├── lib/
│   └── profile-actions.ts          # ✅ Server actions untuk profile
├── app/api/profile/
│   ├── upload-avatar/
│   │   └── route.ts               # ✅ API endpoint upload avatar
│   └── update/
│       └── route.ts               # ✅ API endpoint update profile
└── features/profile/components/
    ├── profile-view-page.tsx      # ✅ Profile view dengan toggle edit
    └── profile-edit-form.tsx      # ✅ Form edit profile lengkap
```

## Implementation Details

### 1. Server Actions (`/lib/profile-actions.ts`)

#### updateUserProfile()

- Validasi duplikasi email/username
- Dynamic query building
- Password hashing
- Database transaction

#### uploadAvatarToCloudinary()

- Direct upload ke Cloudinary
- Error handling
- Return secure URL

### 2. API Routes

#### `/api/profile/upload-avatar` (POST)

- Authentication check
- File validation (type, size)
- Cloudinary upload
- Return secure URL

#### `/api/profile/update` (PUT)

- Authentication check
- Profile data validation
- Database update
- Return updated user data

### 3. Frontend Components

#### ProfileViewPage

- View/Edit mode toggle
- Clean profile display
- Avatar preview
- User information grid

#### ProfileEditForm

- Form validation
- Avatar upload with preview
- Password confirmation
- Real-time feedback
- Toast notifications

## Setup Instructions

### 1. Cloudinary Configuration

Create account di [Cloudinary](https://cloudinary.com/) dan setup:

1. **Upload Preset**:

   - Go to Settings > Upload
   - Create unsigned upload preset
   - Set folder: "avatars"
   - Set resource type: "Image"

2. **Environment Variables**:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

### 2. Database Schema

Pastikan tabel `Users` memiliki kolom:

```sql
ALTER TABLE Users ADD COLUMN avatar_url TEXT;
```

### 3. Dependencies

Install dependencies yang diperlukan:

```bash
npm install @hookform/resolvers zod lucide-react
```

## Usage

### 1. View Profile

```typescript
// Halaman /dashboard/profile menampilkan:
- Avatar user (dari database atau fallback)
- Informasi personal (nama, username, email)
- Button "Edit Profile"
```

### 2. Edit Profile

```typescript
// Klik "Edit Profile" untuk:
- Upload avatar baru
- Edit nama, username, email
- Ubah password (opsional)
- Simpan perubahan
```

### 3. Avatar Upload Flow

```typescript
1. User pilih file gambar
2. Validasi client-side (type, size)
3. Upload ke Cloudinary via API
4. Update preview avatar
5. Save ke database saat submit form
```

## Security Features

### 1. Authentication

- Semua API route memerlukan valid JWT token
- User hanya bisa edit profile sendiri

### 2. Validation

- Server-side validation untuk semua input
- Email/username uniqueness check
- Password strength requirements

### 3. File Upload Security

- File type validation (hanya image)
- File size limit (5MB)
- Cloudinary auto-moderation

## Error Handling

### 1. Client-side

- Toast notifications untuk feedback
- Form validation errors
- Loading states

### 2. Server-side

- Structured error responses
- Database constraint validation
- Cloudinary upload errors

## Testing

### 1. Profile View

- ✅ Display user information
- ✅ Avatar from database/fallback
- ✅ Edit button functionality

### 2. Profile Edit

- ✅ Form pre-populated with user data
- ✅ Avatar upload with preview
- ✅ Validation for all fields
- ✅ Password confirmation
- ✅ Success/error notifications

### 3. API Endpoints

- ✅ Authentication validation
- ✅ File upload to Cloudinary
- ✅ Database updates
- ✅ Error responses

## Troubleshooting

### Upload Issues

1. Check Cloudinary credentials
2. Verify upload preset exists
3. Check file size/type limits

### Database Issues

1. Verify database connection
2. Check column `avatar_url` exists
3. Validate user permissions

### Auth Issues

1. Check JWT token validity
2. Verify middleware configuration
3. Clear browser cookies

## Future Enhancements

1. **Image Cropping**: Add image crop functionality
2. **Multiple Avatars**: Allow multiple avatar options
3. **Profile Completion**: Progress indicator for profile completion
4. **Social Links**: Add social media profile links
5. **Export Profile**: Export profile data as PDF

## Conclusion

Sistem profile management sekarang sudah lengkap dengan:

- ✅ Avatar upload ke Cloudinary
- ✅ Database integration
- ✅ Security validation
- ✅ User-friendly interface
- ✅ Error handling
- ✅ Responsive design

User dapat dengan mudah mengedit profile mereka dengan pengalaman yang smooth dan aman.
