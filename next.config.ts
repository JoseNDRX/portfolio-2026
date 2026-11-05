import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportación estática: `npm run build` genera la carpeta `out/` con HTML,
  // CSS y JS listos para servirse como archivos (Cloudflare Workers con
  // static assets, ver wrangler.jsonc). Todas las páginas del sitio son estáticas.
  output: "export",

  // El optimizador de imágenes de Next necesita un servidor; en exportación
  // estática las imágenes se sirven tal cual (ya están en tamaño web).
  images: {
    unoptimized: true,
  },

  // Fija la raíz del proyecto para que Turbopack no tome un package-lock.json
  // de una carpeta superior (p. ej. C:\Users\<usuario>\package-lock.json).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
