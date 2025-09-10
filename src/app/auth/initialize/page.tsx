"use client";

import React from "react";
import { AuthInitForm } from "@/components/auth/auth-init-form";

export default function InitializationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Inisialisasi Sistem Autentikasi
        </h1>
        <AuthInitForm />
      </div>
    </div>
  );
}
