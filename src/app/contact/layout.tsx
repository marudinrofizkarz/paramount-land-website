import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Paramount Land - Building Homes and People with Heart",
  description:
    "Get in touch with Paramount Land. Contact our sales team for property inquiries, visit our office, or connect with us through various channels.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
