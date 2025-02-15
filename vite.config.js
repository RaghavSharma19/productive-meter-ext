import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'; // <-- Add this line
import fs from 'fs';

export default defineConfig({
  base: "",
  plugins: [react(),
    {
      writeBundle() {
        const manifestPath = resolve(__dirname, "dist/manifest.json");
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
          manifest.background.service_worker = "assets/background.js"; // Update the path
          fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        background: resolve(__dirname, "src/background.js"), // Using resolve here
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  }
});
