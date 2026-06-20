'use client';

import Image from 'next/image';

interface IconProps {
	name: string;
	width?: number;
	height?: number;
	className?: string;
	color?: string;
}

export function Icon({
	name,
	width = 20,
	height = 20,
	className = '',
	color,
}: IconProps) {
	if (color) {
		return (
			<span
				className={`inline-block ${className}`}
				style={{
					width,
					height,
					backgroundColor: color,
					WebkitMask: `url(/icons/svgs/${name}.svg) no-repeat center / contain`,
					mask: `url(/icons/svgs/${name}.svg) no-repeat center / contain`,
				}}
			/>
		);
	}

	return (
		<Image
			src={`/icons/svgs/${name}.svg`}
			alt={`${name} icon`}
			width={width}
			height={height}
			className={className}
			unoptimized
		/>
	);
}
