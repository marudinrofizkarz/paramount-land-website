"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { runAuthMigration } from "@/scripts/migrate-auth";
import { Loader2 } from "lucide-react";

export function AuthInitForm() {
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [adminName, setAdminName] = useState("Administrator");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInitialize() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await runAuthMigration(
        adminUsername,
        adminEmail,
        adminPassword,
        adminName
      );

      if (response.success) {
        toast({
          title: "Inisialisasi Berhasil",
          description: "Sistem autentikasi berhasil diinisialisasi",
        });
        setIsComplete(true);
      } else {
        setError(response.message || "Terjadi kesalahan saat inisialisasi");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      console.error("Initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Inisialisasi Sistem Autentikasi</CardTitle>
        <CardDescription>
          Setup database dan buat user admin pertama
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}

        {isComplete ? (
          <div className="p-4 text-center">
            <p className="mb-4 text-green-600 dark:text-green-400">
              Inisialisasi berhasil. Anda sekarang dapat login menggunakan
              kredensial admin.
            </p>
            <Button onClick={() => (window.location.href = "/auth/login")}>
              Pergi ke Halaman Login
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="adminUsername">Username Admin</Label>
              <Input
                id="adminUsername"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email Admin</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password Admin</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminName">Nama Admin</Label>
              <Input
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </>
        )}
      </CardContent>
      {!isComplete && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleInitialize}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Inisialisasi Sistem Autentikasi
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
