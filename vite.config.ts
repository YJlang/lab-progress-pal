import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  const plugins = [
    tsConfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    tailwindcss(),
    react(),
  ];

  if (!isDev) {
    plugins.push(cloudflare());
  }

  return {
    resolve: {
      alias: { "@": "/src" },
      dedupe: ["react", "react-dom"],
    },
    plugins,
  };
});
