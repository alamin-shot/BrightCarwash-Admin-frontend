import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: ['10.10.33.10'],
	images: {
		unoptimized: true,
	},
	reactCompiler: true,
};

export default nextConfig;
