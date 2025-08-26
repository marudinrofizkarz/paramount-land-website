import { constructMetadata } from "./metadata";

// Use a higher quality image for the homepage og:image
const homePageImage =
  "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/paramount-land-banner_j7eukf.jpg";

export const metadata = constructMetadata({
  title: "Paramount Land - Building Homes and People with Heart",
  description:
    "Discover premium residential and commercial properties by Paramount Land. Building Homes and People with Heart.",
  image: homePageImage,
});
