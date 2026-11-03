import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" lets the build work on Vercel, Netlify and GitHub Pages (repo sub-path) alike.
export default defineConfig({ plugins: [react()], base: "./" });
