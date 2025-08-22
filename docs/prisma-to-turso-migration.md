# Panduan Migrasi dari Prisma ke Turso

Dokumen ini berisi langkah-langkah untuk migrasi dari Prisma ke Turso pada proyek ini.

## Langkah-langkah Migrasi

### 1. Hapus Dependensi Prisma yang Tidak Diperlukan

```bash
# Hapus dependensi Prisma
npm uninstall @prisma/client prisma
```

### 2. Instal Dependensi Turso

```bash
# Instal dependensi Turso
npm install @libsql/client uuid
```

### 3. Setup Database Turso

Ikuti langkah-langkah di dokumen [turso-setup.md](./turso-setup.md) untuk membuat database Turso.

### 4. Inisialisasi Database

Setelah membuat database dan mendapatkan URL serta token, update file `.env.local` dengan informasi tersebut dan jalankan:

```bash
# Jalankan script inisialisasi untuk membuat tabel
node scripts/turso.js init-db
```

### 5. Struktur Database

Struktur tabel pada Turso didefinisikan di file `src/lib/schema.sql` yang menggantikan skema Prisma sebelumnya.

## Perubahan Implementasi

### 1. Dari Prisma ke Query SQL Langsung

Sebelumnya dengan Prisma:

```typescript
const sliders = await prisma.heroSlider.findMany({
  where: { isActive: true },
  orderBy: { order: "asc" },
});
```

Sekarang dengan Turso:

```typescript
const sliders = await getMany(
  'SELECT * FROM HeroSlider WHERE isActive = 1 ORDER BY "order" ASC'
);
```

### 2. Library yang Digunakan

- **Sebelumnya**: Prisma ORM (@prisma/client)
- **Sekarang**: Turso Client (@libsql/client)

### 3. File Konfigurasi

- **Sebelumnya**:

  - prisma/schema.prisma (skema database)
  - src/lib/prisma.ts (konfigurasi client Prisma)

- **Sekarang**:
  - src/lib/schema.sql (definisi tabel SQL)
  - src/lib/database.ts (konfigurasi Turso dan helper functions)

## Perbedaan dengan SQLite

Turso adalah varian dari SQLite dengan dukungan cloud. Beberapa perbedaan utama:

1. **Tipe Data**:

   - SQLite menggunakan tipe data yang lebih sederhana (TEXT, INTEGER, REAL, BLOB, NULL)
   - Tidak ada tipe data Boolean asli, penggunaan INTEGER (0/1) sebagai pengganti

2. **Constraint**:
   - SQLite memiliki batasan pada ALTER TABLE yang lebih ketat
   - Beberapa fitur SQL advanced mungkin tidak tersedia

## Catatan Khusus

1. **Perbedaan Boolean**:

   - Prisma: `isActive: Boolean`
   - Turso/SQLite: `isActive INTEGER (0/1)`

2. **Transactions**:

   - Turso mendukung transaksi tapi dengan sintaks yang berbeda dari Prisma

3. **Migrasi**:
   - Prisma memiliki sistem migrasi otomatis
   - Turso memerlukan skrip migrasi manual
