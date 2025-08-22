import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Paramount Land - Building Homes and People with Heart",
  description:
    "Explore Paramount Land's residential and commercial projects. Find your dream home or investment opportunity with our premium properties.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
