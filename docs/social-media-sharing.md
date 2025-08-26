# Panduan OG Image untuk Social Media Sharing

## Apa itu OG Image?

OG Image (Open Graph Image) adalah gambar yang ditampilkan ketika konten dari website dibagikan di platform media sosial seperti Facebook, Twitter, LinkedIn, dan WhatsApp.

## Implementasi di Website Paramount Land

Website Paramount Land menggunakan dua metode untuk OG Image:

### 1. Gambar Dinamis melalui API

- Lokasi: `/src/app/api/og/route.tsx`
- URL: `https://www.rizalparamountland.com/api/og`
- Dibuat menggunakan Next.js OG Image Generation API
- Diperbarui secara otomatis dengan konten yang relevan
- Ideal untuk halaman home dan halaman umum

### 2. Gambar Statis

- Lokasi: `/public/images/og-image.png`
- Digunakan sebagai fallback jika gambar dinamis gagal dimuat
- Berfungsi baik untuk caching dan performa

## Cara Menguji OG Image

1. Gunakan [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Gunakan [Twitter Card Validator](https://cards-dev.twitter.com/validator)
3. Gunakan [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
4. Bagikan URL di grup WhatsApp pribadi untuk melihat hasilnya

## Panduan Desain

- Ukuran ideal: 1200x630 pixels (rasio 1.91:1)
- Pastikan teks utama berada di tengah (area aman: tengah 80%)
- Gunakan font yang jelas dan ukuran yang cukup besar
- Sertakan logo Paramount Land
- Gunakan warna brand Paramount Land

## Memperbarui OG Image

### Untuk Memperbarui Gambar Dinamis:

1. Edit file `/src/app/api/og/route.tsx`
2. Sesuaikan desain, teks, atau gambar sesuai kebutuhan
3. Deploy ulang website

### Untuk Memperbarui Gambar Statis:

1. Buat gambar baru dengan dimensi 1200x630px
2. Simpan sebagai `/public/images/og-image.png` (menimpa yang lama)
3. Deploy ulang website
