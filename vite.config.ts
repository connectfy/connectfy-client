// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENV),
    },
    server: {
      port: 4800, // ✅ Set dev server port here
      host: true,
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: [
        // "@/something" => "src/something"
        { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, "src/$1") },

        // "@store/whatever" => "src/store/whatever"
        {
          find: /^@store\/(.*)$/,
          replacement: path.resolve(__dirname, "src/store/$1"),
        },
        {
          find: /^@components\/(.*)$/,
          replacement: path.resolve(__dirname, "src/components/$1"),
        },
        {
          find: /^@assets\/(.*)$/,
          replacement: path.resolve(__dirname, "src/assets/$1"),
        },
        {
          find: /^@constants\/(.*)$/,
          replacement: path.resolve(__dirname, "src/constants/$1"),
        },
        {
          find: /^@features\/(.*)$/,
          replacement: path.resolve(__dirname, "src/features/$1"),
        },
        {
          find: /^@hooks\/(.*)$/,
          replacement: path.resolve(__dirname, "src/hooks/$1"),
        },
        {
          find: /^@pages\/(.*)$/,
          replacement: path.resolve(__dirname, "src/pages/$1"),
        },
        {
          find: /^@utils\/(.*)$/,
          replacement: path.resolve(__dirname, "src/utils/$1"),
        },
        {
          find: /^@context\/(.*)$/,
          replacement: path.resolve(__dirname, "src/context/$1"),
        },
        {
          find: /^@routes\/(.*)$/,
          replacement: path.resolve(__dirname, "src/routes/$1"),
        },
        {
          find: /^@styles\/(.*)$/,
          replacement: path.resolve(__dirname, "src/styles/$1"),
        },
        {
          find: /^@types\/(.*)$/,
          replacement: path.resolve(__dirname, "src/types/$1"),
        },

        // also provide plain shortcuts (optional)
        { find: "@store", replacement: path.resolve(__dirname, "src/store") },
        {
          find: "@components",
          replacement: path.resolve(__dirname, "src/components"),
        },
        { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
      ],
    },
    build: {
      outDir: "dist",
    },
  };
});
