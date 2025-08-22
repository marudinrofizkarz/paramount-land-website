# Migrasi Skema Project ke Database Turso

File ini berisi instruksi untuk menjalankan migrasi skema Project ke database Turso.

## Prasyarat

1. Pastikan Anda telah menginstal semua dependensi dengan menjalankan:

   ```
   npm install
   ```

2. Pastikan Anda telah mengatur file `.env.local` dengan kredensial Turso yang benar:
   ```
   DATABASE_URL=libsql://your-database-name.turso.io
   DATABASE_AUTH_TOKEN=your-auth-token
   ```

## Menjalankan Migrasi

1. Jalankan perintah berikut di terminal:

   ```
   node scripts/migrate-project.js
   ```

2. Pastikan skrip berjalan tanpa error dan pesan "Migrasi Project schema ke database Turso berhasil!" ditampilkan.

## Verifikasi Migrasi

Untuk memverifikasi bahwa tabel Project telah berhasil dibuat, skrip akan secara otomatis memeriksa tabel setelah migrasi. Anda akan melihat pesan "Tabel Project berhasil dibuat!" jika migrasi berhasil.

## Troubleshooting

Jika Anda mengalami error, pastikan:

1. File `.env.local` berisi kredensial Turso yang benar
2. Database Turso Anda aktif dan dapat diakses
3. Anda memiliki izin yang cukup untuk menjalankan perintah DDL pada database Turso

## Mencari bantuan lebih lanjut

Lihat dokumentasi Turso di [docs.turso.tech](https://docs.turso.tech) untuk informasi lebih lanjut.
