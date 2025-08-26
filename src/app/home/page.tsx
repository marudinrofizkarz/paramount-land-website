import HomeClient from "./client";
import { constructMetadata } from "../metadata";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title:
    "Paramount Land - Building Homes and People with Heart | Perumahan & Properti Komersial",
  description:
    "Paramount Land - developer properti premium di Indonesia dengan fokus pada hunian berkualitas dan properti komersial. Temukan rumah idaman dan investasi properti terbaik di lokasi strategis.",
  keywords:
    "properti premium, perumahan, properti komersial, investasi properti, developer properti, rumah dijual, Paramount Land, properti Indonesia, rumah mewah, properti strategis",
  // We explicitly set the image here to ensure it's included in the metadata
  image:
    "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
});

export default function Home() {
  return <HomeClient />;
}
