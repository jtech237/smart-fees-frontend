import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest{
  return {
    name: "Smart Fees",
    short_name: "Smart Fees",
    description: "Make fees",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        "src": "/assets/icons/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/assets/icons/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",

  }
}
