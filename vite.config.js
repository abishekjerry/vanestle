import { defineConfig,loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  return {
      base: "./",
      plugins: [react()],
      server: {
        proxy: {
          "/api": {
            target: "https://ebiz.pmgasia.com", 
            changeOrigin: true,
            secure: false,
            rewrite: (path) =>
              path.replace(/^\/api/, "/iWeb/virtualagency/vagit/api"),
          },
        },
      },
  }
});
