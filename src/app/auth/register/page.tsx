import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Registration Disabled | Paramount Land",
  description: "Registration is disabled",
};

export default function RegisterPage() {
  // Registration is disabled, redirect to login
  redirect("/auth/login");
}
