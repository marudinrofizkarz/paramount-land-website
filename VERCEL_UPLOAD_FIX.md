# Fix untuk Error Upload Gambar di Vercel

## Problem

Error: "Terjadi Kesalahan - Unexpected token 'R', "Request En"... is not valid JSON"

## Root Cause

1. **Vercel Serverless Function Limitations**: Vercel memiliki limit 4.5MB untuk request body
2. **File System Issues**: Vercel serverless functions memiliki read-only filesystem
3. **Error Response Format**: Vercel mengembalikan HTML error page (413 Request Entity Too Large) bukan JSON

## Solutions Applied

### 1. Updated Upload API (`/src/app/api/upload/route.ts`)

- ✅ Menghapus penggunaan filesystem lokal
- ✅ Upload langsung ke Cloudinary
- ✅ Mengurangi file size limit ke 4MB (aman untuk Vercel)
- ✅ Better error handling dengan pesan bahasa Indonesia
- ✅ Timeout handling (25 detik)

### 2. Updated Custom Image Component

- ✅ Client-side validation sebelum upload
- ✅ Better error messages dalam bahasa Indonesia
- ✅ Fallback ke direct Cloudinary upload jika API gagal
- ✅ Toast notifications untuk user feedback
- ✅ Data URL sebagai fallback terakhir

### 3. Vercel Configuration Updates

- ✅ Specific timeout configuration untuk upload endpoint
- ✅ Cache headers yang optimal

## Environment Variables Required

Pastikan environment variables berikut sudah diset di Vercel:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Deployment Steps

1. **Deploy ke Vercel**:

   ```bash
   vercel --prod
   ```

2. **Verify Environment Variables**:

   - Buka Vercel Dashboard → Project → Settings → Environment Variables
   - Pastikan semua Cloudinary variables sudah diset
   - Redeploy jika ada perubahan environment variables

3. **Test Upload Functionality**:
   - Upload file < 4MB
   - Cek apakah error masih muncul
   - Verify gambar tersimpan di Cloudinary

## File Size Guidelines

- ✅ **Maksimal**: 4MB per file
- ✅ **Optimal**: 1-2MB untuk performa terbaik
- ✅ **Format**: JPG, PNG, GIF, WebP

## Troubleshooting

### Jika masih error:

1. Cek Vercel Function Logs di Dashboard
2. Verify Cloudinary credentials
3. Test dengan file yang lebih kecil (< 1MB)
4. Cek Network tab di browser untuk detail error

### Common Issues:

- **413 Error**: File terlalu besar → compress image
- **Timeout Error**: Upload terlalu lama → gunakan file lebih kecil
- **Cloudinary Error**: Cek API credentials dan quota

## Performance Tips

1. **Compress images** sebelum upload
2. **Use WebP format** untuk file size yang lebih kecil
3. **Implement image optimization** di frontend
4. **Consider using Cloudinary transformations** untuk auto-optimization

## Monitoring

Monitor upload success rate dan error logs:

- Vercel Function Logs
- Cloudinary Dashboard → Reports
- User feedback via toast notifications
