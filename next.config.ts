import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Phosphor exporta miles de iconos desde un barrel; sin esto, importar un
    // solo icono arrastra todo el grafo del paquete y ralentiza compilacion en
    // dev y el bundle en produccion. Lo transforma a imports directos por icono.
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
