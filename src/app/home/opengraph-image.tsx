import { ImageResponse } from "next/og";
import { siteConfig } from "../metadata";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Paramount Land - Building Homes and People with Heart";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation - specific for homepage
export default async function Image() {
  // Use a higher-quality image with better dimensions for WhatsApp sharing
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <img
          src={siteConfig.ogImage}
          alt={siteConfig.name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            width: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            padding: "20px 40px",
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: "48px", fontWeight: "bold" }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: "24px", marginTop: "10px" }}>
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
