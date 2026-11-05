import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto para que Turbopack no tome un package-lock.json
  // de una carpeta superior (p. ej. C:\Users\<usuario>\package-lock.json).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
