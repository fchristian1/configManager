import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import htmlImport from "@ayatkyo/vite-plugin-html-import";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), htmlImport()],
    base: "/manager/",
});
