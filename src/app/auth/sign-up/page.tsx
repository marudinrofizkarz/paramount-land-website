import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In | Paramount Land",
  description: "Sign in to your Paramount Land account.",
};

export default function SignUpPage() {
  // Mengalihkan pengguna ke halaman sign-in
  redirect("/auth/sign-in");

  // Kode di bawah ini tidak akan dijalankan karena redirect
  return null;
}
