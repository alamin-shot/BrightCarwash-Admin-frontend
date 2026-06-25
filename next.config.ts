import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: [
		'10.10.33.10',
		'https://habits-obvious-advanced-textbook.trycloudflare.com',
		'https://stephen-britannica-collect-maui.trycloudflare.com',
		"https://adjustments-sufficient-roll-heads.trycloudflare.com"
	],
	images: {
		unoptimized: true,
	},
	reactCompiler: true,
};

export default nextConfig;


