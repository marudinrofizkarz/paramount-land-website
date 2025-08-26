import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Premium Property Developer | Paramount Land - Building Homes and People with Heart",
  description:
    "Paramount Land is a leading property developer offering premium residential and commercial projects with a focus on creating meaningful living spaces and communities. Explore our developments and find your dream property.",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
