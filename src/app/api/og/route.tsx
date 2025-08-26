import React from "react";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Dapatkan URL host dari request
    const url = new URL(req.url);
    const host = url.host;

    // Warna brand
    const primaryColor = "#0057B8"; // Blue Paramount Land

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "40px",
            position: "relative",
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundSize: "20px 20px",
              backgroundImage: `radial-gradient(circle, ${primaryColor}20 1px, transparent 1px)`,
              opacity: 0.3,
            }}
          />

          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <img
              src={`https://${host}/images/paramount-logo-dark.png`}
              alt="Paramount Land Logo"
              width={300}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Main text */}
          <h1
            style={{
              fontSize: 60,
              fontWeight: 800,
              margin: 0,
              marginBottom: "20px",
              color: primaryColor,
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            Building Homes and People with Heart
          </h1>

          <p
            style={{
              fontSize: 28,
              margin: 0,
              color: "#333",
              textAlign: "center",
              maxWidth: "70%",
            }}
          >
            Developer properti premium dengan fokus pada hunian berkualitas dan
            properti komersial
          </p>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: 24, color: primaryColor }}>
              www.rizalparamountland.com
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
