import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import htmlImport from "@ayatkyo/vite-plugin-html-import";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), htmlImport()],
    base: "/manager/",
    server: {
        port: 5174,
        host: "localhost",
        hmr: {
            host: "localhost",
            port: 5174,
            protocol: "ws",
            path: "/manager/hmr",
        },
    },
});
