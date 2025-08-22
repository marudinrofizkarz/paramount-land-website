# Lokasi Server Turso

Berikut adalah daftar lokasi server Turso yang tersedia dan kode lokasi yang dapat digunakan saat membuat database baru.

## Lokasi Server Turso yang Tersedia

| Region            | Location Code | Notes                           |
| ----------------- | ------------- | ------------------------------- |
| **Asia Pacific**  |               |                                 |
| Singapore         | sin           | **Terbaik untuk Indonesia**     |
| Tokyo             | nrt           | Alternatif baik untuk Indonesia |
| Sydney            | syd           | Opsi lain di region APAC        |
| Seoul             | icn           |                                 |
| **Europe**        |               |                                 |
| Frankfurt         | fra           |                                 |
| London            | lhr           |                                 |
| Paris             | cdg           |                                 |
| Amsterdam         | ams           |                                 |
| **North America** |               |                                 |
| Chicago           | ord           |                                 |
| New York          | ewr           |                                 |
| Dallas            | dfw           |                                 |
| San Jose          | sjc           |                                 |
| Los Angeles       | lax           |                                 |
| Miami             | mia           |                                 |
| **South America** |               |                                 |
| São Paulo         | gru           |                                 |
| **Africa**        |               |                                 |
| Johannesburg      | jnb           |                                 |

## Cara Memilih Lokasi

Saat membuat database baru, gunakan flag `--location` diikuti dengan kode lokasi:

```bash
turso db create nama-database --location sin
```

## Pertimbangan Memilih Lokasi

1. **Jarak geografis** - Pilih lokasi terdekat dengan pengguna utama Anda
2. **Latensi jaringan** - Lokasi yang lebih dekat umumnya memberikan latensi lebih rendah
3. **Persyaratan hukum/regulasi** - Pertimbangkan persyaratan residensi data jika ada

## Rekomendasi untuk Indonesia

Untuk aplikasi yang melayani pengguna di Indonesia, rekomendasi lokasi berdasarkan kedekatan:

1. **Singapore (sin)** - Pilihan terbaik (jarak sekitar 900 km dari Jakarta)
2. **Tokyo (nrt)** - Pilihan kedua yang baik
3. **Sydney (syd)** - Alternatif lain

## Mengukur Latensi

Untuk memastikan pilihan lokasi terbaik, Anda dapat mengukur latensi dari server Anda ke lokasi Turso dengan alat seperti `ping` atau layanan pengujian latensi.

```bash
# Contoh menggunakan ping
ping singapore.turso.io
ping tokyo.turso.io
```
