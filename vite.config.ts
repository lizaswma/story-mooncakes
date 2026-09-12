import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// See PRD.md §3 (tech stack) and §4 (bilingual).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "apple-touch-icon.png"],
      manifest: {
        name: "小兔过中秋节 · Little Rabbit's Mooncake Festival",
        short_name: "小兔过中秋节",
        description:
          "An interactive bilingual (中文 / English) Mid-Autumn storybook for toddlers.",
        lang: "zh-CN",
        dir: "ltr",
        theme_color: "#d98f4e",
        background_color: "#fdf3e8",
        display: "standalone",
        orientation: "landscape",
        start_url: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Precache every asset type the book uses so it works fully offline (PRD §3).
        globPatterns: [
          "**/*.{js,css,html,svg,png,webp,jpg,jpeg,mp3,ogg,woff2}",
        ],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
  server: { port: 5174, host: true },
  preview: { port: 4174 },
});
