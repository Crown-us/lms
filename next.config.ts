import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // Menambahkan dua baris ini untuk SVG
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

        // Konfigurasi remotePatterns yang sudah ada
        remotePatterns: [
            {
                hostname: "edukt-lms.t3.storage.dev",
                port: "",
                protocol: 'https',
            }
        ]
    }
};

export default nextConfig;