import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "News & Updates | Paramount Land - Building Homes and People with Heart",
  description:
    "Stay updated with the latest news, events, and announcements from Paramount Land. Read about our newest projects, achievements, and industry insights.",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
