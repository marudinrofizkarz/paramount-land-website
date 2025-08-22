import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Paramount Land - Building Homes and People with Heart",
  description:
    "Learn about Paramount Land's vision, mission, values, and history as a leading property developer committed to building homes and communities with heart.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
