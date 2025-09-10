import { constructMetadata } from "./metadata";
import { Metadata } from "next";
import HomeClient from "./home/client";
import { getPublicProjects } from "@/lib/project-actions";
import { getPublishedNews } from "@/lib/news-actions";

export const metadata: Metadata = constructMetadata({
  title: "Paramount Land - Building Homes and People with Heart",
  description:
    "Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial. Temukan rumah idaman dan investasi properti terbaik di lokasi strategis.",
  keywords:
    "properti premium, perumahan, properti komersial, investasi properti, developer properti, rumah dijual, Paramount Land, properti Indonesia, rumah mewah, properti strategis",
  // We explicitly set a high quality image for social media sharing
  image:
    "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
});

export default async function Home() {
  // Fetch data on server side
  const residentialProjects = await getPublicProjects(undefined, "residential");
  const commercialProjects = await getPublicProjects(undefined, "commercial");
  const news = await getPublishedNews();

  return (
    <HomeClient
      initialResidentialProjects={residentialProjects}
      initialCommercialProjects={commercialProjects}
      initialNews={news}
    />
  );
}
