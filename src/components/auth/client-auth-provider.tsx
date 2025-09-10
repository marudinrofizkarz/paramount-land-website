"use client";

import { AuthProvider as ActualAuthProvider } from "@/contexts/auth-context";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <ActualAuthProvider>{children}</ActualAuthProvider>;
}
