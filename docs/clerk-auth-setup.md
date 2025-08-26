# Konfigurasi Autentikasi dengan Clerk

Website Paramount Land menggunakan Clerk untuk autentikasi dan pengamanan halaman dashboard. Dokumen ini menjelaskan cara mengkonfigurasi Clerk untuk memastikan hanya akun yang diizinkan yang dapat mengakses dashboard.

## Langkah-Langkah Konfigurasi di Clerk Dashboard

Setelah website Paramount Land berjalan di production, lakukan konfigurasi berikut di dashboard Clerk:

### 1. Nonaktifkan Pendaftaran (Sign Up)

Untuk memastikan tidak ada user baru yang dapat mendaftar:

1. Login ke [Clerk Dashboard](https://dashboard.clerk.com)
2. Pilih aplikasi Paramount Land
3. Pergi ke **User & Authentication → Flows**
4. Pada bagian **Sign Up**, klik **Edit**
5. Nonaktifkan opsi "Allow users to sign up"
6. Simpan perubahan

### 2. Nonaktifkan Social Login (Google, dll)

Untuk menonaktifkan login dengan akun Google atau social media lainnya:

1. Pergi ke **User & Authentication → Social Connections**
2. Nonaktifkan semua provider yang ada (Google, Facebook, dll)
3. Simpan perubahan

### 3. Mengatur Allowlist Email

Untuk membatasi login hanya untuk email tertentu:

1. Pergi ke **User & Authentication → Security**
2. Di bagian **Allowlist**, klik **Edit**
3. Aktifkan "Restrict sign-in to allowlist only"
4. Tambahkan email-email yang diizinkan (contoh):
   - rijal.sutanto@paramount-land.com
   - admin@paramount-land.com
   - [email lain yang diizinkan]
5. Simpan perubahan

## Cara Kerja Autentikasi

1. Middleware Next.js melindungi semua rute `/dashboard/**`
2. User yang mencoba mengakses halaman dashboard harus login terlebih dahulu
3. Hanya email yang terdaftar di allowlist yang diizinkan untuk login
4. User tidak dapat mendaftar akun baru karena sign-up dinonaktifkan
5. Login hanya tersedia melalui email/password (social login dinonaktifkan)

## Menambahkan User Baru

Untuk menambahkan user baru yang dapat mengakses dashboard:

1. Login ke Clerk Dashboard sebagai admin
2. Pergi ke **Users**
3. Klik **Add User**
4. Masukkan email user baru
5. Clerk akan mengirimkan email undangan/verifikasi ke user tersebut
6. User baru perlu mengatur password mereka
7. Pastikan email user baru ditambahkan ke allowlist

## Pengaturan Environment Variable

Pastikan environment variable berikut sudah dikonfigurasi dengan benar di server:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Konsultasikan dengan administrator jika Anda memerlukan kunci-kunci ini untuk pengembangan.
