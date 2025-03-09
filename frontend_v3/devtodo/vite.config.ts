import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// @ts-ignore
import htmlImport from "@ayatkyo/vite-plugin-html-import";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), htmlImport(), tailwindcss()],
    base: "/devtodo/",
    server: {
        port: 5175,
        host: "localhost",
        hmr: {
            host: "localhost",
            port: 5175,
            protocol: "ws",
            path: "/manager/hmr",
        },
    },
});
