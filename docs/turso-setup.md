# Panduan Instalasi Turso

Untuk mengonfigurasi database Turso dengan proyek Anda, ikuti langkah-langkah berikut:

## 1. Instal CLI Turso dan Paket yang Diperlukan

```bash
# Instal Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Instal paket yang diperlukan untuk Prisma dengan Turso
npm install @libsql/client @libsql/prisma-adapter
```

## 2. Login ke Turso CLI

```bash
turso auth login
```

## 3. Buat Database di Turso

```bash
# Buat database baru dengan lokasi di Singapore (recommended untuk Indonesia)
turso db create paramount-land --location sin

# Alternatif lokasi lain:
# Tokyo: turso db create paramount-land --location nrt
# Sydney: turso db create paramount-land --location syd

# Dapatkan URL database
turso db show paramount-land --url

# Buat token autentikasi
turso db tokens create paramount-land
```

## 4. Update file .env.local

Setelah mendapatkan URL dan token, update file `.env.local` dengan informasi tersebut:

```
DATABASE_URL="libsql://your-database-name.turso.io"
DATABASE_AUTH_TOKEN="your-auth-token"
```

## 5. Update Client Prisma

Modifikasi file `src/lib/prisma.ts` untuk bekerja dengan Turso:

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@libsql/prisma-adapter";
import { createClient } from "@libsql/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const libsql = createClient({
  url: process.env.DATABASE_URL as string,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
const prismaClientSingleton = () => new PrismaClient({ adapter });

export const prisma = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
```

## 6. Push Schema ke Database

```bash
npx prisma db push
```

## 7. Generate Prisma Client

```bash
npx prisma generate
```
