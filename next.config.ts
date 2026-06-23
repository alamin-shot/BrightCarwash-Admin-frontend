// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
// 	/* config options here */
// 	allowedDevOrigins: ['10.10.33.10'],
// 	images: {
// 		unoptimized: true,
// 	},
// 	reactCompiler: true,
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: { unoptimized: true },
	reactCompiler: true,
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "https://happens-sagem-wishes-basket.trycloudflare.com/api/:path*",
			},
		];
	},
};

export default nextConfig;