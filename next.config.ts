import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: [
		'10.10.33.10',
		"https://bridge-decent-operational-power.trycloudflare.com"
	],
	images: {
		unoptimized: true,
	},
	reactCompiler: true,
};

export default nextConfig;


